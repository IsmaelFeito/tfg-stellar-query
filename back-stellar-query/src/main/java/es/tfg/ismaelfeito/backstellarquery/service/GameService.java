package es.tfg.ismaelfeito.backstellarquery.service;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Mision;
import es.tfg.ismaelfeito.backstellarquery.game.entity.Progreso;
import es.tfg.ismaelfeito.backstellarquery.game.repository.MisionRepository;
import es.tfg.ismaelfeito.backstellarquery.game.repository.ProgresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class GameService {

    @Autowired
    private MisionRepository misionRepository;

    @Autowired
    private ProgresoRepository progresoRepository;

    // Inyectamos el DataSource del juego para ejecutar SQL dinámico con JDBC
    @Autowired
    @Qualifier("gameDataSource")
    private DataSource gameDataSource;

    // Tablas consultables por el usuario. Las tablas meta (misions, progreso)
    // están fuera de la lista para que el jugador no pueda ver las respuestas.
    private static final Set<String> ALLOWED_TABLES = Set.of(
            "crew_mates", "ships", "departaments", "class", "ships_class"
    );

    // ─── Record interno para transportar el resultado de una query ──────────
    private record QueryResult(List<String> columns, List<Map<String, Object>> rows) {}

    // ─── DTO de respuesta ────────────────────────────────────────────────────
    public record QueryResponse(
            boolean success,
            List<String> columns,
            List<Map<String, Object>> rows,
            String message,
            int xp,
            String feedback
    ) {
        static QueryResponse error(String msg) {
            return new QueryResponse(false, List.of(), List.of(), msg, 0, null);
        }
    }

    // ─── Punto de entrada principal ──────────────────────────────────────────

    /**
     * Ejecuta la query del usuario contra la BD de juego, la compara con la
     * solución oficial y actualiza el progreso.
     *
     * @param userSql  Query enviada por el jugador
     * @param misionId ID de la misión activa
     * @param username Username extraído del JWT
     */
    public QueryResponse executeQuery(String userSql, Long misionId, String username) {

        // 1. Validar que sea un SELECT
        String trimmed = userSql == null ? "" : userSql.trim();
        if (!trimmed.toUpperCase().startsWith("SELECT")) {
            return QueryResponse.error("Solo se permiten consultas SELECT.");
        }

        // 2. Prevención básica: bloquear punto y coma en medio (multi-statement)
        //    Las queries válidas de una sola instrucción no lo necesitan.
        if (trimmed.indexOf(';') != -1 && trimmed.indexOf(';') < trimmed.length() - 1) {
            return QueryResponse.error("No se permiten múltiples instrucciones en la misma query.");
        }

        // 3. Comprobar que no intenta leer tablas protegidas
        String sqlLower = trimmed.toLowerCase();
        for (String forbidden : List.of("misions", "progreso", "misions_config")) {
            if (sqlLower.contains(forbidden)) {
                return QueryResponse.error("No puedes acceder a la tabla '" + forbidden + "'.");
            }
        }

        // 4. Obtener la misión
        Optional<Mision> opt = misionRepository.findById(misionId);
        if (opt.isEmpty()) {
            return QueryResponse.error("Misión no encontrada.");
        }
        Mision mision = opt.get();

        // 5. Ejecutar query del usuario (con timeout de 5 segundos)
        QueryResult userResult;
        try {
            userResult = runSql(trimmed);
        } catch (SQLTimeoutException e) {
            return QueryResponse.error("Tu consulta tardó demasiado. Revisa que no genere demasiados resultados.");
        } catch (SQLException e) {
            // Devolvemos el mensaje de PostgreSQL tal cual — es útil para aprender
            return QueryResponse.error("Error SQL: " + e.getMessage());
        }

        // 6. Ejecutar la query correcta internamente para comparar
        QueryResult correctResult;
        try {
            correctResult = runSql(mision.getQueryCorrect());
        } catch (SQLException e) {
            return QueryResponse.error("Error interno al validar la misión. Contacta al administrador.");
        }

        // 7. Comparar resultados
        boolean success = compareResults(userResult, correctResult);

        // 8. Actualizar progreso en BD
        updateProgreso(username, misionId, success, mision.getXpReward());

        // 9. Construir respuesta
        String mensaje = success
                ? "¡Correcto! Has completado la misión."
                : "Resultado incorrecto. Revisa tu consulta e inténtalo de nuevo.";

        String feedback = success ? null : buildFeedback(userResult, correctResult);

        return new QueryResponse(
                success,
                userResult.columns(),
                userResult.rows(),
                mensaje,
                success ? mision.getXpReward() : 0,
                feedback
        );
    }

    // ─── Ejecución JDBC ──────────────────────────────────────────────────────

    private QueryResult runSql(String sql) throws SQLException {
        try (Connection conn = gameDataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            stmt.setQueryTimeout(5);  // Máximo 5 segundos por query

            try (ResultSet rs = stmt.executeQuery(sql)) {
                ResultSetMetaData meta = rs.getMetaData();
                int colCount = meta.getColumnCount();

                // Extraer nombres de columnas
                List<String> columns = new ArrayList<>();
                for (int i = 1; i <= colCount; i++) {
                    columns.add(meta.getColumnLabel(i));
                }

                // Extraer filas como Map<columna, valor>
                List<Map<String, Object>> rows = new ArrayList<>();
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (String col : columns) {
                        row.put(col, rs.getObject(col));
                    }
                    rows.add(row);
                }

                return new QueryResult(columns, rows);
            }
        }
    }

    // ─── Comparación de resultados ───────────────────────────────────────────

    /**
     * Compara dos conjuntos de resultados.
     * Criterios:
     *  - Mismas columnas (sin importar el orden de las columnas)
     *  - Mismo número de filas
     *  - Mismo contenido (sin importar el orden de las filas)
     */
    private boolean compareResults(QueryResult user, QueryResult correct) {
        // Comparar columnas (ignora orden de columnas pero no nombres)
        Set<String> userCols    = new HashSet<>(user.columns());
        Set<String> correctCols = new HashSet<>(correct.columns());
        if (!userCols.equals(correctCols)) {
            return false;
        }

        if (user.rows().size() != correct.rows().size()) {
            return false;
        }

        // Normalizar filas a string lowercase y ordenar para comparar sin
        // depender del orden que devuelva PostgreSQL
        List<String> userSorted = user.rows().stream()
                .map(row -> normalizeRow(row, user.columns()))
                .sorted()
                .toList();

        List<String> correctSorted = correct.rows().stream()
                .map(row -> normalizeRow(row, correct.columns()))
                .sorted()
                .toList();

        return userSorted.equals(correctSorted);
    }

    /** Serializa una fila a string ordenando sus claves para comparación estable. */
    private String normalizeRow(Map<String, Object> row, List<String> columns) {
        StringBuilder sb = new StringBuilder();
        // Recorremos las columnas siempre en el mismo orden (alfabético)
        columns.stream().sorted().forEach(col -> {
            Object val = row.get(col);
            sb.append(col).append("=")
                    .append(val == null ? "null" : val.toString().toLowerCase())
                    .append("|");
        });
        return sb.toString();
    }

    // ─── Actualización de progreso ───────────────────────────────────────────

    private void updateProgreso(String username, Long misionId, boolean success, int xpReward) {
        Progreso p = progresoRepository
                .findByUsernameAndMisionId(username, misionId)
                .orElseGet(() -> {
                    Progreso np = new Progreso();
                    np.setUsername(username);
                    np.setMisionId(misionId);
                    np.setCompletada(false);
                    np.setIntentos(0);
                    np.setXpGanado(0);
                    return np;
                });

        p.setIntentos(p.getIntentos() + 1);

        // El XP solo se otorga la primera vez que se completa
        if (success && !Boolean.TRUE.equals(p.getCompletada())) {
            p.setCompletada(true);
            p.setXpGanado(xpReward);
        }

        progresoRepository.save(p);
    }

    // ─── Feedback útil para el jugador ──────────────────────────────────────

    private String buildFeedback(QueryResult user, QueryResult correct) {
        if (user.rows().size() != correct.rows().size()) {
            return String.format(
                    "Tu consulta devuelve %d fila(s), pero se esperaban %d.",
                    user.rows().size(), correct.rows().size()
            );
        }
        Set<String> userCols    = new HashSet<>(user.columns());
        Set<String> correctCols = new HashSet<>(correct.columns());
        if (!userCols.equals(correctCols)) {
            return "Las columnas devueltas no coinciden con las esperadas.";
        }
        return "Las filas no coinciden. Revisa las condiciones WHERE u ORDER BY.";
    }
}

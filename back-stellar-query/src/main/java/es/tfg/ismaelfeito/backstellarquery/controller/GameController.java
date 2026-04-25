package es.tfg.ismaelfeito.backstellarquery.controller;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Mision;
import es.tfg.ismaelfeito.backstellarquery.game.entity.Progreso;
import es.tfg.ismaelfeito.backstellarquery.game.repository.MisionRepository;
import es.tfg.ismaelfeito.backstellarquery.game.repository.ProgresoRepository;
import es.tfg.ismaelfeito.backstellarquery.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private MisionRepository misionRepository;

    @Autowired
    private ProgresoRepository progresoRepository;

    @Autowired
    private GameService gameService;

    // ─── GET /api/game/misiones ───────────────────────────────────────────────
    // Lista todas las misiones ordenadas por su campo "orden".
    // No incluye query_correct (JsonIgnore en la entidad).
    @GetMapping("/misiones")
    public ResponseEntity<List<Mision>> getMisiones() {
        return ResponseEntity.ok(misionRepository.findAllByOrderByOrdenAsc());
    }

    // ─── GET /api/game/misiones/{id} ─────────────────────────────────────────
    // Devuelve una misión concreta. Útil para cargar el detalle al entrar en GamePage.
    @GetMapping("/misiones/{id}")
    public ResponseEntity<?> getMision(@PathVariable Long id) {
        return misionRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── POST /api/game/query ─────────────────────────────────────────────────
    // Recibe la query del jugador, la ejecuta contra la BD de juego,
    // la compara con la solución oficial y devuelve el resultado.
    //
    // Body esperado: { "query": "SELECT ...", "misionId": 1 }
    //
    // El usuario se obtiene del SecurityContext (lo pone JwtAuthFilter),
    // así que no hace falta pasarlo en el body.
    @PostMapping("/query")
    public ResponseEntity<GameService.QueryResponse> executeQuery(
            @RequestBody Map<String, Object> body) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        String sql      = (String) body.get("query");
        Long misionId   = ((Number) body.get("misionId")).longValue();

        GameService.QueryResponse response = gameService.executeQuery(sql, misionId, username);
        return ResponseEntity.ok(response);
    }

    // ─── GET /api/game/progreso ───────────────────────────────────────────────
    // Devuelve el progreso completo del usuario autenticado.
    // El front lo usa para mostrar qué misiones están completadas y el XP total.
    @GetMapping("/progreso")
    public ResponseEntity<List<Progreso>> getProgreso() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(progresoRepository.findByUsername(username));
    }
}

-- docker/db_game/init.sql
-- Inicialización de la base de datos GAME
-- Tablas, relaciones y datos por defecto

-- ============================================
-- TABLAS PRINCIPALES (datos del juego)
-- ============================================

-- Naves
CREATE TABLE IF NOT EXISTS ships (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(200)
);

-- Departamentos
CREATE TABLE IF NOT EXISTS departaments (
    id          BIGSERIAL PRIMARY KEY,
    dep_name    VARCHAR(100) NOT NULL
);

-- Tripulantes
CREATE TABLE IF NOT EXISTS crew_mates (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    range       INTEGER NOT NULL DEFAULT 1,
    state       VARCHAR(20) CHECK (state IN ('activo', 'inactivo', 'herido')) DEFAULT 'activo',
    joined      DATE NOT NULL,
    id_ships    INTEGER REFERENCES ships(id),
    id_dept     INTEGER REFERENCES departaments(id)
);

-- Clases de naves
CREATE TABLE IF NOT EXISTS class (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(50)
);

-- Relación naves-clase
CREATE TABLE IF NOT EXISTS ships_class (
    id_ships    INTEGER REFERENCES ships(id),
    id_class    INTEGER REFERENCES class(id)
);

-- ============================================
-- TABLAS DE MISIONES Y PROGRESO
-- ============================================

-- Misiones ("order" es palabra reservada en SQL → se escapa con comillas)
CREATE TABLE IF NOT EXISTS misions (
    id                  BIGSERIAL PRIMARY KEY,
    title               VARCHAR(200) NOT NULL,
    description_txt     TEXT NOT NULL,
    statement_txt       TEXT NOT NULL,
    query_correct       TEXT NOT NULL,
    level               VARCHAR(20) CHECK (level IN ('basico','intermedio','avanzado')) DEFAULT 'basico',
    xp_reward           INTEGER DEFAULT 100,
    "order"             INTEGER NOT NULL,
    done                BOOLEAN DEFAULT FALSE
);

-- Configuración de validación por misión
CREATE TABLE IF NOT EXISTS misions_config (
    mision_id        BIGINT REFERENCES misions(id),
    orden_importa    BOOLEAN DEFAULT FALSE,
    columnas_exactas BOOLEAN DEFAULT TRUE
);

-- Progreso del jugador por misión
-- username es string porque users está en otra BD (no podemos usar FK cross-DB)
CREATE TABLE IF NOT EXISTS progreso (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(20)  NOT NULL,
    mision_id   BIGINT      NOT NULL REFERENCES misions(id) ON DELETE CASCADE,
    completada  BOOLEAN      DEFAULT FALSE,
    intentos    INTEGER      DEFAULT 0,
    xp_ganado   INTEGER      DEFAULT 0,
    UNIQUE (username, mision_id)
);

-- Índice para acelerar las consultas de progreso por usuario
CREATE INDEX IF NOT EXISTS idx_progreso_username ON progreso(username);

-- ============================================
-- DATOS POR DEFECTO
-- ============================================

INSERT INTO ships (name, description) VALUES
    ('Nebula-7',    'Nave de exploración intergaláctica'),
    ('Orion-3',     'Nave de combate y defensa'),
    ('Andromeda-X', 'Nave de transporte de carga'),
    ('Aurora-1',    'Nave científica de investigación');

INSERT INTO departaments (dep_name) VALUES
    ('Ingeniería'),
    ('Navegación'),
    ('Medicina'),
    ('Seguridad'),
    ('Ciencia');

INSERT INTO class (name) VALUES
    ('Exploración'),
    ('Combate'),
    ('Transporte'),
    ('Científica');

INSERT INTO ships_class (id_ships, id_class) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4);

INSERT INTO crew_mates (name, range, state, joined, id_ships, id_dept) VALUES
    ('Zara Vega',   5, 'activo',   '2341-03-12', 1, 1),
    ('Kaito Mori',  4, 'activo',   '2341-07-22', 1, 2),
    ('Lira Santos', 3, 'activo',   '2342-01-09', 1, 3),
    ('Axel Fermi',  2, 'herido',   '2342-06-15', 1, 1),
    ('Sora Vance',  3, 'inactivo', '2341-11-20', 2, 4),
    ('Nova Reyes',  1, 'activo',   '2343-02-01', 3, 2),
    ('Ren Okafor',  5, 'activo',   '2340-08-30', 2, 1),
    ('Mia Chen',    2, 'activo',   '2343-05-14', 4, 5);

INSERT INTO misions (title, description_txt, statement_txt, query_correct, level, xp_reward, "order") VALUES
    (
        'Recuperar tripulantes activos',
        'El sistema de personal ha perdido el registro de la tripulación activa. Necesitamos saber quiénes están operativos.',
        'Obtén todos los datos de los tripulantes cuyo estado sea activo.',
        'SELECT * FROM crew_mates WHERE state = ''activo''',
        'basico', 100, 1
    ),
    (
        'Oficiales de alto rango',
        'Necesitamos identificar a los oficiales senior para liderar la reparación del reactor.',
        'Obtén el nombre y rango de los tripulantes con rango mayor a 3, ordenados de mayor a menor rango.',
        'SELECT name, range FROM crew_mates WHERE range > 3 ORDER BY range DESC',
        'basico', 150, 2
    ),
    (
        'Tripulantes de la Nebula-7',
        'El manifiesto de la nave principal está corrupto. Necesitamos reconstruirlo.',
        'Lista el nombre de cada tripulante junto con el nombre de su nave, solo para los de la Nebula-7.',
        'SELECT c.name, s.name as nave FROM crew_mates c INNER JOIN ships s ON c.id_ships = s.id WHERE s.name = ''Nebula-7''',
        'intermedio', 200, 3
    );

INSERT INTO misions_config (mision_id, orden_importa, columnas_exactas) VALUES
    (1, FALSE, TRUE),
    (2, TRUE,  TRUE),
    (3, FALSE, TRUE);

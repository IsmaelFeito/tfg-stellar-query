-- -- docker/db_game/init.sql

-- -- games tables for the user:

-- CREATE TABLE IF NOT EXISTS crew_mates (
--     id          BIGSERIAL PRIMARY KEY,
--     name        VARCHAR(50) NOT NULL,
--     range       INTEGER NOT NULL DEFAULT 1,
--     state       VARCHAR(20) CHECK (state in ('activo', 'inactivo', 'herido')) DEFAULT 'activo',
--     joined      DATE NOT NULL,
--     id_ships    INTEGER REFERENCES ships (id),
--     id_dept     INTEGER REFERENCES departaments (id)
-- );

-- CREATE TABLE ships (
--     id          BIGSERIAL PRIMARY KEY,
--     name        VARCHAR(100) NOT NULL,
--     description VARCHAR(200)
-- );

-- CREATE TABLE departaments (
--     id      BIGSERIAL PRIMARY KEY,
--     dep_name    VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE class (
--     id      BIGSERIAL PRIMARY KEY,
--     name    VARCHAR(50)
-- );

-- CREATE TABLE ships_class (
--     id_ships    INTEGER REFERENCES ships (id),
--     id_class    INTEGER REFERENCES class (id)
-- );


-- -- statements for users / misions
-- CREATE TABLE misions (
--     id                  BIGSERIAL PRIMARY KEY,
--     title               VARCHAR(200) NOT NULL,
--     description_txt     TEXT NOT NULL,
--     statement_txt       TEXT NOT NULL,        -- instrucción que ve el jugador
--     query_correct       TEXT NOT NULL,        -- la solución oficial
--     level               VARCHAR(20) CHECK (nivel IN ('basico','intermedio','avanzado')) DEFAULT 'basico',
--     xp_reward           INTEGER DEFAULT 100,
--     order               INTEGER NOT NULL,
--     done                BOOLEAN DEFAULT FALSE
-- );

-- -- -- Default data inserted

-- -- INSERT INTO naves (nombre, clase) VALUES
-- --     ('Nebula-7', 'Exploración'),
-- --     ('Orion-3',  'Combate');

-- -- INSERT INTO departamentos (nombre) VALUES
-- --     ('Ingeniería'),
-- --     ('Navegación'),
-- --     ('Medicina'),
-- --     ('Seguridad');

-- -- INSERT INTO tripulantes
-- --     (name, range, state, joined, id_ships, id_dept) VALUES
-- --     ('Zara Vega',   5, 'activo',   '2341-03-12', 1, 1),
-- --     ('Kaito Mori',  4, 'activo',   '2341-07-22', 1, 2),
-- --     ('Lira Santos', 3, 'activo',   '2342-01-09', 1, 3),
-- --     ('Axel Fermi',  2, 'herido',   '2342-06-15', 1, 1),
-- --     ('Sora Vance',  3, 'inactivo', '2341-11-20', 2, 4),
-- --     ('Nova Reyes',  1, 'activo',   '2343-02-01', 2, 2),
-- --     ('Ren Okafor',  5, 'activo',   '2340-08-30', 2, 1),
-- --     ('Mia Chen',    2, 'activo',   '2343-05-14', 1, 3);

-- -- INSERT INTO misiones
-- --     (titulo, descripcion, enunciado, query_correcta, nivel, xp_reward, orden) VALUES
-- --     (
-- --         'Recuperar tripulantes activos',
-- --         'El sistema de personal ha perdido el registro de la tripulación activa.',
-- --         'Obtén todos los datos de los tripulantes cuyo estado sea activo.',
-- --         'SELECT * FROM tripulantes WHERE estado = ''activo''',
-- --         'basico', 100, 1
-- --     ),
-- --     (
-- --         'Oficiales de alto rango',
-- --         'Necesitamos identificar a los oficiales senior para la reparación.',
-- --         'Obtén el nombre y rango de los tripulantes con rango mayor a 3, ordenados de mayor a menor rango.',
-- --         'SELECT nombre, rango FROM tripulantes WHERE rango > 3 ORDER BY rango DESC',
-- --         'basico', 150, 2
-- --     ),
-- --     (
-- --         'Tripulantes de la Nebula-7',
-- --         'El manifiesto de la nave principal está corrupto.',
-- --         'Lista el nombre de cada tripulante junto con el nombre de su nave, solo para los de la Nebula-7.',
-- --         'SELECT t.nombre, n.nombre as nave FROM tripulantes t INNER JOIN naves n ON t.nave_id = n.id WHERE n.nombre = ''Nebula-7''',
-- --         'intermedio', 200, 3
-- --     );

-- -- INSERT INTO misiones_config (mision_id, orden_importa, columnas_exactas) VALUES
-- --     (1, FALSE, TRUE),
-- --     (2, TRUE,  TRUE),
-- --     (3, FALSE, TRUE);



-- docker/db_game/init.sql
-- Inicialización de la base de datos GAME
-- Tablas, relaciones y datos por defecto

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Naves
CREATE TABLE IF NOT EXISTS ships (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(200)
);

-- Departamentos
CREATE TABLE IF NOT EXISTS departaments (
    id      BIGSERIAL PRIMARY KEY,
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

-- Misiones
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

-- Configuración de misiones
CREATE TABLE IF NOT EXISTS misions_config (
    mision_id      INTEGER REFERENCES misions(id),
    orden_importa  BOOLEAN DEFAULT FALSE,
    columnas_exactas BOOLEAN DEFAULT TRUE
);

-- ============================================
-- DATOS POR DEFECTO
-- ============================================

-- Insertar datos en ships
INSERT INTO ships (name, description) VALUES
    ('Nebula-7', 'Nave de exploración intergaláctica'),
    ('Orion-3', 'Nave de combate y defensa'),
    ('Andromeda-X', 'Nave de transporte de carga'),
    ('Aurora-1', 'Nave científica de investigación');

-- Insertar datos en departaments
INSERT INTO departaments (dep_name) VALUES
    ('Ingeniería'),
    ('Navegación'),
    ('Medicina'),
    ('Seguridad'),
    ('Ciencia');

-- Insertar datos en class
INSERT INTO class (name) VALUES
    ('Exploración'),
    ('Combate'),
    ('Transporte'),
    ('Científica');

-- Insertar relación ships_class
INSERT INTO ships_class (id_ships, id_class) VALUES
    (1, 1),  -- Nebula-7: Exploración
    (2, 2),  -- Orion-3: Combate
    (3, 3),  -- Andromeda-X: Transporte
    (4, 4);  -- Aurora-1: Científica

-- Insertar tripulantes
INSERT INTO crew_mates (name, range, state, joined, id_ships, id_dept) VALUES
    ('Zara Vega',   5, 'activo',   '2341-03-12', 1, 1),
    ('Kaito Mori',  4, 'activo',   '2341-07-22', 1, 2),
    ('Lira Santos', 3, 'activo',   '2342-01-09', 1, 3),
    ('Axel Fermi',  2, 'herido',   '2342-06-15', 1, 1),
    ('Sora Vance',  3, 'inactivo', '2341-11-20', 2, 4),
    ('Nova Reyes',  1, 'activo',   '2343-02-01', 3, 2),
    ('Ren Okafor',  5, 'activo',   '2340-08-30', 2, 1),
    ('Mia Chen',    2, 'activo',   '2343-05-14', 4, 5);

-- Insertar misiones
INSERT INTO misions (title, description_txt, statement_txt, query_correct, level, xp_reward, "order") VALUES
    (
        'Recuperar tripulantes activos',
        'El sistema de personal ha perdido el registro de la tripulación activa.',
        'Obtén todos los datos de los tripulantes cuyo estado sea activo.',
        'SELECT * FROM crew_mates WHERE state = ''activo''',
        'basico', 100, 1
    ),
    (
        'Oficiales de alto rango',
        'Necesitamos identificar a los oficiales senior para la reparación.',
        'Obtén el nombre y rango de los tripulantes con rango mayor a 3, ordenados de mayor a menor rango.',
        'SELECT name, range FROM crew_mates WHERE range > 3 ORDER BY range DESC',
        'basico', 150, 2
    ),
    (
        'Tripulantes de la Nebula-7',
        'El manifiesto de la nave principal está corrupto.',
        'Lista el nombre de cada tripulante junto con el nombre de su nave, solo para los de la Nebula-7.',
        'SELECT c.name, s.name as nave FROM crew_mates c INNER JOIN ships s ON c.id_ships = s.id WHERE s.name = ''Nebula-7''',
        'intermedio', 200, 3
    );

-- Configuración de misiones
INSERT INTO misions_config (mision_id, orden_importa, columnas_exactas) VALUES
    (1, FALSE, TRUE),
    (2, TRUE,  TRUE),
    (3, FALSE, TRUE);
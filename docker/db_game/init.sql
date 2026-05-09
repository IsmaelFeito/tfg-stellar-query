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
 
-- ============================================================
-- BASICO: SELECT simples, WHERE, ORDER BY
-- ============================================================
 
(
    'Tripulación completa',
    'Los registros de la flota están dispersos. Necesitamos un censo completo de toda la tripulación para comenzar la misión.',
    'Obtén el nombre y estado de todos los tripulantes.',
    'SELECT name, state FROM crew_mates',
    'basico', 80, 1
),
(
    'Tripulantes activos',
    'Solo los tripulantes activos pueden participar en la misión de rescate. Identifícalos.',
    'Obtén todos los datos de los tripulantes cuyo estado sea activo.',
    'SELECT * FROM crew_mates WHERE state = ''activo''',
    'basico', 100, 2
),
(
    'Oficiales de alto rango',
    'La reparación del reactor requiere oficiales experimentados. Necesitamos a los de mayor rango.',
    'Obtén el nombre y rango de los tripulantes con rango mayor a 3, ordenados de mayor a menor rango.',
    'SELECT name, range FROM crew_mates WHERE range > 3 ORDER BY range DESC',
    'basico', 120, 3
),
(
    'Naves de la flota',
    'El mapa de navegación está corrupto. Recupera el inventario completo de naves disponibles.',
    'Obtén el nombre y descripción de todas las naves, ordenadas alfabéticamente por nombre.',
    'SELECT name, description FROM ships ORDER BY name ASC',
    'basico', 100, 4
),
(
    'Tripulantes heridos o inactivos',
    'Necesitamos localizar al personal no operativo para evacuar a la enfermería.',
    'Obtén el nombre y estado de los tripulantes cuyo estado sea herido o inactivo.',
    'SELECT name, state FROM crew_mates WHERE state = ''herido'' OR state = ''inactivo''',
    'basico', 120, 5
),
 
-- ============================================================
-- INTERMEDIO: JOIN, GROUP BY, COUNT, funciones de agregación
-- ============================================================
 
(
    'Tripulantes de la Nebula-7',
    'El manifiesto de la nave principal está corrupto. Necesitamos saber quién va a bordo.',
    'Lista el nombre de cada tripulante junto con el nombre de su nave, solo para los de la Nebula-7.',
    'SELECT c.name, s.name as nave FROM crew_mates c INNER JOIN ships s ON c.id_ships = s.id WHERE s.name = ''Nebula-7''',
    'intermedio', 180, 6
),
(
    'Personal por departamento',
    'El sistema de recursos humanos necesita un recuento de efectivos por área para asignar las tareas de reparación.',
    'Obtén el nombre de cada departamento y el número de tripulantes que tiene, ordenado de mayor a menor.',
    'SELECT d.dep_name, COUNT(c.id) as total FROM departaments d LEFT JOIN crew_mates c ON c.id_dept = d.id GROUP BY d.dep_name ORDER BY total DESC',
    'intermedio', 200, 7
),
(
    'Nave y departamento de cada tripulante',
    'El coordinador de la misión necesita saber en qué nave y área trabaja cada miembro activo de la tripulación.',
    'Lista el nombre del tripulante, el nombre de su nave y el nombre de su departamento, solo para tripulantes activos.',
    'SELECT c.name, s.name as nave, d.dep_name as departamento FROM crew_mates c JOIN ships s ON c.id_ships = s.id JOIN departaments d ON c.id_dept = d.id WHERE c.state = ''activo''',
    'intermedio', 220, 8
),
 
-- ============================================================
-- AVANZADO: subconsultas, HAVING, agregaciones complejas
-- ============================================================
 
(
    'Naves con más de un tripulante activo',
    'Solo las naves con suficiente personal operativo pueden ser despachadas. Identifica cuáles están listas.',
    'Obtén el nombre de las naves que tienen más de 1 tripulante en estado activo, junto con el recuento.',
    'SELECT s.name as nave, COUNT(c.id) as activos FROM ships s JOIN crew_mates c ON c.id_ships = s.id WHERE c.state = ''activo'' GROUP BY s.name HAVING COUNT(c.id) > 1',
    'avanzado', 280, 9
),
(
    'El oficial de mayor rango por nave',
    'Cada nave necesita un comandante. Identifica al tripulante de mayor rango en cada nave.',
    'Obtén el nombre de la nave y el nombre del tripulante con mayor rango en esa nave.',
    'SELECT s.name as nave, c.name as comandante FROM crew_mates c JOIN ships s ON c.id_ships = s.id WHERE c.range = (SELECT MAX(c2.range) FROM crew_mates c2 WHERE c2.id_ships = c.id_ships)',
    'avanzado', 320, 10
);
 
-- Configuración de validación para las 10 misiones
INSERT INTO misions_config (mision_id, orden_importa, columnas_exactas) VALUES
    (1, FALSE, TRUE),
    (2, FALSE, TRUE),
    (3, TRUE,  TRUE),
    (4, TRUE,  TRUE),
    (5, FALSE, TRUE),
    (6, FALSE, TRUE),
    (7, TRUE,  TRUE),
    (8, FALSE, TRUE),
    (9, TRUE,  TRUE),
    (10, FALSE, TRUE);

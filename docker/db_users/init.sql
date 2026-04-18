-- Users login Table

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(20) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login      TIMESTAMP   
);

CREATE TABLE sesiones (
    id         SERIAL PRIMARY KEY,
    usuario_id INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token      VARCHAR(255) UNIQUE NOT NULL
);

-- Indexes for fast users data search
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 1. Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Postgres usa SERIAL para el auto-incremento
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Items
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria_global VARCHAR(100) NOT NULL,
    atributos JSONB, -- JSONB es el estándar profesional en Postgres (más rápido)
    ubicacion VARCHAR(50) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0), -- Postgres no tiene 'UNSIGNED', usamos CHECK
    stock_minimo INTEGER NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Movimientos
CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    tipo VARCHAR(20) NOT NULL,
    motivo TEXT NOT NULL,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Relaciones
    CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
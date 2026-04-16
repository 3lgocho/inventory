-- 0. Definición de Tipos ENUM (coinciden con rename_all = "snake_case")
CREATE TYPE item_category AS ENUM ('redes', 'hardware', 'complemento');

CREATE TYPE item_location AS ENUM (
    'it', 'cs', 'lm', 'billing', 'clerks', 'arche', 
    'deposito', 'ronny', 'en_uso', 'others', 'proveedor'
);

CREATE TYPE user_role AS ENUM ('admin');

-- 1. Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Cambiado de 'nombre' a 'name'
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,    -- Usamos el ENUM user_role
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Items (Catálogo Maestro)
-- Eliminamos 'ubicacion' y 'cantidad' de aquí
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- Cambiado de 'nombre' a 'name'
    global_category item_category NOT NULL, -- Usamos el ENUM
    attributes JSONB, 
    minimum_stock INTEGER NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Stock por Ubicación (NUEVA)
CREATE TABLE item_stock (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    location item_location NOT NULL, -- Usamos el ENUM
    amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_item_location UNIQUE (item_id, location)
);

-- 4. Tabla de Movimientos (Trazabilidad)
CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount INTEGER NOT NULL CHECK (amount > 0),
    origin item_location NOT NULL,      -- De dónde viene
    destination item_location NOT NULL, -- A dónde va
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para optimizar velocidad en el trabajo
CREATE INDEX idx_movements_item ON movements (item_id);
CREATE INDEX idx_item_stock_item ON item_stock (item_id);
CREATE INDEX idx_items_name ON items (name);

-- 5. Función y Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_modtime BEFORE UPDATE ON items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_item_stock_modtime BEFORE UPDATE ON item_stock FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
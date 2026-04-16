-- 1. Arreglar tabla de Movimientos (el error de created_at)
ALTER TABLE movimientos
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
-- 2. Asegurar que Usuarios tenga las fechas que pide el Struct de Rust
ALTER TABLE users
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
-- 3. Asegurar que Items tenga las fechas que pide el Backend
ALTER TABLE items
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
INSERT INTO users (nombre, email, password, rol)
VALUES (
        'Andres Admin',
        'admin@it.com',
        'admin123',
        'ADMIN'
    );
SELECT *
FROM users;
UPDATE users
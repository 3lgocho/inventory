CREATE TABLE IF NOT EXISTS Inventario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Categoria_Global VARCHAR(255) NOT NULL,
    Atributos JSON,
    Ubicacion ENUM('IT', 'Ronnie', 'Deposito', 'En Uso') NOT NULL,
    Cantidad INT NOT NULL DEFAULT 0,
    Stock_Minimo INT NOT NULL DEFAULT 0
);
INSERT INTO Inventario (Categoria_Global, Atributos, Ubicacion, Cantidad, Stock_Minimo) VALUES
('Monitor HDMI', '{"marca": "MSI", "pulgadas": 24, "resolucion": "1080p"}', 'IT', 2, 1),
('Cable de Red', '{"tipo": "Cat6", "longitud": "5m", "color": "azul"}', 'Deposito', 15, 5),
('Laptop VIT', '{"modelo": "M2420", "ram": "16GB", "os": "Fedora"}', 'En Uso', 1, 1),
('Destornilladores', '{"tipo": "Kit precision", "piezas": 32}', 'Ronnie', 1, 1);
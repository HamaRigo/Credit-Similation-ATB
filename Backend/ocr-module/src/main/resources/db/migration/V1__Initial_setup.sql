CREATE TABLE ocr (
                     id VARCHAR(36) PRIMARY KEY,
                     resultats_reconnaissance TEXT,
                     type_document VARCHAR(50),
                     numero_compte VARCHAR(36),
                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

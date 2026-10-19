CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  brand        TEXT,
  category     TEXT,
  price        REAL DEFAULT 0,
  stock        INTEGER DEFAULT 0,
  description  TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS trg_products_updated
AFTER UPDATE ON products
BEGIN
  UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Sample data (10 records) - loaded automatically when the table is empty
INSERT INTO products (product_name, brand, category, price, stock, description) VALUES
('iPhone 15', 'Apple', 'Smartphone', 899.00, 25, '6.1-inch OLED, A16 chip'),
('Galaxy S24', 'Samsung', 'Smartphone', 799.00, 30, '6.2-inch AMOLED, 50MP camera'),
('MacBook Air M2', 'Apple', 'Laptop', 1199.00, 12, '13.6-inch, 8GB RAM, 256GB SSD'),
('ThinkPad X1 Carbon', 'Lenovo', 'Laptop', 1450.00, 8, '14-inch, Intel i7, 16GB RAM'),
('WH-1000XM5', 'Sony', 'Headphones', 349.00, 40, 'Noise-cancelling wireless headphones'),
('AirPods Pro 2', 'Apple', 'Earbuds', 249.00, 55, 'Active noise cancellation, USB-C'),
('iPad 10th Gen', 'Apple', 'Tablet', 449.00, 20, '10.9-inch Liquid Retina display'),
('Pixel 8', 'Google', 'Smartphone', 699.00, 18, '6.2-inch OLED, Tensor G3'),
('Kindle Paperwhite', 'Amazon', 'E-reader', 139.00, 60, '6.8-inch glare-free display'),
('Apple Watch SE', 'Apple', 'Wearable', 249.00, 35, 'Fitness and health tracking');

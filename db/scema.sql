
use laceup;
-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  F_name VARCHAR(50),
  L_name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('customer', 'admin') DEFAULT 'customer'
);
-- PRODUCTS TABLE
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  image_url VARCHAR(255)
);

-- PRODUCT SIZES TABLE (NEW)
CREATE TABLE product_sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  size VARCHAR(10),
  quantity INT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- DISCOUNTS TABLE
CREATE TABLE discounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50),
  type ENUM('percentage', 'fixed'),
  amount DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE
);

-- ORDERS TABLE
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2),
  status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  size_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (size_id) REFERENCES product_sizes(id)
);

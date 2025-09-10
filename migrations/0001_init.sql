-- Initial schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    category TEXT,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
    ON transactions (user_id, date DESC);

---------------------------------------------------------
-- 🔹 Seed Data
---------------------------------------------------------

-- Insert a test user
-- Password = "password123" (bcrypt hash)
INSERT INTO users (email, password)
VALUES (
  'test@example.com',
  '$2a$10$OZ0mQaZzOfzmiEJeZVrDROnhgypKekJy5oQ1OtSWT8gJtIhXCTZKK'
);

-- Insert some test transactions for this user (id = 1)
INSERT INTO transactions (user_id, date, description, category, amount, type)
VALUES
  (1, '2025-09-01', 'Stripe Payment', 'Revenue', 1200.00, 'income'),
  (1, '2025-09-03', 'Office Supplies', 'Expense', -150.00, 'expense'),
  (1, '2025-09-05', 'Consulting Fee', 'Revenue', 3000.00, 'income'),
  (1, '2025-09-07', 'Software Subscription', 'Expense', -99.00, 'expense');
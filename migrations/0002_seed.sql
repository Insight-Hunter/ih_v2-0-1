---------------------------------------------------------
-- 🔹 Seed More Users & Transactions
---------------------------------------------------------

-- User 2: Sarah
-- Password = "secret456"
INSERT INTO users (email, password)
VALUES (
  'sarah@example.com',
  '$2a$10$BGFsPDUv/1ZL1Zp7VJ1o8eZ4ODeF1D2nBkZ3FHv6.lnmsU9okfRZa'
);

-- Transactions for Sarah (user_id = 2)
INSERT INTO transactions (user_id, date, description, category, amount, type)
VALUES
  (2, '2025-09-01', 'Freelance Payment', 'Revenue', 2000.00, 'income'),
  (2, '2025-09-02', 'Laptop Purchase', 'Expense', -1200.00, 'expense'),
  (2, '2025-09-05', 'Dinner with Client', 'Expense', -85.00, 'expense'),
  (2, '2025-09-07', 'Project Bonus', 'Revenue', 500.00, 'income');

---------------------------------------------------------

-- User 3: David
-- Password = "mypassword"
INSERT INTO users (email, password)
VALUES (
  'david@example.com',
  '$2a$10$L71psZ8CkqkgM0K39C9tOeM1tJrlmL6i3pJZVZCEcxF1TwNQ6o5CS'
);

-- Transactions for David (user_id = 3)
INSERT INTO transactions (user_id, date, description, category, amount, type)
VALUES
  (3, '2025-09-01', 'Consulting Income', 'Revenue', 3500.00, 'income'),
  (3, '2025-09-04', 'Coworking Rent', 'Expense', -300.00, 'expense'),
  (3, '2025-09-06', 'Subscription Service', 'Expense', -49.99, 'expense');

---------------------------------------------------------

-- User 4: Emma
-- Password = "letmein"
INSERT INTO users (email, password)
VALUES (
  'emma@example.com',
  '$2a$10$av9CwFhGhJv9BgH1VmG5DeRZ/3Pj5JtFbF3gM8V8lTj9eG5wzBBkm'
);

-- Transactions for Emma (user_id = 4)
INSERT INTO transactions (user_id, date, description, category, amount, type)
VALUES
  (4, '2025-09-02', 'Design Project', 'Revenue', 1500.00, 'income'),
  (4, '2025-09-03', 'Coffee Meeting', 'Expense', -15.00, 'expense'),
  (4, '2025-09-05', 'Software License', 'Expense', -250.00, 'expense'),
  (4, '2025-09-07', 'New Client Retainer', 'Revenue', 1000.00, 'income');
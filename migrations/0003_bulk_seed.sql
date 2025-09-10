---------------------------------------------------------
-- 🔹 Bulk Seed Transactions for Stress Testing
---------------------------------------------------------
-- This will generate ~500 transactions per user
-- Spread across revenue and expense categories

-- Helper: Insert many rows in a loop using recursive CTE
-- ⚠️ SQLite doesn’t have "generate_series" like Postgres,
-- so we use a recursive CTE trick.

-- User IDs we want to bulk seed: 1, 2, 3, 4

WITH RECURSIVE cnt(x) AS (
  SELECT 1
  UNION ALL
  SELECT x+1 FROM cnt WHERE x < 500
)
INSERT INTO transactions (user_id, date, description, category, amount, type)
SELECT
  -- Randomly assign one of the 4 users
  (ABS(RANDOM()) % 4) + 1 AS user_id,

  -- Random date in the past 180 days
  DATE('now', printf('-%d days', ABS(RANDOM()) % 180)) AS date,

  -- Random description from a set
  CASE ABS(RANDOM()) % 5
    WHEN 0 THEN 'Stripe Payment'
    WHEN 1 THEN 'Client Invoice'
    WHEN 2 THEN 'Office Supplies'
    WHEN 3 THEN 'Subscription Service'
    ELSE 'Misc Transaction'
  END AS description,

  -- Random category
  CASE ABS(RANDOM()) % 4
    WHEN 0 THEN 'Revenue'
    WHEN 1 THEN 'Expense'
    WHEN 2 THEN 'Operations'
    ELSE 'Other'
  END AS category,

  -- Random amount between -2000 and +5000
  (ABS(RANDOM()) % 7000) - 2000 AS amount,

  -- Type: income if amount > 0, else expense
  CASE WHEN ((ABS(RANDOM()) % 7000) - 2000) > 0
    THEN 'income'
    ELSE 'expense'
  END AS type
FROM cnt;
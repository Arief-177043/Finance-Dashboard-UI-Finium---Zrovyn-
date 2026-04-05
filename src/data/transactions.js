/* ─── Category Metadata ─────────────────────────────────────── */
export const CATEGORY_META = {
  Food:          { icon: '🍜', color: '#fb923c' },
  Transport:     { icon: '🚌', color: '#60a5fa' },
  Shopping:      { icon: '🛍️', color: '#a78bfa' },
  Health:        { icon: '💊', color: '#f472b6' },
  Entertainment: { icon: '🎮', color: '#fbbf24' },
  Utilities:     { icon: '⚡', color: '#2dd4bf' },
  Salary:        { icon: '💼', color: '#6ee7b7' },
  Freelance:     { icon: '💻', color: '#34d399' },
  Investment:    { icon: '📈', color: '#818cf8' },
  Other:         { icon: '📦', color: '#94a3b8' },
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_META)

/* ─── Seed Transactions ─────────────────────────────────────── */
export const SEED_TRANSACTIONS = [
  // April 2026
  { id: 1,  desc: 'Monthly Salary',       amount: 85000, type: 'income',  cat: 'Salary',        date: '2026-04-01' },
  { id: 2,  desc: 'Swiggy Order',         amount: 480,   type: 'expense', cat: 'Food',          date: '2026-04-01' },
  { id: 3,  desc: 'Netflix Subscription', amount: 799,   type: 'expense', cat: 'Entertainment', date: '2026-04-02' },
  { id: 4,  desc: 'Electricity Bill',     amount: 2200,  type: 'expense', cat: 'Utilities',     date: '2026-04-03' },
  { id: 5,  desc: 'Freelance Project',    amount: 22000, type: 'income',  cat: 'Freelance',     date: '2026-04-04' },
  { id: 6,  desc: 'Zomato Order',         amount: 350,   type: 'expense', cat: 'Food',          date: '2026-04-04' },
  { id: 7,  desc: 'Metro Card Recharge',  amount: 500,   type: 'expense', cat: 'Transport',     date: '2026-04-05' },
  { id: 8,  desc: 'Amazon Shopping',      amount: 3200,  type: 'expense', cat: 'Shopping',      date: '2026-04-06' },
  { id: 9,  desc: 'Gym Membership',       amount: 1500,  type: 'expense', cat: 'Health',        date: '2026-04-07' },
  { id: 10, desc: 'Ola Cab',              amount: 280,   type: 'expense', cat: 'Transport',     date: '2026-04-08' },
  { id: 11, desc: 'Dividend Income',      amount: 4500,  type: 'income',  cat: 'Investment',    date: '2026-04-09' },
  { id: 12, desc: 'Myntra Purchase',      amount: 2100,  type: 'expense', cat: 'Shopping',      date: '2026-04-10' },
  { id: 13, desc: 'Spotify Premium',      amount: 119,   type: 'expense', cat: 'Entertainment', date: '2026-04-11' },
  { id: 14, desc: 'Apollo Pharmacy',      amount: 890,   type: 'expense', cat: 'Health',        date: '2026-04-12' },
  { id: 15, desc: 'Freelance UI Work',    amount: 15000, type: 'income',  cat: 'Freelance',     date: '2026-04-13' },
  { id: 16, desc: 'BigBasket Order',      amount: 1650,  type: 'expense', cat: 'Food',          date: '2026-04-14' },
  { id: 17, desc: 'Petrol Fill-up',       amount: 800,   type: 'expense', cat: 'Transport',     date: '2026-04-15' },
  { id: 18, desc: 'Movie Tickets',        amount: 600,   type: 'expense', cat: 'Entertainment', date: '2026-04-16' },
  { id: 19, desc: 'Water Bill',           amount: 450,   type: 'expense', cat: 'Utilities',     date: '2026-04-17' },
  { id: 20, desc: 'Book Purchase',        amount: 750,   type: 'expense', cat: 'Shopping',      date: '2026-04-18' },
  // March 2026
  { id: 21, desc: 'Monthly Salary',       amount: 85000, type: 'income',  cat: 'Salary',        date: '2026-03-01' },
  { id: 22, desc: 'Food & Dining',        amount: 3200,  type: 'expense', cat: 'Food',          date: '2026-03-05' },
  { id: 23, desc: 'Commute',              amount: 1800,  type: 'expense', cat: 'Transport',     date: '2026-03-10' },
  { id: 24, desc: 'Shopping Spree',       amount: 5500,  type: 'expense', cat: 'Shopping',      date: '2026-03-15' },
  { id: 25, desc: 'Freelance Work',       amount: 18000, type: 'income',  cat: 'Freelance',     date: '2026-03-20' },
  { id: 26, desc: 'Utility Bills',        amount: 3100,  type: 'expense', cat: 'Utilities',     date: '2026-03-25' },
  { id: 27, desc: 'Health Checkup',       amount: 2400,  type: 'expense', cat: 'Health',        date: '2026-03-28' },
  // February 2026
  { id: 28, desc: 'Monthly Salary',       amount: 85000, type: 'income',  cat: 'Salary',        date: '2026-02-01' },
  { id: 29, desc: 'Food Delivery',        amount: 2800,  type: 'expense', cat: 'Food',          date: '2026-02-10' },
  { id: 30, desc: "Valentine's Shopping", amount: 8200,  type: 'expense', cat: 'Shopping',      date: '2026-02-14' },
  { id: 31, desc: 'Utility Bills',        amount: 2900,  type: 'expense', cat: 'Utilities',     date: '2026-02-20' },
  { id: 32, desc: 'Freelance Design',     amount: 12000, type: 'income',  cat: 'Freelance',     date: '2026-02-25' },
  { id: 33, desc: 'Transport',            amount: 1400,  type: 'expense', cat: 'Transport',     date: '2026-02-27' },
]

/* ─── Helpers ───────────────────────────────────────────────── */
export const getIncome   = (txns) => txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
export const getExpenses = (txns) => txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

export const fmt = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export const fmtSm = (n) =>
  n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L'
  : n >= 1000  ? '₹' + (n / 1000).toFixed(1) + 'K'
  : fmt(n)

export const genId = () => Date.now() + Math.random()

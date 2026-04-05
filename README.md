# Finium — Finance Dashboard

A clean, interactive finance dashboard built for the Zorvyn FinTech Frontend Developer Intern screening assessment.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

| Concern        | Choice                                   |
|----------------|------------------------------------------|
| Framework      | React 18 (Vite)                          |
| State          | React Context + `useReducer`             |
| Charts         | Recharts                                 |
| Styling        | Plain CSS-in-JS (inline styles + tokens) |
| Persistence    | `localStorage`                           |
| Fonts          | DM Serif Display · DM Sans · JetBrains Mono |

No CSS framework, no heavy UI library — just React, Recharts, and hand-crafted styles.

---

## Project Structure

```
finance-dashboard/
│
├── src/
│   ├── components/
│   │   ├── SummaryCard.jsx       # Animated KPI card
│   │   ├── TransactionTable.jsx  # Filterable, sortable transaction list
│   │   ├── Filters.jsx           # Search + category + type + sort controls
│   │   ├── RoleSwitcher.jsx      # Viewer / Admin role dropdown
│   │   └── Charts.jsx            # Recharts wrappers (area, bar, donut, line)
│   │
│   ├── pages/
│   │   └── Dashboard.jsx         # Overview · Transactions · Insights pages
│   │
│   ├── data/
│   │   └── transactions.js       # Seed data, category metadata, helpers
│   │
│   ├── context/
│   │   └── AppContext.jsx        # Global state (transactions, role, filters…)
│   │
│   ├── App.jsx                   # Shell: sidebar, topbar, modal, toast
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Design tokens + global resets + animations
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Features

### Dashboard Overview
- **4 summary cards** — Net Balance, Total Income, Total Expenses, Transaction Count
- **Balance trend** — Area chart showing running balance across April 2026
- **Spending donut** — Pie breakdown of expenses by category with legend
- **Recent transactions** — Last 5 entries at a glance

### Transactions
- **Full transaction list** with date, description, category badge, type, and amount
- **Search** — real-time text filter across description and category
- **Category filter** — dropdown to isolate one category
- **Type filter** — income / expense / all
- **Sort** — by date or amount, ascending or descending
- **Clear filters** button when any filter is active
- **Empty state** — graceful "nothing found" UI

### Role-Based UI
| Feature              | Viewer | Admin |
|----------------------|--------|-------|
| View all data        | ✅     | ✅    |
| Add transaction      | ✗      | ✅    |
| Edit transaction     | ✗      | ✅    |
| Delete transaction   | ✗      | ✅    |

Switch roles via the **Role** dropdown in the topbar. No backend needed — purely frontend simulation.

### Insights
- **Top spending category** — highest expense category this month
- **Savings rate** — percentage of income saved
- **Month-over-month change** — expense delta vs previous month
- **Monthly comparison bar chart** — income vs expenses across Feb · Mar · Apr
- **3-month line chart** — income and expenses trend
- **Category breakdown bars** — animated proportional bars per category

### State Management
All application state lives in a single `useReducer` in `AppContext.jsx`:
- `transactions` — the source of truth, persisted to `localStorage`
- `role` — current role (`viewer` | `admin`)
- `page` — active nav page
- `filters` — search, category, type
- `sort` — field + direction
- `modal` — open state + editing ID
- `toast` — message + visibility

### UX Extras
- **localStorage persistence** — transactions survive page refresh
- **CSV export** — one-click download of all transactions
- **Animated modal** — add/edit with validation
- **Toast notifications** — success/error feedback
- **Responsive** — collapses to a mobile layout with drawer sidebar
- **Staggered animations** — cards and rows fade in with `animationDelay`
- **Empty/no-data states** — every list handles zero results gracefully

---

## Design Approach

- Dark-first palette with CSS custom properties (`var(--bg)`, `var(--accent)`, etc.)
- `DM Serif Display` for headings — editorial weight
- `DM Sans` for body — clean, readable
- `JetBrains Mono` for amounts — numbers deserve a monospace
- Subtle ambient glows on cards, animated bar fills, smooth sidebar collapse

---

## Assumptions Made

1. Data is mock / static — no backend or real API calls
2. "April 2026" is the current reporting month
3. Amounts are in Indian Rupees (₹)
4. Role switching is for demo purposes only; no authentication layer

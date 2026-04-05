import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import SummaryCard    from '../components/SummaryCard'
import TransactionTable from '../components/TransactionTable'
import {
  BalanceTrendChart,
  SpendingDonut,
  MonthlyCompareChart,
  IncomeVsExpenseChart,
} from '../components/Charts'
import {
  CATEGORY_META,
  getIncome, getExpenses,
  fmt, fmtSm,
} from '../data/transactions'

/* ─── Shared card wrapper ────────────────────────────────────── */
function Card({ children, style = {}, title, subtitle, right }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 22,
      animation: 'fadeUp .35s ease both',
      ...style,
    }}>
      {(title || right) && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   OVERVIEW PAGE
══════════════════════════════════════════════════════════════ */
export function Overview() {
  const { state, dispatch } = useApp()
  const { transactions } = state

  const aprTxns = useMemo(() =>
    transactions.filter(t => t.date.startsWith('2026-04')), [transactions])

  const income   = getIncome(aprTxns)
  const expenses = getExpenses(aprTxns)
  const balance  = income - expenses
  const savings  = income > 0 ? ((balance / income) * 100).toFixed(1) : '0.0'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16,
      }}>
        <SummaryCard
          label="Net Balance"
          value={fmtSm(balance)}
          change={`${savings}% savings rate`}
          changeDir="up"
          accentColor="var(--accent)"
          delay={0}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent)" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          }
        />
        <SummaryCard
          label="Total Income"
          value={fmtSm(income)}
          change="April 2026"
          changeDir="neutral"
          accentColor="var(--accent)"
          delay={80}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent)" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          }
        />
        <SummaryCard
          label="Total Expenses"
          value={fmtSm(expenses)}
          change={`${aprTxns.filter(t => t.type === 'expense').length} transactions`}
          changeDir="down"
          accentColor="var(--red)"
          delay={160}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="var(--red)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          }
        />
        <SummaryCard
          label="Transactions"
          value={aprTxns.length}
          change="This month"
          changeDir="neutral"
          accentColor="var(--blue)"
          delay={240}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="var(--blue)" strokeWidth="2">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
      }}>
        <Card title="Balance Trend" subtitle="Running balance — April 2026">
          <BalanceTrendChart transactions={transactions} />
        </Card>

        <Card title="Spending by Category" subtitle="April expenses">
          <SpendingDonut transactions={transactions} />
        </Card>
      </div>

      {/* Recent Transactions */}
      <TransactionTable
        limit={5}
        hideFilters
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TRANSACTIONS PAGE
══════════════════════════════════════════════════════════════ */
export function Transactions() {
  return (
    <div style={{ animation: 'fadeUp .35s ease' }}>
      <TransactionTable />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   INSIGHTS PAGE
══════════════════════════════════════════════════════════════ */
export function Insights() {
  const { state } = useApp()
  const { transactions } = state

  const aprTxns = transactions.filter(t => t.date.startsWith('2026-04'))
  const marTxns = transactions.filter(t => t.date.startsWith('2026-03'))

  const aprInc = getIncome(aprTxns)
  const aprExp = getExpenses(aprTxns)
  const marExp = getExpenses(marTxns)

  const savings    = aprInc > 0 ? (((aprInc - aprExp) / aprInc) * 100).toFixed(1) : '0.0'
  const expChange  = marExp > 0 ? (((aprExp - marExp) / marExp) * 100).toFixed(1) : '0.0'

  // Category breakdown
  const catMap = {}
  aprTxns.filter(t => t.type === 'expense')
    .forEach(t => { catMap[t.cat] = (catMap[t.cat] ?? 0) + t.amount })
  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1])
  const topCat     = catEntries[0] ?? ['N/A', 0]
  const maxCatAmt  = catEntries[0]?.[1] ?? 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* KPI cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        <InsightCard
          tag="Top Category"
          tagColor="var(--red)"
          tagBg="var(--red-dim)"
          title="Highest Spending"
          value={topCat[0]}
          sub={`${fmt(topCat[1])} this month`}
          delay={0}
        />
        <InsightCard
          tag="Savings Rate"
          tagColor="var(--accent)"
          tagBg="var(--accent-dim)"
          title="Monthly Savings"
          value={`${savings}%`}
          sub="Of total income saved"
          delay={80}
        />
        <InsightCard
          tag="MoM Change"
          tagColor="var(--blue)"
          tagBg="var(--blue-dim)"
          title="Expenses vs Last Month"
          value={`${+expChange >= 0 ? '+' : ''}${expChange}%`}
          valueColor={+expChange > 0 ? 'var(--red)' : 'var(--accent)'}
          sub="Compared to March 2026"
          delay={160}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Monthly Comparison" subtitle="Income vs Expenses (Feb–Apr)">
          <MonthlyCompareChart transactions={transactions} />
        </Card>
        <Card title="Income vs Expenses" subtitle="3-month trend">
          <IncomeVsExpenseChart transactions={transactions} />
        </Card>
      </div>

      {/* Category bars */}
      <Card title="Spending Breakdown" subtitle="By category — April 2026">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {catEntries.map(([cat, amt]) => {
            const meta = CATEGORY_META[cat] ?? CATEGORY_META.Other
            const pct  = ((amt / maxCatAmt) * 100).toFixed(0)
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 110,
                  fontSize: 13,
                  color: 'var(--text2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  flexShrink: 0,
                }}>
                  {meta.icon} {cat}
                </span>
                <div style={{
                  flex: 1,
                  background: 'var(--surface3)',
                  borderRadius: 4,
                  height: 8,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: meta.color,
                    borderRadius: 4,
                    animation: 'barGrow .8s cubic-bezier(.34,1.56,.64,1) both',
                  }} />
                </div>
                <span style={{
                  width: 70,
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text2)',
                  flexShrink: 0,
                }}>
                  {fmt(amt)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function InsightCard({ tag, tagColor, tagBg, title, value, valueColor, sub, delay }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      animation: 'fadeUp .35s ease both',
      animationDelay: `${delay}ms`,
    }}>
      <div style={{
        background: tagBg,
        color: tagColor,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        borderRadius: 20,
        width: 'fit-content',
      }}>
        {tag}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26,
        color: valueColor ?? 'var(--text)',
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{sub}</div>
    </div>
  )
}

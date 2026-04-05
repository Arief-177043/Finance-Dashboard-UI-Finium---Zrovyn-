import React, { useMemo } from 'react'
import {
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { CATEGORY_META, getIncome, getExpenses, fmt, fmtSm } from '../data/transactions'

/* ─── Shared tooltip style ───────────────────────────────────── */
const tooltipStyle = {
  contentStyle: {
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: 10,
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--text)',
  },
  cursor: { stroke: 'var(--border2)' },
}

const axisStyle = {
  tick: { fill: '#555e75', fontSize: 11, fontFamily: 'var(--font-body)' },
  axisLine: false,
  tickLine: false,
}

const gridStyle = {
  stroke: 'rgba(255,255,255,0.04)',
  strokeDasharray: '0',
}

/* ─── Balance Trend (Area) ───────────────────────────────────── */
export function BalanceTrendChart({ transactions }) {
  const data = useMemo(() => {
    const aprTxns = transactions
      .filter(t => t.date.startsWith('2026-04'))
      .sort((a, b) => a.date.localeCompare(b.date))

    const days = [...new Set(aprTxns.map(t => t.date))]
    let running = 0
    return days.map(d => {
      aprTxns
        .filter(t => t.date === d)
        .forEach(t => { running += t.type === 'income' ? t.amount : -t.amount })
      return { date: d.slice(8), balance: running }
    })
  }, [transactions])

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6ee7b7" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="date" {...axisStyle} />
        <YAxis tickFormatter={fmtSm} {...axisStyle} width={55} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v) => [fmt(v), 'Balance']}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#6ee7b7"
          strokeWidth={2.5}
          fill="url(#balGrad)"
          dot={{ r: 3, fill: '#6ee7b7', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#6ee7b7' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ─── Spending Donut ─────────────────────────────────────────── */
export function SpendingDonut({ transactions }) {
  const { data, total } = useMemo(() => {
    const map = {}
    transactions
      .filter(t => t.date.startsWith('2026-04') && t.type === 'expense')
      .forEach(t => { map[t.cat] = (map[t.cat] ?? 0) + t.amount })
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1])
    const total = entries.reduce((s, [, v]) => s + v, 0)
    return {
      data: entries.map(([cat, value]) => ({
        name: cat,
        value,
        color: CATEGORY_META[cat]?.color ?? '#94a3b8',
        icon: CATEGORY_META[cat]?.icon ?? '📦',
        pct: total > 0 ? ((value / total) * 100).toFixed(0) : 0,
      })),
      total,
    }
  }, [transactions])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            dataKey="value"
            strokeWidth={0}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipStyle}
            formatter={(v) => [fmt(v)]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.slice(0, 5).map(d => (
          <div key={d.name} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: 3,
                background: d.color,
                flexShrink: 0,
              }} />
              <span style={{ color: 'var(--text2)' }}>{d.icon} {d.name}</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text)',
              fontWeight: 500,
            }}>
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Monthly Comparison Bar ─────────────────────────────────── */
export function MonthlyCompareChart({ transactions }) {
  const data = useMemo(() => [
    { month: 'Feb', income: getIncome(transactions.filter(t=>t.date.startsWith('2026-02'))), expenses: getExpenses(transactions.filter(t=>t.date.startsWith('2026-02'))) },
    { month: 'Mar', income: getIncome(transactions.filter(t=>t.date.startsWith('2026-03'))), expenses: getExpenses(transactions.filter(t=>t.date.startsWith('2026-03'))) },
    { month: 'Apr', income: getIncome(transactions.filter(t=>t.date.startsWith('2026-04'))), expenses: getExpenses(transactions.filter(t=>t.date.startsWith('2026-04'))) },
  ], [transactions])

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="month" {...axisStyle} />
        <YAxis tickFormatter={fmtSm} {...axisStyle} width={55} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v, name) => [fmt(v), name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--text2)', paddingTop: 10 }}
        />
        <Bar dataKey="income"   fill="#6ee7b7" radius={[6,6,0,0]} />
        <Bar dataKey="expenses" fill="#f87171" radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ─── Income vs Expense Line ─────────────────────────────────── */
export function IncomeVsExpenseChart({ transactions }) {
  const data = useMemo(() => [
    { month: 'Feb', income: getIncome(transactions.filter(t=>t.date.startsWith('2026-02'))), expenses: getExpenses(transactions.filter(t=>t.date.startsWith('2026-02'))) },
    { month: 'Mar', income: getIncome(transactions.filter(t=>t.date.startsWith('2026-03'))), expenses: getExpenses(transactions.filter(t=>t.date.startsWith('2026-03'))) },
    { month: 'Apr', income: getIncome(transactions.filter(t=>t.date.startsWith('2026-04'))), expenses: getExpenses(transactions.filter(t=>t.date.startsWith('2026-04'))) },
  ], [transactions])

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6ee7b7" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f87171" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="month" {...axisStyle} />
        <YAxis tickFormatter={fmtSm} {...axisStyle} width={55} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v, name) => [fmt(v), name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--text2)', paddingTop: 10 }} />
        <Line type="monotone" dataKey="income"   stroke="#6ee7b7" strokeWidth={2.5} dot={{ r: 5, fill: '#6ee7b7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2.5} dot={{ r: 5, fill: '#f87171', strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

import React from 'react'
import { useApp } from '../context/AppContext'
import { ALL_CATEGORIES } from '../data/transactions'

const inputBase = {
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  outline: 'none',
  transition: 'border-color .2s',
}

export default function Filters() {
  const { state, dispatch } = useApp()
  const { filters, sort } = state

  const set = (key, value) =>
    dispatch({ type: 'SET_FILTER', payload: { [key]: value } })

  const setSort = (field) =>
    dispatch({ type: 'SET_SORT', payload: { field } })

  const sortIcon = (field) => {
    if (sort.field !== field) return <span style={{ opacity: .3 }}>↕</span>
    return sort.dir === 'desc' ? '↓' : '↑'
  }

  const hasFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all'

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      alignItems: 'center',
    }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg
          style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)',
            width: 15, height: 15, color: 'var(--text3)',
            pointerEvents: 'none',
          }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          style={{
            ...inputBase,
            padding: '8px 12px 8px 32px',
            width: 220,
          }}
          onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e   => e.target.style.borderColor = 'var(--border)'}
          aria-label="Search transactions"
        />
      </div>

      {/* Category filter */}
      <select
        value={filters.category}
        onChange={e => set('category', e.target.value)}
        style={{ ...inputBase, padding: '8px 12px' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {ALL_CATEGORIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Type filter */}
      <select
        value={filters.type}
        onChange={e => set('type', e.target.value)}
        style={{ ...inputBase, padding: '8px 12px' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
        aria-label="Filter by type"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Sort buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['date', 'amount'].map(f => (
          <button
            key={f}
            onClick={() => setSort(f)}
            style={{
              ...inputBase,
              padding: '8px 13px',
              cursor: 'pointer',
              color: sort.field === f ? 'var(--text)' : 'var(--text2)',
              borderColor: sort.field === f ? 'var(--border2)' : 'var(--border)',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {f} {sortIcon(f)}
          </button>
        ))}
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--red)',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  )
}

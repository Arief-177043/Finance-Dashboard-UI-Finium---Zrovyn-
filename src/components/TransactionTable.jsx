import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORY_META, fmt } from '../data/transactions'
import Filters from './Filters'

export default function TransactionTable({ limit, hideFilters = false }) {
  const { state, dispatch } = useApp()
  const { transactions, filters, sort, role } = state

  /* ─── Derive filtered + sorted list ─────────────────────────── */
  const visible = useMemo(() => {
    let list = [...transactions]

    if (filters.category !== 'all')
      list = list.filter(t => t.cat === filters.category)

    if (filters.type !== 'all')
      list = list.filter(t => t.type === filters.type)

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(t =>
        t.desc.toLowerCase().includes(q) ||
        t.cat.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      const va = sort.field === 'amount' ? +a.amount : a[sort.field]
      const vb = sort.field === 'amount' ? +b.amount : b[sort.field]
      if (va < vb) return sort.dir === 'asc' ? -1 : 1
      if (va > vb) return sort.dir === 'asc' ?  1 : -1
      return 0
    })

    return limit ? list.slice(0, limit) : list
  }, [transactions, filters, sort, limit])

  const handleEdit   = (id) => dispatch({ type: 'OPEN_MODAL', payload: id })
  const handleDelete = (id) => {
    if (!confirm('Delete this transaction?')) return
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Transaction deleted', kind: 'success' } })
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      animation: 'fadeUp .35s ease both',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 22px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
          Transactions{' '}
          <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text3)' }}>
            ({visible.length})
          </span>
        </div>
        {!hideFilters && <Filters />}
      </div>

      {/* List */}
      <div style={{ maxHeight: hideFilters ? 'none' : 480, overflowY: 'auto' }}>
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          visible.map((t, i) => (
            <TxnRow
              key={t.id}
              txn={t}
              isAdmin={role === 'admin'}
              onEdit={handleEdit}
              onDelete={handleDelete}
              delay={i * 30}
            />
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Single Row ─────────────────────────────────────────────── */
function TxnRow({ txn, isAdmin, onEdit, onDelete, delay }) {
  const meta   = CATEGORY_META[txn.cat] ?? CATEGORY_META.Other
  const sign   = txn.type === 'income' ? '+' : '−'
  const amtClr = txn.type === 'income' ? 'var(--accent)' : 'var(--red)'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 16,
        padding: '13px 22px',
        borderBottom: '1px solid var(--border)',
        transition: 'background .15s',
        animation: `fadeUp .3s ease both`,
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Category icon */}
      <div style={{
        width: 40, height: 40,
        borderRadius: 12,
        background: `${meta.color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}>
        {meta.icon}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {txn.desc}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{txn.date}</span>
          <span style={{
            background: 'var(--surface3)',
            padding: '2px 8px',
            borderRadius: 10,
            fontSize: 11,
          }}>
            {txn.cat}
          </span>
        </div>
      </div>

      {/* Amount + actions */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 15,
          fontWeight: 500,
          color: amtClr,
        }}>
          {sign}{fmt(txn.amount)}
        </div>
        <div style={{
          fontSize: 11,
          color: amtClr,
          opacity: .7,
          textTransform: 'capitalize',
          marginTop: 2,
        }}>
          {txn.type}
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: 5, marginTop: 5, justifyContent: 'flex-end' }}>
            <ActionBtn onClick={() => onEdit(txn.id)}>Edit</ActionBtn>
            <ActionBtn onClick={() => onDelete(txn.id)} danger>Delete</ActionBtn>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: `1px solid var(--border)`,
        color: danger ? 'var(--text3)' : 'var(--text3)',
        padding: '3px 9px',
        borderRadius: 'var(--radius-xs)',
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        transition: 'all .15s',
      }}
      onMouseEnter={e => {
        e.target.style.borderColor = danger ? 'rgba(248,113,113,.4)' : 'var(--border2)'
        e.target.style.color = danger ? 'var(--red)' : 'var(--text)'
      }}
      onMouseLeave={e => {
        e.target.style.borderColor = 'var(--border)'
        e.target.style.color = 'var(--text3)'
      }}
    >
      {children}
    </button>
  )
}

function EmptyState() {
  return (
    <div style={{
      padding: '60px 22px',
      textAlign: 'center',
      color: 'var(--text3)',
    }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
      <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 6 }}>No transactions found</div>
      <div style={{ fontSize: 13 }}>Try adjusting your search or filters</div>
    </div>
  )
}

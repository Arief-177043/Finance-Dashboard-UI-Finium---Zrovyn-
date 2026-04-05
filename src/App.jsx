import React, { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Overview, Transactions, Insights } from './pages/Dashboard'
import RoleSwitcher from './components/RoleSwitcher'
import { ALL_CATEGORIES, fmt, genId } from './data/transactions'

/* ─── Nav config ─────────────────────────────────────────────── */
const NAV = [
  {
    id: 'overview', label: 'Overview',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'transactions', label: 'Transactions',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
    ),
  },
  {
    id: 'insights', label: 'Insights',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

/* ══════════════════════════════════════════════════════════════
   INNER APP (has access to context)
══════════════════════════════════════════════════════════════ */
function Inner() {
  const { state, dispatch } = useApp()
  const { page, role, sidebarOpen, modal, toast, transactions } = state

  /* ── Export CSV ─────────────────────────────────────────────── */
  const exportCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount (₹)']]
    transactions.forEach(t => rows.push([t.date, t.desc, t.cat, t.type, t.amount]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'finium_transactions.csv'
    a.click()
    dispatch({ type: 'SHOW_TOAST', payload: { message: '📥 CSV exported successfully', kind: 'success' } })
  }

  /* ── Responsive sidebar ─────────────────────────────────────── */
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const editingTxn = modal.editingId
    ? transactions.find(t => t.id === modal.editingId) ?? null
    : null

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      {(!mobile || sidebarOpen) && (
        <aside style={{
          width: sidebarOpen && !mobile ? 230 : mobile ? 230 : 68,
          minWidth: sidebarOpen && !mobile ? 230 : mobile ? 230 : 68,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0',
          transition: 'all .25s ease',
          position: mobile ? 'fixed' : 'relative',
          zIndex: 200,
          top: 0, left: 0, bottom: 0,
        }}>
          {/* Logo */}
          <div style={{
            padding: '0 18px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            overflow: 'hidden',
          }}>
            <div style={{
              width: 34, height: 34,
              background: 'var(--accent)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#0d0f14" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            {(sidebarOpen || mobile) && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, whiteSpace: 'nowrap' }}>
                Finium
              </span>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '14px 10px' }}>
            {NAV.map(item => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch({ type: 'SET_PAGE', payload: item.id })
                    if (mobile) dispatch({ type: 'TOGGLE_SIDEBAR' })
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text2)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all .18s',
                    marginBottom: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    position: 'relative',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'var(--surface2)'
                      e.currentTarget.style.color = 'var(--text)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text2)'
                    }
                  }}
                >
                  {active && (
                    <div style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: '55%', background: 'var(--accent)',
                      borderRadius: '0 3px 3px 0',
                    }} />
                  )}
                  <span style={{ opacity: active ? 1 : .65 }}>{item.icon}</span>
                  {(sidebarOpen || mobile) && <span>{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--accent)' }}>●</span>
              {(sidebarOpen || mobile) ? ' Finium v1.0' : ''}
            </div>
          </div>
        </aside>
      )}

      {/* Mobile overlay */}
      {mobile && sidebarOpen && (
        <div
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 199,
          }}
        />
      )}

      {/* ── Main ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Hamburger */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text2)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: 6,
                borderRadius: 'var(--radius-xs)',
              }}
              aria-label="Toggle sidebar"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>
                {{ overview: 'Overview', transactions: 'Transactions', insights: 'Insights' }[page]}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>April 2026</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <RoleSwitcher />

            {/* Export */}
            <button
              onClick={exportCSV}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text2)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border2)' }}
              onMouseLeave={e => { e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.borderColor='var(--border)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>

            {/* Add Transaction (admin only) */}
            {role === 'admin' && (
              <button
                onClick={() => dispatch({ type: 'OPEN_MODAL' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'var(--accent)',
                  border: 'none',
                  color: '#0d0f14',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--accent2)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--accent)'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Transaction
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '26px 24px' }}>
          {page === 'overview'      && <Overview />}
          {page === 'transactions'  && <Transactions />}
          {page === 'insights'      && <Insights />}
        </main>
      </div>

      {/* ── Modal ───────────────────────────────────────────────── */}
      <TransactionModal editingTxn={editingTxn} />

      {/* ── Toast ───────────────────────────────────────────────── */}
      <Toast />
    </div>
  )
}

/* ─── Transaction Modal ──────────────────────────────────────── */
function TransactionModal({ editingTxn }) {
  const { state, dispatch } = useApp()
  const { modal } = state

  const [form, setForm] = useState({
    desc: '', amount: '', date: new Date().toISOString().slice(0, 10),
    type: 'expense', cat: 'Food',
  })

  useEffect(() => {
    if (modal.open) {
      setForm(editingTxn
        ? { desc: editingTxn.desc, amount: editingTxn.amount, date: editingTxn.date, type: editingTxn.type, cat: editingTxn.cat }
        : { desc: '', amount: '', date: new Date().toISOString().slice(0, 10), type: 'expense', cat: 'Food' }
      )
    }
  }, [modal.open, editingTxn])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.desc.trim() || !form.amount || !form.date) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Please fill all fields', kind: 'error' } })
      return
    }
    const payload = { ...form, amount: parseFloat(form.amount), id: editingTxn?.id ?? genId() }
    dispatch({ type: editingTxn ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION', payload })
    dispatch({ type: 'SHOW_TOAST', payload: {
      message: editingTxn ? '✏️ Transaction updated' : '✅ Transaction added',
      kind: 'success',
    }})
  }

  if (!modal.open) return null

  const inputSt = {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '10px 13px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color .2s',
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL' }) }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn .2s ease',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 18,
        padding: 28,
        width: 460,
        maxWidth: '95vw',
        animation: 'scaleIn .25s ease',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 22 }}>
          {editingTxn ? 'Edit Transaction' : 'Add Transaction'}
        </div>

        <Field label="Description">
          <input
            style={inputSt}
            placeholder="e.g. Grocery shopping"
            value={form.desc}
            onChange={e => set('desc', e.target.value)}
            onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e   => e.target.style.borderColor = 'var(--border)'}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Amount (₹)">
            <input
              style={inputSt}
              type="number"
              placeholder="0"
              min="0"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e   => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
          <Field label="Date">
            <input
              style={{ ...inputSt, colorScheme: 'dark' }}
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e   => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Type">
            <select
              style={inputSt}
              value={form.type}
              onChange={e => set('type', e.target.value)}
              onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e   => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </Field>
          <Field label="Category">
            <select
              style={inputSt}
              value={form.cat}
              onChange={e => set('cat', e.target.value)}
              onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e   => e.target.style.borderColor = 'var(--border)'}
            >
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>
          <button
            onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
            style={{
              padding: '9px 18px',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '9px 20px',
              background: 'var(--accent)',
              border: 'none',
              color: '#0d0f14',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='var(--accent2)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--accent)'}
          >
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text3)',
        textTransform: 'uppercase',
        letterSpacing: '.07em',
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast() {
  const { state } = useApp()
  const { toast } = state

  return (
    <div style={{
      position: 'fixed',
      bottom: 28, right: 28,
      background: 'var(--surface2)',
      border: `1px solid var(--border2)`,
      borderLeft: `3px solid ${toast.kind === 'success' ? 'var(--accent)' : 'var(--red)'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '12px 18px',
      fontSize: 13,
      color: 'var(--text)',
      zIndex: 2000,
      maxWidth: 300,
      pointerEvents: toast.visible ? 'all' : 'none',
      opacity: toast.visible ? 1 : 0,
      transform: toast.visible ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity .3s, transform .3s',
      boxShadow: 'var(--shadow)',
    }}>
      {toast.message}
    </div>
  )
}

/* ─── Root export ────────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}

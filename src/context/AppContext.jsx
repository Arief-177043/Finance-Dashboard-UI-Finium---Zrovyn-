import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { SEED_TRANSACTIONS } from '../data/transactions'

/* ─── Initial State ─────────────────────────────────────────── */
const load = () => {
  try {
    const stored = localStorage.getItem('finium_v2')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

const initialState = {
  transactions: load()?.transactions ?? SEED_TRANSACTIONS,
  role:         'viewer',      // 'viewer' | 'admin'
  page:         'overview',   // 'overview' | 'transactions' | 'insights'
  sidebarOpen:  true,
  filters: {
    search:   '',
    category: 'all',
    type:     'all',
  },
  sort: {
    field: 'date',
    dir:   'desc',
  },
  modal: {
    open:      false,
    editingId: null,
  },
  toast: {
    visible: false,
    message: '',
    kind:    'success',
  },
}

/* ─── Reducer ───────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload }

    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'CLEAR_FILTERS':
      return { ...state, filters: initialState.filters }

    case 'SET_SORT': {
      const { field } = action.payload
      const dir =
        state.sort.field === field && state.sort.dir === 'desc' ? 'asc' : 'desc'
      return { ...state, sort: { field, dir } }
    }

    case 'OPEN_MODAL':
      return { ...state, modal: { open: true, editingId: action.payload ?? null } }

    case 'CLOSE_MODAL':
      return { ...state, modal: { open: false, editingId: null } }

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        modal: { open: false, editingId: null },
      }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        modal: { open: false, editingId: null },
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      }

    case 'SHOW_TOAST':
      return { ...state, toast: { visible: true, ...action.payload } }

    case 'HIDE_TOAST':
      return { ...state, toast: { ...state.toast, visible: false } }

    default:
      return state
  }
}

/* ─── Context ───────────────────────────────────────────────── */
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Persist transactions to localStorage
  useEffect(() => {
    localStorage.setItem('finium_v2', JSON.stringify({ transactions: state.transactions }))
  }, [state.transactions])

  // Auto-hide toast
  useEffect(() => {
    if (!state.toast.visible) return
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000)
    return () => clearTimeout(t)
  }, [state.toast.visible, state.toast.message])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

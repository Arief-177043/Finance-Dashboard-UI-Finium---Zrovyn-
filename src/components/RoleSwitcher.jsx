import React from 'react'
import { useApp } from '../context/AppContext'

const roles = [
  { value: 'viewer', label: 'Viewer', emoji: '👁', color: 'var(--accent)',  desc: 'Read-only access' },
  { value: 'admin',  label: 'Admin',  emoji: '⚡', color: 'var(--blue)',   desc: 'Full access' },
]

export default function RoleSwitcher() {
  const { state, dispatch } = useApp()

  const handleChange = (e) => {
    const role = e.target.value
    dispatch({ type: 'SET_ROLE', payload: role })
    dispatch({
      type: 'SHOW_TOAST',
      payload: {
        message: role === 'admin'
          ? '⚡ Admin mode — full access enabled'
          : '👁 Viewer mode — read only',
        kind: 'success',
      },
    })
  }

  const current = roles.find(r => r.value === state.role)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--text3)' }}>Role</span>

      <div style={{ position: 'relative' }}>
        {/* Dot indicator */}
        <div style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: current.color,
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background .3s',
        }} />

        <select
          value={state.role}
          onChange={handleChange}
          aria-label="Switch role"
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'var(--surface2)',
            border: '1px solid var(--border2)',
            color: 'var(--text)',
            padding: '7px 14px 7px 26px',
            borderRadius: 40,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color .2s',
          }}
          onFocus={e => e.target.style.borderColor = current.color}
          onBlur={e  => e.target.style.borderColor = 'var(--border2)'}
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>
              {r.emoji} {r.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

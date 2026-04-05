import React from 'react'

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color .2s, transform .2s',
    animation: 'fadeUp .4s ease both',
    cursor: 'default',
  },
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: '50%',
    filter: 'blur(55px)',
    opacity: .13,
    top: -25,
    right: -25,
    pointerEvents: 'none',
  },
  iconBox: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '.09em',
    marginBottom: 12,
  },
  value: {
    fontFamily: 'var(--font-display)',
    fontSize: 30,
    color: 'var(--text)',
    lineHeight: 1,
    marginBottom: 10,
  },
  change: {
    fontSize: 12,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
}

export default function SummaryCard({
  label,
  value,
  change,
  changeDir = 'up',   // 'up' | 'down' | 'neutral'
  accentColor = 'var(--accent)',
  icon,
  delay = 0,
}) {
  const changeColor =
    changeDir === 'up'      ? 'var(--accent)'
    : changeDir === 'down'  ? 'var(--red)'
    :                         'var(--text3)'

  return (
    <div
      style={{ ...styles.card, animationDelay: `${delay}ms` }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border2)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Ambient glow */}
      <div style={{ ...styles.glow, background: accentColor }} />

      {/* Icon */}
      {icon && (
        <div style={{ ...styles.iconBox, background: `${accentColor}22` }}>
          {icon}
        </div>
      )}

      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>

      {change && (
        <div style={{ ...styles.change, color: changeColor }}>
          {changeDir === 'up' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {changeDir === 'down' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
          {change}
        </div>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children:   ReactNode
  to?:        string
  className?: string
  style?:     React.CSSProperties
  onClick?:   () => void
}

/**
 * Tarjeta base con estética sci-fi del proyecto.
 * Si se pasa `to`, se renderiza como <Link>; si no, como <div>.
 */
export default function Card({ children, to, className = '', style, onClick }: Props) {
  const base =
    'relative flex flex-col gap-4 p-5 overflow-hidden transition-all duration-300 group'
  const defaultStyle: React.CSSProperties = {
    background:    'rgba(5,15,31,0.85)',
    border:        '1px solid rgba(0,212,255,0.12)',
    backdropFilter:'blur(10px)',
    ...style,
  }

  const corners = (
    <>
      <div
        className="absolute top-0 left-0 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderTop: '1px solid rgba(0,212,255,0.6)', borderLeft: '1px solid rgba(0,212,255,0.6)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.6)', borderRight: '1px solid rgba(0,212,255,0.6)' }}
      />
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className={`${base} no-underline text-inherit hover:-translate-y-1 cursor-pointer ${className}`}
        style={defaultStyle}
      >
        {corners}
        {children}
      </Link>
    )
  }

  return (
    <div
      className={`${base} ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${className}`}
      style={defaultStyle}
      onClick={onClick}
    >
      {corners}
      {children}
    </div>
  )
}

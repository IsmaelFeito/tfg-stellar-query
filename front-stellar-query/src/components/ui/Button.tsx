import { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface Props {
  children:  ReactNode
  variant?:  Variant
  size?:     Size
  type?:     'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  onClick?:  () => void
  className?: string
}

const variantClass: Record<Variant, string> = {
  primary:   'sq-btn-primary',
  secondary: 'sq-btn-secondary',
  danger:    'bg-red-glow/10 border-red-glow/40 text-red-glow hover:bg-red-glow/20 hover:border-red-glow hover:shadow-red-glow',
  success:   'bg-green-glow/10 border-green-glow/40 text-green-glow hover:bg-green-glow/20 hover:border-green-glow hover:shadow-green-glow',
  ghost:     'bg-transparent border-white/20 text-white/50 hover:border-white/40 hover:text-white',
}

const sizeClass: Record<Size, string> = {
  sm: 'text-[0.65rem] px-4 py-[0.45rem]',
  md: 'text-[0.75rem] px-6 py-[0.7rem]',
  lg: 'text-[0.85rem] px-8 py-[0.9rem]',
}

export default function Button({ children, variant = 'primary', size = 'md', type = 'button', disabled, fullWidth, onClick, className = '' }: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`sq-btn ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
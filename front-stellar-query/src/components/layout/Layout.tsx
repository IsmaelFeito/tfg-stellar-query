import { type ReactNode } from 'react'
import StarBackground from '../ui/StarBackground'
import Navbar from './Navbar'

interface Props {
  children:  ReactNode
  showNav?:  boolean
}

export default function Layout({ children, showNav = false }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="scanline-overlay" />
      <div className="noise-overlay" />
      <StarBackground />
      <Navbar showNav={showNav} />
      <main className="relative z-10 flex-1 pt-[60px]">
        {children}
      </main>
      <footer className="relative z-10 h-12 flex items-center justify-center border-t border-cyan-glow/8 bg-space-900/70 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-[0.6rem] tracking-widest">
          <span className="font-display text-cyan-glow/40 font-bold">STELLAR QUERY</span>
          <span className="text-cyan-glow/20">//</span>
          <span className="text-white/25">SISTEMA OPERATIVO v1.0.0</span>
          <span className="text-cyan-glow/20">—</span>
          <span className="text-white/25">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
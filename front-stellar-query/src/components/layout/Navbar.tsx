import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props { showNav?: boolean }

export default function Navbar({ showNav = false }: Props) {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()

  const navLink = (to: string, label: string) => (
    <Link to={to} className={`text-[0.75rem] px-3 py-1.5 border tracking-widest transition-all duration-200 font-mono
      ${pathname === to
        ? 'text-cyan-glow border-cyan-glow/30 bg-cyan-glow/8 [text-shadow:0_0_8px_rgba(0,212,255,0.7)]'
        : 'text-cyan-glow/50 border-transparent hover:text-cyan-glow hover:border-cyan-glow/20 hover:bg-cyan-glow/5'}`}>
      <span className="text-cyan-glow/25 mr-0.5">~/</span>{label}
    </Link>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[60px]
                    bg-space-900/90 border-b border-cyan-glow/12 backdrop-blur-xl"
         style={{ boxShadow: 'inset 0 -1px 0 rgba(0,212,255,0)' }}>
      {/* Glow line */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent" />

      {/* Logo */}
      <Link to={showNav ? '/hub' : '/'} className="flex items-center gap-3 no-underline">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-spin-slow">
          <circle cx="14" cy="14" r="12" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6"/>
          <circle cx="14" cy="14" r="4" fill="#00d4ff" opacity="0.9"/>
          {[['14','2','14','8'],['14','20','14','26'],['2','14','8','14'],['20','14','26','14']].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00d4ff" strokeWidth="1.5" opacity="0.7"/>
          ))}
          <circle cx="14" cy="14" r="8" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-display text-[0.9rem] font-black text-cyan-glow tracking-[0.15em] text-glow-cyan">STELLAR</span>
          <span className="font-mono text-[0.6rem] text-cyan-glow/50 tracking-[0.3em]">QUERY</span>
        </div>
      </Link>

      {/* Nav links */}
      {showNav && (
        <div className="flex items-center gap-1">
          {navLink('/hub',  'HUB')}
          {navLink('/game', 'MISIÓN')}
          {navLink('/docs', 'DOCS')}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full bg-green-glow animate-pulse-slow" style={{ boxShadow: '0 0 8px #00ff88' }} />
          <span className="text-[0.65rem] text-green-glow/60 tracking-widest">SYS_OK</span>
        </div>
        {showNav && user && (
          <div className="flex items-center gap-2 px-3 py-1.5 border border-cyan-glow/15 bg-cyan-glow/4">
            <span className="text-cyan-glow/70 text-[0.7rem]">◈</span>
            <span className="text-[0.7rem] text-cyan-glow/80 tracking-wider">{user.username.toUpperCase()}</span>
            <button onClick={logout} className="ml-1 pl-2 border-l border-cyan-glow/10 text-red-glow/50 hover:text-red-glow transition-colors cursor-pointer bg-transparent border-t-0 border-r-0 border-b-0" title="Cerrar sesión">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H2v10h3M9 4l3 3-3 3M12 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
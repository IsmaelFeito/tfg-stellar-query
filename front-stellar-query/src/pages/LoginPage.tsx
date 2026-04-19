import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore(s => s.setAuth)

  const [form, setForm]       = useState({ username: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) { setError('Por favor, rellena todos los campos.'); return }
    setLoading(true)
    try {
      const { data } = await authService.login(form)
      setAuth(data.token, data.user)
      navigate('/hub')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Acceso denegado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showNav={false}>
      {/* Ambient lines */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        {['top-[20%]','bottom-[20%]'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} left-0 right-0 h-px`}
               style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.1), transparent)' }} />
        ))}
        {['left-[15%]','right-[15%]'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} top-0 bottom-0 w-px`}
               style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.08), transparent)' }} />
        ))}
      </div>

      <div className="min-h-[calc(100vh-60px-48px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px] corner-bracket animate-containerIn relative"
             style={{ background: 'rgba(5,15,31,0.88)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(16px)', padding: '2.5rem' }}>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-block mb-4 animate-float">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#00d4ff" strokeWidth="1" opacity="0.3" strokeDasharray="6 4"/>
                <circle cx="32" cy="32" r="20" stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
                <circle cx="32" cy="32" r="8" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1.5"/>
                <circle cx="32" cy="32" r="3" fill="#00d4ff"/>
                {[['32','2','32','12'],['32','52','32','62'],['2','32','12','32'],['52','32','62','32']].map(([x1,y1,x2,y2],i)=>(
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00d4ff" strokeWidth="1.5" opacity="0.8"/>
                ))}
              </svg>
            </div>
            <h1 className="font-display flex justify-center items-baseline gap-2 mb-2">
              <span className="text-[1.75rem] font-black text-cyan-glow tracking-[0.15em] text-glow-cyan">STELLAR</span>
              <span className="text-[1.1rem] font-normal text-cyan-glow/50 tracking-[0.3em]">QUERY</span>
            </h1>
            <p className="text-[0.6rem] text-cyan-glow/40 tracking-[0.15em]">// PROTOCOLO DE AUTENTICACIÓN DE TRIPULACIÓN //</p>
          </div>

          {/* Divider */}
          <div className="relative text-center mb-6">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.25), transparent)' }} />
            <span className="relative px-3 text-[0.6rem] text-cyan-glow/40 tracking-[0.15em]" style={{ background: 'rgba(5,15,31,0.88)' }}>ACCESO_SISTEMA</span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mb-4 text-[0.72rem] text-red-400 animate-fadeUp"
                 style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)' }}>
              <span className="text-red-glow text-base">⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.62rem] text-cyan-glow/55 tracking-[0.12em] flex items-center gap-1.5">
                <span className="text-cyan-glow/35">›</span> IDENTIFICADOR DE TRIPULANTE
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow/35 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M1 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </span>
                <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                       placeholder="cmdr_nombre" required minLength={3} maxLength={32}
                       className="sq-input pl-9" style={{ paddingLeft: '2.25rem' }} />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.62rem] text-cyan-glow/55 tracking-[0.12em] flex items-center gap-1.5">
                <span className="text-cyan-glow/35">›</span> CÓDIGO DE ACCESO
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow/35 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="9.5" r="1" fill="currentColor"/></svg>
                </span>
                <input type={showPw ? 'text' : 'password'} value={form.password}
                       onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                       placeholder="••••••••••••" required minLength={6}
                       className="sq-input" style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-glow/30 hover:text-cyan-glow/70 transition-colors bg-transparent border-none cursor-pointer p-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                     className="w-3.5 h-3.5 appearance-none border border-cyan-glow/30 bg-space-900 cursor-pointer relative checked:bg-cyan-glow/15 checked:border-cyan-glow/70" />
              <span className="text-[0.65rem] text-white/40 tracking-wider">MANTENER SESIÓN ACTIVA</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
                    className="sq-btn sq-btn-primary w-full py-3.5 text-[0.75rem] font-display font-bold tracking-[0.12em] mt-1 flex items-center justify-center gap-3 disabled:opacity-40">
              {loading ? (
                <>
                  <span className="flex gap-1"><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></span>
                  AUTENTICANDO...
                </>
              ) : (
                <>INICIAR SECUENCIA DE ACCESO <span className="text-base transition-transform group-hover:translate-x-1">→</span></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 mt-5 pt-5 border-t border-cyan-glow/8">
            <span className="text-[0.65rem] text-white/30">¿Sin acceso a la nave?</span>
            <Link to="/register" className="text-[0.65rem] text-cyan-glow/55 hover:text-cyan-glow tracking-widest border-b border-cyan-glow/20 hover:border-cyan-glow/60 pb-px transition-all no-underline">
              SOLICITAR CREDENCIALES
            </Link>
          </div>

          {/* System info */}
          <div className="flex items-center justify-center gap-3 mt-3">
            {[
              { color: 'bg-green-glow', shadow: '#00ff88', text: 'SERVIDOR ACTIVO' },
              { color: 'bg-amber-glow', shadow: '#ffb347', text: 'NAVE DAÑADA — REPARACIÓN PENDIENTE', anim: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[0.58rem] text-white/25 tracking-wider">
                {i > 0 && <span className="text-cyan-glow/15">|</span>}
                <span className={`w-[5px] h-[5px] rounded-full ${item.color} ${item.anim ? 'animate-pulse-slow' : ''}`}
                      style={{ boxShadow: `0 0 5px ${item.shadow}` }} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
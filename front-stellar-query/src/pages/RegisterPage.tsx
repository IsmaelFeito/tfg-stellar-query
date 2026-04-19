import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

function getStrength(pw: string) {
  let s = 0
  if (pw.length >= 8)  s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const map = [
    { pct: 0,   label: '—',         color: 'rgba(255,255,255,0.08)' },
    { pct: 20,  label: 'MUY DÉBIL', color: '#ff4444' },
    { pct: 40,  label: 'DÉBIL',     color: '#ff8844' },
    { pct: 60,  label: 'MEDIA',     color: '#ffb347' },
    { pct: 80,  label: 'FUERTE',    color: '#88dd44' },
    { pct: 100, label: 'MÁXIMA',    color: '#00ff88' },
  ]
  return map[s] || map[0]
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore(s => s.setAuth)

  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const strength = getStrength(form.password)
  const pwMatch  = form.confirm ? form.confirm === form.password : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) { setError('Nombre de usuario inválido (3–20 chars, sin espacios).'); return }
    setLoading(true)
    try {
      const { data } = await authService.register({ username: form.username, email: form.email, password: form.password })
      setAuth(data.token, data.user)
      setSuccess(true)
      setTimeout(() => navigate('/hub'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo completar el registro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showNav={false}>
      <div className="min-h-[calc(100vh-60px-48px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[560px] corner-bracket animate-containerIn"
             style={{ background: 'rgba(5,15,31,0.88)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(16px)', padding: '2.5rem' }}>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3 animate-float">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" stroke="#00d4ff" strokeWidth="1" opacity="0.3" strokeDasharray="5 4"/>
                <circle cx="26" cy="26" r="16" stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
                <circle cx="26" cy="26" r="6" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1.5"/>
                <circle cx="26" cy="26" r="2" fill="#00d4ff"/>
              </svg>
            </div>
            <h1 className="font-display flex flex-col items-center mb-1">
              <span className="text-[1.5rem] font-black text-cyan-glow tracking-[0.15em] text-glow-cyan">SOLICITUD</span>
              <span className="text-[0.8rem] text-cyan-glow/40 tracking-[0.35em]">DE TRIPULANTE</span>
            </h1>
            <p className="text-[0.6rem] text-cyan-glow/35 tracking-[0.15em]">// PROTOCOLO DE ALTA — NAVE S.Q. NEBULA-7 //</p>
          </div>

          {/* Divider */}
          <div className="relative text-center mb-5">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.25),transparent)' }} />
            <span className="relative px-3 text-[0.58rem] text-cyan-glow/35 tracking-[0.15em]" style={{ background: 'rgba(5,15,31,0.88)' }}>REGISTRO_NUEVO_MIEMBRO</span>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mb-4 text-[0.72rem] text-red-400 animate-fadeUp"
                 style={{ background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.3)' }}>
              <span className="text-base">⚠</span>{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 px-3 py-3 mb-4 animate-fadeUp"
                 style={{ background:'rgba(0,255,136,0.07)', border:'1px solid rgba(0,255,136,0.25)' }}>
              <span className="text-[1.2rem] text-green-glow flex-shrink-0">✓</span>
              <div>
                <div className="font-display text-[0.7rem] font-bold text-green-glow tracking-widest mb-0.5">REGISTRO COMPLETADO</div>
                <div className="text-[0.68rem] text-green-glow/60">Bienvenido a la tripulación. Redirigiendo...</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Row: username + email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.62rem] text-cyan-glow/55 tracking-[0.12em]"><span className="text-cyan-glow/35">› </span>IDENTIFICADOR</label>
                <input type="text" value={form.username} onChange={e => setForm(f=>({...f,username:e.target.value}))}
                       placeholder="cmdr_nombre" required minLength={3} maxLength={20} pattern="[a-zA-Z0-9_]+"
                       className="sq-input" />
                <span className="text-[0.58rem] text-white/28">3–20 chars, letras, números y _</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.62rem] text-cyan-glow/55 tracking-[0.12em]"><span className="text-cyan-glow/35">› </span>CORREO</label>
                <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                       placeholder="cmdr@nebula.net" required className="sq-input" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.62rem] text-cyan-glow/55 tracking-[0.12em]"><span className="text-cyan-glow/35">› </span>CÓDIGO DE ACCESO</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                       onChange={e => setForm(f=>({...f,password:e.target.value}))}
                       placeholder="Mínimo 8 caracteres" required minLength={8}
                       className="sq-input" style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-glow/30 hover:text-cyan-glow/70 bg-transparent border-none cursor-pointer p-1 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4-5.5-4-5.5-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/></svg>
                </button>
              </div>
              {/* Strength bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength.pct}%`, background: strength.color }} />
                </div>
                <span className="text-[0.58rem] tracking-wider min-w-[60px]" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            </div>

            {/* Confirm */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.62rem] text-cyan-glow/55 tracking-[0.12em]"><span className="text-cyan-glow/35">› </span>CONFIRMAR CÓDIGO</label>
              <input type="password" value={form.confirm} onChange={e => setForm(f=>({...f,confirm:e.target.value}))}
                     placeholder="Repite la contraseña" required className="sq-input" />
              {pwMatch !== null && (
                <span className={`text-[0.58rem] tracking-wider ${pwMatch ? 'text-green-glow/70' : 'text-red-glow/60'}`}>
                  {pwMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                </span>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success}
                    className="sq-btn sq-btn-primary w-full py-3.5 text-[0.72rem] font-display font-bold tracking-[0.12em] mt-1 flex items-center justify-center gap-3 disabled:opacity-40">
              {loading ? (
                <><span className="flex gap-1"><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></span> PROCESANDO...</>
              ) : 'SOLICITAR ACCESO A LA NAVE →'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 mt-5 pt-5 border-t border-cyan-glow/8">
            <span className="text-[0.65rem] text-white/30">¿Ya tienes acceso?</span>
            <Link to="/" className="text-[0.65rem] text-cyan-glow/55 hover:text-cyan-glow tracking-widest border-b border-cyan-glow/20 hover:border-cyan-glow/60 pb-px transition-all no-underline">
              INICIAR SESIÓN
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
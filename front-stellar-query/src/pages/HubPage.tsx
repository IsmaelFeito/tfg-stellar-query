import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

const damageBars = [
  { name: 'BBDD PRINCIPAL', pct: 23, color: '#ff4444', cls: 'animate-critPulse' },
  { name: 'MÓDULO QUERY',   pct: 47, color: '#ffb347', cls: '' },
  { name: 'MOTOR DE DATOS', pct: 68, color: '#ffd700', cls: '' },
  { name: 'NÚCLEO SISTEMA', pct: 85, color: '#00ff88', cls: '' },
]

function MissionCard({ to, glowColor, badgeColor, badgeBg, badge, statusColor, statusDot, status, iconPath, title, titleColor, titleGlow, subtitle, subtitleColor, desc, tags, tagColor, tagBorder, scanColor, footerBorder, ctaColor }: any) {
  return (
    <Link to={to} className="relative flex flex-col gap-5 p-7 no-underline text-inherit overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
          style={{ background: 'rgba(5,15,31,0.85)', border: `1px solid rgba(${glowColor},0.2)`, backdropFilter: 'blur(12px)', minHeight: 360 }}>
      {/* Glow blob */}
      <div className="absolute w-[300px] h-[300px] rounded-full -top-20 -right-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ background: `radial-gradient(circle, rgba(${glowColor},0.12), transparent 70%)`, filter: 'blur(80px)' }} />
      {/* Scan line */}
      <div className="absolute left-0 w-full h-px opacity-0 group-hover:opacity-70 pointer-events-none z-[4] transition-none group-hover:animate-scan"
           style={{ background: `linear-gradient(90deg, transparent, ${scanColor}, transparent)` }} />
      {/* Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 opacity-30 group-hover:opacity-90 transition-opacity" style={{ borderTop: `2px solid ${scanColor}`, borderLeft: `2px solid ${scanColor}` }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 opacity-30 group-hover:opacity-90 transition-opacity" style={{ borderBottom: `2px solid ${scanColor}`, borderRight: `2px solid ${scanColor}` }} />

      {/* Top row */}
      <div className="flex justify-between items-center relative z-[2]">
        <span className={`text-[0.58rem] tracking-[0.15em] px-2 py-0.5 border`} style={{ color: badgeColor, borderColor: `${badgeColor}33`, background: badgeBg }}>{badge}</span>
        <div className="flex items-center gap-1.5 text-[0.58rem] tracking-wider" style={{ color: statusColor }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDot, boxShadow: `0 0 6px ${statusDot}`, animation: status === 'CRÍTICO' ? 'blink 1s step-end infinite' : 'pulse 2s ease-in-out infinite' }} />
          {status}
        </div>
      </div>

      {/* Icon */}
      <div className="flex justify-center relative z-[2]">
        <div className="animate-float">{iconPath}</div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 flex-1 relative z-[2]">
        <h2 className="font-display text-[1.3rem] font-black tracking-[0.1em] m-0" style={{ color: titleColor, textShadow: `0 0 15px ${titleGlow}` }}>{title}</h2>
        <p className="text-[0.7rem] tracking-[0.08em] m-0" style={{ color: subtitleColor }}>{subtitle}</p>
        <p className="text-[0.75rem] leading-relaxed m-0 mt-2 text-white/50">{desc}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 relative z-[2]" style={{ borderTop: `1px solid ${footerBorder}` }}>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t: string) => (
            <span key={t} className="text-[0.58rem] px-1.5 py-0.5 border tracking-wider" style={{ color: tagColor, borderColor: tagBorder }}>{t}</span>
          ))}
        </div>
        <span className="font-display text-[0.65rem] font-bold tracking-widest transition-all duration-200" style={{ color: ctaColor }}>
          {title === 'INICIAR MISIÓN' ? 'LANZAR' : 'EXPLORAR'} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}

export default function HubPage() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => { const id = setInterval(() => setSeconds(s => s+1), 1000); return () => clearInterval(id) }, [])
  const pad = (n: number) => String(n).padStart(2,'0')
  const h = Math.floor(seconds/3600), m = Math.floor((seconds%3600)/60), s = seconds%60
  const timer = `${pad(h)}:${pad(m)}:${pad(s)}`

  return (
    <Layout showNav>
      <div className="min-h-[calc(100vh-60px-48px)] max-w-[1100px] mx-auto px-8 py-12 flex flex-col gap-10">

        {/* Header */}
        <div className="text-center animate-fadeDown">
          <div className="inline-flex items-center gap-2 text-[0.6rem] text-cyan-glow/50 border border-cyan-glow/15 px-4 py-1.5 mb-5 tracking-[0.18em]" style={{ background: 'rgba(0,212,255,0.03)' }}>
            <span className="text-cyan-glow/40">⬡</span> CENTRO DE MANDO — NAVE S.Q. NEBULA-7
          </div>
          <h1 className="font-display flex flex-col items-center m-0 mb-4 leading-none gap-0.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-normal text-white/60 tracking-[0.3em]">SELECCIONA</span>
            <span className="text-[clamp(2.2rem,6vw,4rem)] font-black text-cyan-glow tracking-[0.2em] text-glow-cyan">TU PROTOCOLO</span>
          </h1>
          <p className="text-[0.8rem] text-white/45 max-w-[480px] mx-auto leading-relaxed">
            La nave ha sufrido daños críticos en el sistema de base de datos.
            Para restaurarla deberás dominar el lenguaje <span className="text-cyan-glow text-glow-cyan">SQL</span>. Elige tu módulo de operación.
          </p>
        </div>

        {/* Damage bars */}
        <div className="animate-fadeUp" style={{ background:'rgba(5,15,31,0.7)', border:'1px solid rgba(0,212,255,0.1)', padding:'1rem 1.5rem' }}>
          <div className="text-[0.6rem] text-cyan-glow/40 tracking-[0.15em] mb-3">// INFORME DE DAÑOS — SISTEMA PRINCIPAL //</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {damageBars.map(b => (
              <div key={b.name} className="flex items-center gap-2 text-[0.62rem]">
                <span className="text-white/40 text-[0.58rem] w-[90px] flex-shrink-0">{b.name}</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className={`h-full rounded-full ${b.cls}`} style={{ width: `${b.pct}%`, background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
                </div>
                <span className="text-[0.65rem] min-w-[32px] text-right" style={{ color: b.color }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <MissionCard
            to="/game"
            glowColor="0,212,255" badgeColor="rgba(0,212,255,0.6)" badgeBg="rgba(0,212,255,0.05)" badge="MISIÓN PRINCIPAL"
            statusColor="rgba(255,68,68,0.7)" statusDot="#ff4444" status="CRÍTICO"
            iconPath={
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.4"/>
                <polygon points="40,16 62,28 62,52 40,64 18,52 18,28" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,212,255,0.04)" opacity="0.6"/>
                <polygon points="32,27 58,40 32,53" fill="#00d4ff" opacity="0.9"/>
                <ellipse cx="40" cy="40" rx="30" ry="12" stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.25" transform="rotate(-30 40 40)"/>
              </svg>
            }
            title="INICIAR MISIÓN" titleColor="#00d4ff" titleGlow="rgba(0,212,255,0.5)"
            subtitle="Reparar la nave con SQL" subtitleColor="rgba(200,221,232,0.4)"
            desc="Usa consultas SQL reales para reparar los sistemas dañados de la nave. Cada query correcta restaura integridad."
            tags={['SELECT','WHERE','JOIN','+más']} tagColor="rgba(0,212,255,0.5)" tagBorder="rgba(0,212,255,0.15)"
            scanColor="#00d4ff" footerBorder="rgba(0,212,255,0.1)" ctaColor="rgba(0,212,255,0.6)"
          />
          <MissionCard
            to="/docs"
            glowColor="255,179,71" badgeColor="rgba(255,179,71,0.7)" badgeBg="rgba(255,179,71,0.04)" badge="BASE DE CONOCIMIENTO"
            statusColor="rgba(0,255,136,0.7)" statusDot="#00ff88" status="DISPONIBLE"
            iconPath={
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="14" y="12" width="52" height="58" rx="2" stroke="#ffb347" strokeWidth="1.5" fill="rgba(255,179,71,0.04)" opacity="0.5"/>
                <line x1="28" y1="12" x2="28" y2="70" stroke="#ffb347" strokeWidth="1" opacity="0.4"/>
                {[26,34,42].map((y,i) => <line key={i} x1="36" y1={y} x2={i===2?52:58} y2={y} stroke="#ffb347" strokeWidth="1.5" strokeLinecap="round" opacity={0.7-i*0.15}/>)}
                <text x="14" y="60" fontFamily="monospace" fontSize="18" fill="#ffb347" opacity="0.6">{'{}'}</text>
              </svg>
            }
            title="DOCUMENTACIÓN" titleColor="#ffb347" titleGlow="rgba(255,179,71,0.4)"
            subtitle="Guías de SQL para la misión" subtitleColor="rgba(255,179,71,0.4)"
            desc="Consulta guías completas sobre SQL: desde SELECT básico hasta JOINs complejos. Aprende antes de entrar en combate."
            tags={['GUÍAS','EJEMPLOS','REFERENCIA']} tagColor="rgba(255,179,71,0.55)" tagBorder="rgba(255,179,71,0.15)"
            scanColor="#ffb347" footerBorder="rgba(255,179,71,0.1)" ctaColor="rgba(255,179,71,0.6)"
          />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 p-5 animate-fadeUp" style={{ background:'rgba(5,15,31,0.6)', border:'1px solid rgba(0,212,255,0.08)', animationDelay:'0.2s' }}>
          {[
            { label: 'MISIONES COMPLETADAS', value: '0 / 24', cls: 'text-cyan-glow text-glow-cyan' },
            { label: 'INTEGRIDAD TOTAL',     value: '23%',    cls: 'text-red-glow text-glow-red' },
            { label: 'TIEMPO EN MISIÓN',     value: timer,    cls: 'text-amber-glow text-glow-amber tabular-nums' },
            { label: 'NIVEL SQL',            value: 'NOVATO', cls: 'text-green-glow text-glow-green' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {i > 0 && <span className="hidden md:block absolute text-cyan-glow/15 text-[0.5rem]">◆</span>}
              <span className="text-[0.58rem] text-white/30 tracking-widest">{stat.label}</span>
              <span className={`font-display text-[0.9rem] font-bold tracking-wider ${stat.cls}`}>{stat.value}</span>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  )
}
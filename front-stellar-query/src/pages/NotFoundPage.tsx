import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

export default function NotFoundPage() {
  return (
    <Layout showNav={false}>
      <div className="min-h-[calc(100vh-60px-48px)] flex items-center justify-center px-4">
        <div className="text-center animate-fadeUp max-w-[520px]">

          {/* Error code */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-display text-[5rem] font-black text-red-glow leading-none text-glow-red">4</span>
            <div className="animate-spin-slow">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" stroke="#ff4444" strokeWidth="1.5" opacity="0.3" strokeDasharray="8 5"/>
                <circle cx="60" cy="60" r="40" stroke="#ff4444" strokeWidth="1" opacity="0.5"/>
                <circle cx="60" cy="60" r="20" fill="rgba(255,68,68,0.08)" stroke="#ff4444" strokeWidth="1.5"/>
                <line x1="48" y1="48" x2="72" y2="72" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
                <line x1="72" y1="48" x2="48" y2="72" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
              </svg>
            </div>
            <span className="font-display text-[5rem] font-black text-red-glow leading-none text-glow-red">4</span>
          </div>

          <h1 className="font-display text-[1.3rem] font-black text-red-glow tracking-[0.1em] m-0 mb-2 text-glow-red">SECTOR NO ENCONTRADO</h1>
          <p className="text-[0.62rem] text-red-glow/45 tracking-[0.15em] mb-4">ERR_SECTOR_UNREACHABLE // COORDENADAS INVÁLIDAS</p>
          <p className="text-[0.78rem] text-white/45 leading-relaxed mb-8">
            La ruta que intentas acceder no existe en los mapas de la nave. Puede haber sido destruida durante el ataque o las coordenadas son erróneas.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Link to="/" className="flex items-center gap-2 font-display text-[0.7rem] font-bold text-red-glow no-underline px-5 py-3 border border-red-glow/40 bg-red-glow/8 hover:bg-red-glow/16 hover:border-red-glow transition-all tracking-widest"
                  style={{ clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))' }}>
              ← VOLVER AL INICIO
            </Link>
            <Link to="/hub" className="flex items-center gap-2 font-display text-[0.7rem] font-bold text-white/50 no-underline px-5 py-3 border border-white/15 hover:border-white/35 hover:text-white transition-all tracking-widest"
                  style={{ clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))' }}>
              CENTRO DE MANDO
            </Link>
          </div>

          {/* Error log */}
          <div className="p-4 text-left" style={{ background:'rgba(2,8,19,0.9)', border:'1px solid rgba(255,68,68,0.12)' }}>
            {[
              { ts:'00:00:01', type:'error', text:'Ruta solicitada no encontrada en el sistema de navegación' },
              { ts:'00:00:01', type:'warn',  text:'Verificando rutas alternativas...' },
              { ts:'00:00:02', type:'error', text:'Sin rutas alternativas disponibles' },
              { ts:'00:00:02', type:'info',  text:'Recomendando retorno al sector principal' },
            ].map((l, i) => {
              const color = l.type === 'error' ? 'text-red-400/70' : l.type === 'warn' ? 'text-amber-glow/60' : 'text-cyan-glow/55'
              const prefix = l.type === 'error' ? '[ERROR]' : l.type === 'warn' ? '[WARN]' : '[INFO]'
              return (
                <div key={i} className="flex gap-3 font-mono text-[0.65rem] py-0.5">
                  <span className="text-white/25 flex-shrink-0">{l.ts}</span>
                  <span className={`flex-shrink-0 ${color}`}>{prefix}</span>
                  <span className="text-white/45">{l.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
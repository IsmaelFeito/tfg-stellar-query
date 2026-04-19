import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

const guides = [
  { id:'select',     level:'BÁSICO',     color:'green', title:'SELECT',     subtitle:'Recuperar datos de una tabla',      topics:['SELECT *','Alias AS','DISTINCT','LIMIT'] },
  { id:'where',      level:'BÁSICO',     color:'green', title:'WHERE',      subtitle:'Filtrar resultados con condiciones', topics:['=, >, <','AND, OR, NOT','BETWEEN','IN, LIKE'] },
  { id:'order-by',   level:'BÁSICO',     color:'green', title:'ORDER BY',   subtitle:'Ordenar los resultados',            topics:['ASC / DESC','Múltiples columnas','NULL ordering'] },
  { id:'insert',     level:'BÁSICO',     color:'green', title:'INSERT',     subtitle:'Insertar nuevos registros',          topics:['INSERT INTO','Multiple rows','INSERT SELECT'] },
  { id:'update',     level:'BÁSICO',     color:'green', title:'UPDATE',     subtitle:'Modificar registros existentes',     topics:['SET multiple','UPDATE + JOIN','Transacciones'] },
  { id:'delete',     level:'BÁSICO',     color:'green', title:'DELETE',     subtitle:'Eliminar registros',                 topics:['DELETE WHERE','TRUNCATE','Soft delete'] },
  { id:'group-by',   level:'INTERMEDIO', color:'amber', title:'GROUP BY',   subtitle:'Agrupar y agregar datos',           topics:['COUNT','SUM, AVG','MIN, MAX','HAVING'] },
  { id:'joins',      level:'INTERMEDIO', color:'amber', title:'JOINs',      subtitle:'Combinar múltiples tablas',          topics:['INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL JOIN'] },
  { id:'subqueries', level:'AVANZADO',   color:'red',   title:'SUBQUERIES', subtitle:'Consultas dentro de consultas',      topics:['IN / NOT IN','EXISTS','CTE WITH'] },
]

const colorMap: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  green: { text:'text-green-glow', border:'border-green-glow/20', bg:'bg-green-glow/4', glow:'rgba(0,255,136,0.4)' },
  amber: { text:'text-amber-glow', border:'border-amber-glow/20', bg:'bg-amber-glow/4', glow:'rgba(255,179,71,0.4)' },
  red:   { text:'text-red-glow',   border:'border-red-glow/20',   bg:'bg-red-glow/4',   glow:'rgba(255,68,68,0.4)' },
}

export default function DocsPage() {
  const [search, setSearch]       = useState('')
  const [activeLevel, setLevel]   = useState('all')

  const filtered = guides.filter(g => {
    const matchLevel  = activeLevel === 'all' || g.level === activeLevel
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.subtitle.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  return (
    <Layout showNav>
      <div className="max-w-[1200px] mx-auto px-8 py-12 flex flex-col gap-8">

        {/* Header */}
        <div className="text-center animate-fadeDown">
          <div className="inline-flex items-center gap-2 text-[0.6rem] text-amber-glow/55 border border-amber-glow/15 px-4 py-1.5 mb-4 tracking-[0.14em]" style={{ background:'rgba(255,179,71,0.03)' }}>
            📡 BASE DE CONOCIMIENTO — PROTOCOLO SQL
          </div>
          <h1 className="font-display flex flex-col items-center m-0 mb-3 leading-none gap-0.5">
            <span className="text-[clamp(1.5rem,4vw,2.5rem)] font-normal text-white/40 tracking-[0.35em]">MANUAL</span>
            <span className="text-[clamp(1.8rem,5vw,3rem)] font-black text-amber-glow tracking-[0.15em] text-glow-amber">DE OPERACIONES</span>
          </h1>
          <p className="text-[0.78rem] text-white/45 max-w-[520px] mx-auto leading-relaxed">
            Guías de referencia para dominar el lenguaje SQL y reparar los sistemas de la nave.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center animate-fadeUp">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow/35 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/><line x1="9" y1="9" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </span>
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar comando o concepto..."
                   className="sq-input" style={{ paddingLeft: '2.25rem' }} />
          </div>
          <div className="flex gap-1.5">
            {[['all','TODOS','text-cyan-glow/70 border-cyan-glow/30'],['BÁSICO','BÁSICO','text-green-glow/70 border-green-glow/30'],['INTERMEDIO','INTERMEDIO','text-amber-glow/70 border-amber-glow/30'],['AVANZADO','AVANZADO','text-red-glow/70 border-red-glow/30']].map(([val,label,cls]) => (
              <button key={val} onClick={() => setLevel(val)}
                      className={`font-mono text-[0.62rem] tracking-wider px-3 py-2 border bg-transparent cursor-pointer transition-all
                        ${activeLevel === val ? cls + ' bg-white/5' : 'text-white/35 border-white/12 hover:text-white/60'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-wrap items-center justify-center gap-6 p-4 animate-fadeUp" style={{ background:'rgba(5,15,31,0.6)', border:'1px solid rgba(255,179,71,0.08)' }}>
          {[
            { label:'COMPLETADAS', val:'0 / ' + guides.length, cls:'text-green-glow text-glow-green' },
            { label:'NIVEL ACTUAL', val:'APRENDIZ', cls:'text-amber-glow text-glow-amber' },
            { label:'XP TOTAL', val:'0 XP', cls:'text-cyan-glow text-glow-cyan' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-[0.58rem] text-white/30 tracking-widest">{s.label}</span>
              <span className={`font-display text-[0.85rem] font-bold ${s.cls}`}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Guide grid */}
        <div className="grid gap-5 animate-fadeUp" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map(g => {
            const c = colorMap[g.color]
            return (
              <Link key={g.id} to={`/docs/${g.id}`}
                    className="relative flex flex-col gap-3 p-5 no-underline text-inherit overflow-hidden transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                    style={{ background:'rgba(5,15,31,0.82)', border:'1px solid rgba(0,212,255,0.12)', backdropFilter:'blur(10px)' }}>
                {/* Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderTop:`1px solid`,borderLeft:`1px solid`, borderColor:'rgba(0,212,255,0.6)' }} />
                <div className="absolute bottom-0 right-0 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderBottom:`1px solid`,borderRight:`1px solid`, borderColor:'rgba(0,212,255,0.6)' }} />

                <div className="flex justify-between items-center">
                  <span className={`text-[0.58rem] tracking-[0.12em] px-2 py-0.5 border ${c.text} ${c.border} ${c.bg}`}>{g.level}</span>
                  <span className="text-[0.58rem] text-cyan-glow/25 tracking-widest">#{g.id.toUpperCase()}</span>
                </div>

                <div>
                  <h2 className={`font-display text-[1.2rem] font-black tracking-wider m-0 mb-0.5 ${c.text}`} style={{ textShadow:`0 0 12px ${c.glow}` }}>{g.title}</h2>
                  <p className="text-[0.68rem] text-white/40 m-0 tracking-wider">{g.subtitle}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {g.topics.map(t => (
                    <span key={t} className={`text-[0.58rem] px-1.5 py-0.5 border tracking-wider ${c.text} ${c.border}`}>{t}</span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-cyan-glow/6">
                  <div className="flex items-center gap-1.5 text-[0.6rem] text-white/25 tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-white/20" /> PENDIENTE
                  </div>
                  <span className={`font-display text-[0.6rem] font-bold tracking-widest transition-all ${c.text}`}>
                    ESTUDIAR <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-[0.75rem] text-white/30 text-center">
            <span className="text-2xl opacity-40">◎</span>
            No se encontraron guías que coincidan con tu búsqueda.
          </div>
        )}

        {/* Quick reference */}
        <div className="overflow-hidden animate-fadeUp" style={{ background:'rgba(3,10,22,0.85)', border:'1px solid rgba(0,212,255,0.1)' }}>
          <div className="px-4 py-2.5 text-[0.6rem] text-cyan-glow/40 tracking-[0.15em] border-b border-cyan-glow/8 bg-cyan-glow/3">
            // REFERENCIA RÁPIDA — COMANDOS SQL ESENCIALES
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[0.62rem] text-cyan-glow/40 tracking-widest bg-cyan-glow/4">
                  {['COMANDO','DESCRIPCIÓN','EJEMPLO'].map(h => <th key={h} className="text-left px-4 py-2.5 border-b border-cyan-glow/10 font-normal">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ['SELECT','Recuperar datos','SELECT nombre FROM tripulantes;'],
                  ['WHERE','Filtrar filas',"WHERE estado = 'activo'"],
                  ['ORDER BY','Ordenar resultados','ORDER BY rango DESC'],
                  ['GROUP BY','Agrupar filas','GROUP BY departamento'],
                  ['JOIN','Unir tablas','INNER JOIN naves ON id = nave_id'],
                  ['INSERT','Insertar filas','INSERT INTO t (col) VALUES (val)'],
                  ['UPDATE','Modificar filas','UPDATE t SET col = val WHERE id = 1'],
                  ['DELETE','Eliminar filas','DELETE FROM t WHERE id = 1'],
                ].map(([cmd, desc, ex]) => (
                  <tr key={cmd} className="hover:bg-cyan-glow/3 border-b border-cyan-glow/4 last:border-0">
                    <td className="px-4 py-2.5"><code className="font-display text-[0.72rem] text-cyan-glow text-glow-cyan">{cmd}</code></td>
                    <td className="px-4 py-2.5 text-[0.72rem] text-white/50">{desc}</td>
                    <td className="px-4 py-2.5 hidden md:table-cell"><code className="font-mono text-[0.68rem] text-amber-glow/60">{ex}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
import { useState, useRef, useEffect, useCallback } from 'react'
import Layout from '../components/layout/Layout'
import { gameService, type Mision, type QueryResponse } from '../services/gameService'
import { MISIONS_MOCK } from '../mocks/misions.mocks'
import { SCHEMAS, MISION_TABLAS } from '../mocks/schema.mocks'

interface LogLine { text: string; type: 'system' | 'info' | 'warn' | 'error' | 'success' | 'prompt' }

export default function GamePage() {
  const [query, setQuery]         = useState('')
  const [lines, setLines]         = useState<LogLine[]>([
    { text: 'Conectando con servidor de base de datos...', type: 'system' },
    { text: 'Conexión establecida. Base de datos: NAVE_NEBULA_7', type: 'system' },
    { text: 'Integridad comprometida. Tabla tripulantes requiere validación.', type: 'warn' },
    { text: 'Introduce tu primera consulta SQL para comenzar.', type: 'info' },
  ])
  const [result, setResult]       = useState<QueryResponse | null>(null)
  const [loading, setLoading]     = useState(false)
  const [attempts, setAttempts]   = useState(0)
  const [score, setScore]         = useState(0)
  const [repaired, setRepaired]   = useState(0)
  const [activeMision, setActiveMision] = useState<Mision>(MISIONS_MOCK[0])

  const outputRef  = useRef<HTMLDivElement>(null)
  const editorRef  = useRef<HTMLTextAreaElement>(null)
  const lineNumRef = useRef<HTMLDivElement>(null)

  const lineCount = query.split('\n').length

  const addLine = useCallback((text: string, type: LogLine['type']) => {
    setLines(prev => [...prev, { text, type }])
  }, [])

  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines])

  // Porcentaje de integridad basado en misiones completadas
  const widthBar = Math.round((repaired / MISIONS_MOCK.length) * 100)

  // FIX: activeMision añadido a las dependencias del useCallback
  // Sin esto execute() siempre veía la misión 1 (stale closure)
  const execute = useCallback(async () => {
    if (!query.trim()) {
      addLine('Error: consulta vacía.', 'error')
      return
    }
    setAttempts(a => a + 1)
    addLine(`Ejecutando: ${query.trim().slice(0, 60)}${query.length > 60 ? '...' : ''}`, 'info')
    setLoading(true)
    try {
      const { data } = await gameService.executeQuery({ query, misionId: activeMision.id })
      setResult(data)
      if (data.success) {
        setAttempts(0)
        addLine(data.message || 'Consulta correcta.', 'success')

        // FIX: avance de misión usando .find() por orden en vez de índice de array
        // ANTES: MISIONS_MOCK[activeMision.orden > 9 ? 1 : activeMision.orden]
        //   → cuando orden=10 reseteaba al principio en vez de terminar el juego
        //   → confundía índice (0-based) con orden (1-based)
        // AHORA: buscamos la misión con orden = actual + 1
        //   → si no existe (última misión), no cambiamos estado y juegoCompletado se activa
        const nextMission = MISIONS_MOCK.find(m => m.orden === activeMision.orden + 1)
        if (nextMission) {
          setActiveMision(nextMission)
          addLine(`[SYS] Cargando misión: ${nextMission.titulo}`, 'system')
        }

        setQuery('')
        if (data.xp) {
          setScore(s => s + data.xp!)
          setRepaired(r => r + 1)
        }
      } else {
        addLine(data.message || 'Query incorrecta.', 'error')
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error de conexión con el servidor.'
      addLine(msg, 'error')
      setResult({ success: false, message: msg })
    } finally {
      setLoading(false)
    }
  }, [query, addLine, activeMision]) // FIX: activeMision en dependencias

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      execute()
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = editorRef.current!
      const s = el.selectionStart
      setQuery(q => q.slice(0, s) + '  ' + q.slice(el.selectionEnd))
      setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2 }, 0)
    }
  }

  const lineColors: Record<LogLine['type'], string> = {
    system:  'text-white/50', info: 'text-cyan-glow/60', warn: 'text-amber-glow/70',
    error:   'text-red-400',  success: 'text-green-glow/80', prompt: 'text-green-glow/50',
  }
  const linePrefix: Record<LogLine['type'], string> = {
    system: '[SYS]', info: '[INFO]', warn: '[WARN]', error: '[ERR]', success: '[OK]', prompt: 'nebula_7>'
  }

  const tablasActivas = MISION_TABLAS[activeMision.id] ?? ['crew_mates']

  // FIX: condición de fin de juego
  // ANTES: repaired >= MISIONS_MOCK.length - 1  → se activaba en misión 9 (de 10)
  // AHORA: repaired >= MISIONS_MOCK.length      → se activa solo al completar las 10
  const juegoCompletado = repaired >= MISIONS_MOCK.length

  // Pantalla de victoria — se muestra cuando se completan todas las misiones
  if (juegoCompletado) {
    return (
      <Layout showNav>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-60px-48px)] gap-6 text-center"
            style={{ background: 'rgba(2,8,19,0.98)' }}>

          {/* Icono */}
          <div className="text-6xl animate-float">🛸</div>

          {/* Título */}
          <h1 className="font-display text-3xl font-black text-cyan-glow tracking-widest text-glow-cyan">
            SISTEMA RESTAURADO
          </h1>

          {/* Subtítulo */}
          <p className="text-white/50 text-sm tracking-widest max-w-md">
            Has completado todas las misiones y devuelto la integridad al 100%.
            La tripulación de la Nebula-7 está a salvo.
          </p>

          {/* Stats finales */}
          <div className="flex gap-8 mt-4">
            {[
              { label: 'MISIONES',   value: `${repaired} / ${MISIONS_MOCK.length}` },
              { label: 'PUNTUACIÓN', value: score },
              { label: 'INTENTOS',   value: attempts },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="font-display text-2xl font-black text-cyan-glow text-glow-cyan">
                  {stat.value}
                </span>
                <span className="text-[0.6rem] text-white/35 tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Botón reiniciar — resetea todo el estado al inicial */}
          <button
            onClick={() => {
              setRepaired(0)
              setScore(0)
              setAttempts(0)
              setActiveMision(MISIONS_MOCK[0])
              setResult(null)
              setQuery('')
              setLines([
                { text: 'Nueva partida iniciada. Buena suerte, comandante.', type: 'system' }
              ])
            }}
            className="mt-4 font-display font-bold text-[0.75rem] text-cyan-glow border border-cyan-glow/35
                      px-6 py-3 tracking-widest cursor-pointer transition-all hover:bg-cyan-glow/8
                      hover:border-cyan-glow bg-cyan-glow/8"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            JUGAR DE NUEVO
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showNav>
      <div className="flex flex-col h-[calc(100vh-60px-48px)]">

        {/* Alert banner */}
        <div className="flex items-center justify-center gap-4 px-4 py-2 text-[0.65rem] tracking-[0.15em] text-red-400/80"
             style={{ background: 'rgba(255,68,68,0.08)', borderBottom: '1px solid rgba(255,68,68,0.2)' }}>
          <span className="animate-blink">⚠</span>
          ALERTA: SISTEMA DE BASE DE DATOS COMPROMETIDO — INICIAR PROTOCOLO DE REPARACIÓN SQL
          <span className="animate-blink">⚠</span>
        </div>

        {/* 3-column layout */}
        <div className="grid flex-1 overflow-hidden" style={{ gridTemplateColumns: '260px 1fr 280px' }}>

          {/* LEFT — Mission panel */}
          <aside className="flex flex-col gap-0 overflow-y-auto p-5" style={{ background: 'rgba(3,10,22,0.9)', borderRight: '1px solid rgba(0,212,255,0.08)' }}>

            {/* Mission info */}
            <div className="py-3">
              <div className="text-[0.58rem] text-cyan-glow/35 tracking-[0.15em] mb-2">// MISIÓN ACTIVA</div>
              {/* FIX: formato del ID de misión — padding consistente para 1-10 */}
              <h2 className="font-display text-[0.95rem] font-black text-cyan-glow tracking-wider m-0 mb-2 text-glow-cyan">
                M-{String(activeMision.id).padStart(3, '0')}
              </h2>
              <div className="font-display text-[0.65rem] text-cyan-glow/40 tracking-[0.2em] mb-1">
                {activeMision.enunciado}
              </div>
              <p className="text-[0.72rem] text-white/50 leading-relaxed m-0">
                {activeMision.descripcion}
              </p>
            </div>
            <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.15), transparent)' }} />

            {/* Schema — tablas relevantes para la misión activa */}
            <div className="py-3">
              {tablasActivas.map(tabla => (
                <div key={tabla} className="mb-3 last:mb-0">
                  <div className="text-[0.58rem] text-cyan-glow/35 tracking-[0.15em] mb-2">
                    // ESQUEMA — {tabla}
                  </div>
                  <div className="border border-cyan-glow/10 text-[0.68rem]">
                    <div className="grid grid-cols-2 px-2 py-1.5 bg-cyan-glow/5 text-cyan-glow/50
                                    text-[0.6rem] tracking-wider border-b border-cyan-glow/8">
                      <span>COLUMNA</span><span>TIPO</span>
                    </div>
                    {SCHEMAS[tabla].map(s => (
                      <div key={s.col} className="grid grid-cols-2 px-2 py-1.5 border-b border-cyan-glow/5 last:border-0">
                        <span className={
                          s.pk ? 'text-amber-glow' :
                          s.fk ? 'text-purple-400/70' :
                          'text-white/60'
                        }>
                          {s.col}
                          {s.pk && <span className="ml-1 text-[0.55rem] text-amber-glow/50">PK</span>}
                          {s.fk && <span className="ml-1 text-[0.55rem] text-purple-400/50">FK</span>}
                        </span>
                        <span className="text-cyan-glow/40">{s.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.15), transparent)' }} />

            {/* Integrity — barra de progreso dinámica */}
            <div className="py-3">
              <div className="text-[0.58rem] text-cyan-glow/35 tracking-[0.15em] mb-2">// INTEGRIDAD DEL CASCO</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${widthBar}%`,
                      background: widthBar < 30 ? '#ff4444' : widthBar < 70 ? '#ffb347' : '#00ff88',
                      boxShadow: `0 0 8px ${widthBar < 30 ? '#ff4444' : widthBar < 70 ? '#ffb347' : '#00ff88'}`,
                      // Pulso solo en estado crítico
                      animation: widthBar < 30 ? 'critPulse 1s ease-in-out infinite' : 'none',
                    }}
                  />
                </div>
                {/* FIX: porcentaje real desde widthBar, no desde activeMision.orden */}
                <span
                  className="font-display text-[0.75rem]"
                  style={{ color: widthBar < 30 ? '#ff4444' : widthBar < 70 ? '#ffb347' : '#00ff88' }}
                >
                  {widthBar}%
                </span>
              </div>
              {/* FIX: texto de estado dinámico según el progreso real */}
              <span className="text-[0.58rem] tracking-wider" style={{
                color: widthBar < 30 ? 'rgba(255,68,68,0.5)'
                     : widthBar < 70 ? 'rgba(255,179,71,0.5)'
                     : 'rgba(0,255,136,0.5)'
              }}>
                {widthBar === 0   ? 'CRÍTICO — INICIA LA REPARACIÓN'
               : widthBar < 30   ? 'CRÍTICO — REPARACIÓN URGENTE'
               : widthBar < 70   ? 'EN PROGRESO — CONTINÚA REPARANDO'
               : widthBar < 100  ? 'CASI COMPLETO — BUEN TRABAJO'
               :                   'SISTEMA RESTAURADO'}
              </span>
            </div>
          </aside>

          {/* CENTER — Terminal */}
          <main className="flex flex-col overflow-hidden" style={{ background: 'rgba(2,8,19,0.95)' }}>

            {/* Terminal header */}
            <div className="flex items-center gap-4 px-4 py-2.5 flex-shrink-0" style={{ background: 'rgba(3,10,22,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="flex gap-1.5">
                {['rgba(255,68,68,0.6)', 'rgba(255,179,71,0.6)', 'rgba(0,255,136,0.6)'].map((c, i) => (
                  <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="text-[0.65rem] text-cyan-glow/40 tracking-widest flex-1">STELLAR_QUERY — TERMINAL SQL v1.0</span>
              <span className="text-[0.58rem] text-green-glow/50 tracking-wider">SISTEMA: ONLINE</span>
            </div>

            {/* Output log */}
            <div ref={outputRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-0.5 min-h-[160px] max-h-[300px]">
              {lines.map((l, i) => (
                <div key={i} className={`flex gap-3 font-mono text-[0.75rem] leading-relaxed ${lineColors[l.type]}`}>
                  <span className="flex-shrink-0 opacity-40 min-w-[55px]">{linePrefix[l.type]}</span>
                  <span>{l.text}</span>
                </div>
              ))}
              <div className="flex gap-3 font-mono text-[0.75rem] text-green-glow/50">
                <span className="flex-shrink-0 opacity-40 min-w-[55px]">nebula_7&gt;</span>
                <span className="animate-blink">█</span>
              </div>
            </div>

            {/* Query input */}
            <div className="flex-shrink-0 p-4" style={{ background: 'rgba(2,6,14,0.9)', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[0.6rem] text-cyan-glow/40 tracking-[0.12em]">ENTRADA SQL</span>
                <div className="flex gap-1.5">
                  {[['CLR', () => setQuery('')], ['PISTA', () => addLine("Prueba: SELECT * FROM crew_mates WHERE state = 'activo';", 'info')]].map(([label, fn]: any) => (
                    <button key={label} onClick={fn}
                            className="font-mono text-[0.6rem] text-cyan-glow/40 hover:text-cyan-glow
                            px-2 py-0.5 border border-cyan-glow/12 hover:border-cyan-glow/40 bg-transparent cursor-pointer transition-all">
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor con numeración de líneas */}
              <div className="flex mb-3" style={{ border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(2,6,14,0.95)' }}>
                <div ref={lineNumRef} className="py-2.5 px-2 border-r border-cyan-glow/8 select-none min-w-[32px] text-right">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <span key={i} className="block font-mono text-[0.7rem] text-cyan-glow/20 leading-[1.55]">{i + 1}</span>
                  ))}
                </div>
                <textarea
                  ref={editorRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="SELECT * FROM crew_mates WHERE state = 'activo';"
                  rows={6}
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 bg-transparent border-none text-white/80 font-mono text-[0.82rem] leading-[1.55] p-2.5 resize-none outline-none caret-cyan-glow placeholder:text-cyan-glow/15"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* RESET BUTTON — limpia query y resultado pero no el progreso */}
                <button
                  onClick={() => {
                    setQuery('')
                    setResult(null)
                    addLine('[SYS] Misión reiniciada.', 'system')
                  }}
                  className="flex items-center gap-1.5 font-mono text-[0.65rem] text-white/35 hover:text-white/65 border border-white/10 hover:border-white/25 px-3 py-2 bg-transparent cursor-pointer transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 6A4 4 0 1 1 6 2M6 2l2-2M6 2l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  REINICIAR
                </button>
                <div className="flex-1" />
                <button
                  onClick={execute}
                  disabled={loading}
                  className="flex items-center gap-2 font-display font-bold text-[0.7rem] text-cyan-glow border border-cyan-glow/35 px-4 py-2 tracking-widest disabled:opacity-40 cursor-pointer transition-all hover:bg-cyan-glow/8 hover:border-cyan-glow hover:shadow-cyan-glow bg-cyan-glow/8"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                >
                  {loading
                    ? <>
                        <span className="flex gap-1">
                          <span className="loading-dot"/>
                          <span className="loading-dot"/>
                          <span className="loading-dot"/>
                        </span>
                        EJECUTANDO
                      </>
                    : <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <polygon points="2,1 11,6 2,11" fill="currentColor"/>
                        </svg>
                        EJECUTAR QUERY
                      </>
                  }
                  <span className="text-[0.55rem] text-cyan-glow/45 font-mono font-normal">[Ctrl+↵]</span>
                </button>
              </div>
            </div>
          </main>

          {/* RIGHT — Query output */}
          <aside className="flex flex-col gap-0 overflow-y-auto p-5"
            style={{ background: 'rgba(3,10,22,0.9)', borderLeft: '1px solid rgba(0,212,255,0.08)' }}>
            <div className="text-[0.58rem] text-cyan-glow/35 tracking-[0.15em] mb-3">
              // RESULTADO DE LA CONSULTA
            </div>

            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center text-[0.7rem] text-white/25 py-8">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-float opacity-40">
                  <circle cx="24" cy="24" r="20" stroke="rgba(0,212,255,0.2)" strokeWidth="1.5"/>
                  <circle cx="24" cy="24" r="12" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
                  <circle cx="24" cy="24" r="3" fill="rgba(0,212,255,0.3)"/>
                </svg>
                Ejecuta una consulta para ver los resultados
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Feedback — verde si correcto, rojo si no */}
                <div className={`flex items-start gap-2 px-3 py-2 text-[0.72rem] border ${result.success ? 'text-green-glow/80 border-green-glow/25 bg-green-glow/5' : 'text-red-400 border-red-glow/25 bg-red-glow/5'}`}>
                  <span className="flex-shrink-0 text-base">{result.success ? '✓' : '✗'}</span>
                  <span>{result.message || result.feedback}</span>
                </div>
                {/* Tabla de resultados */}
                {result.rows && result.columns && result.rows.length > 0 && (
                  <div className="overflow-x-auto">
                    <div className="text-[0.62rem] text-cyan-glow/40 tracking-wider mb-1.5">{result.rows.length} REGISTRO(S)</div>
                    <table className="w-full border-collapse text-[0.68rem]">
                      <thead>
                        <tr>
                          {result.columns.map(c => (
                            <th key={c} className="text-left px-2 py-1.5 text-cyan-glow/70 tracking-wider border-b border-cyan-glow/15 bg-cyan-glow/7 whitespace-nowrap">
                              {c.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-cyan-glow/4">
                            {result.columns!.map(c => (
                              <td key={c} className="px-2 py-1.5 text-white/65 border-b border-cyan-glow/5 whitespace-nowrap">
                                {String(row[c] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="h-px my-3" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.15), transparent)' }} />

            {/* Score */}
            <div className="flex flex-col gap-3">
              {[
                { label: 'INTENTOS',         value: attempts,                           cls: 'text-white/70' },
                { label: 'PUNTUACIÓN',        value: score,                              cls: 'text-cyan-glow text-glow-cyan' },
                { label: 'MÓDULOS REPARADOS', value: `${repaired} / ${MISIONS_MOCK.length}`, cls: 'text-green-glow text-glow-green' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center text-[0.68rem]">
                  <span className="text-white/35 tracking-wider">{stat.label}</span>
                  <span className={`font-display font-bold text-[0.8rem] ${stat.cls}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </Layout>
  )
}
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'

interface Section { heading: string; content: string; code?: string; result?: string }
interface Guide   { slug: string; title: string; level: string; color: string; subtitle: string; intro: string; sections: Section[] }

const guides: Guide[] = [
  {
    slug:'select', title:'SELECT', level:'BÁSICO', color:'green',
    subtitle:'Recuperar datos de una tabla',
    intro:'SELECT es el comando más fundamental de SQL. Te permite consultar y recuperar datos de una o más tablas. Es la base de todo lo demás.',
    sections:[
      { heading:'Sintaxis básica', content:'La forma más simple recupera todas las columnas con *. También puedes especificar columnas concretas separadas por comas.', code:`-- Seleccionar todas las columnas\nSELECT * FROM tripulantes;\n\n-- Columnas específicas\nSELECT nombre, rango, estado FROM tripulantes;`, result:`nombre          | rango | estado\n----------------|-------|--------\nZara Vega       |   5   | activo\nKaito Mori      |   4   | activo` },
      { heading:'Alias con AS', content:'Puedes renombrar columnas en los resultados usando AS.', code:`SELECT\n  nombre AS tripulante,\n  rango  AS nivel\nFROM tripulantes;` },
      { heading:'DISTINCT — valores únicos', content:'DISTINCT elimina los duplicados del resultado.', code:`SELECT DISTINCT rango FROM tripulantes;` },
      { heading:'LIMIT — limitar resultados', content:'LIMIT restringe el número de filas devueltas. Esencial con tablas grandes.', code:`SELECT * FROM tripulantes LIMIT 5;\n\n-- Paginación\nSELECT * FROM tripulantes LIMIT 5 OFFSET 10;` },
    ]
  },
  {
    slug:'where', title:'WHERE', level:'BÁSICO', color:'green',
    subtitle:'Filtrar resultados con condiciones',
    intro:'WHERE te permite filtrar las filas que devuelve una consulta. Solo se incluyen las filas que cumplen la condición.',
    sections:[
      { heading:'Operadores de comparación', content:'Puedes comparar valores con los operadores clásicos: =, !=, >, <, >=, <=.', code:`SELECT * FROM tripulantes WHERE rango = 5;\nSELECT * FROM tripulantes WHERE rango > 3;\nSELECT * FROM tripulantes WHERE estado != 'activo';` },
      { heading:'AND, OR, NOT', content:'Combina múltiples condiciones.', code:`SELECT * FROM tripulantes\nWHERE estado = 'activo' AND rango > 3;\n\nSELECT * FROM tripulantes WHERE NOT estado = 'activo';` },
      { heading:'BETWEEN', content:'Filtra valores dentro de un rango inclusivo.', code:`SELECT * FROM tripulantes WHERE rango BETWEEN 3 AND 5;` },
      { heading:'IN y LIKE', content:'IN comprueba si un valor está en una lista. LIKE permite búsquedas de patrones: % sustituye cualquier número de caracteres.', code:`SELECT * FROM tripulantes WHERE estado IN ('activo','herido');\nSELECT * FROM tripulantes WHERE nombre LIKE 'Z%';\nSELECT * FROM tripulantes WHERE nombre LIKE '%ara%';` },
    ]
  },
  {
    slug:'order-by', title:'ORDER BY', level:'BÁSICO', color:'green',
    subtitle:'Ordenar los resultados',
    intro:'ORDER BY controla el orden en que se devuelven las filas. Sin ORDER BY el orden no está garantizado.',
    sections:[
      { heading:'Ascendente y descendente', content:'Por defecto ORDER BY ordena de forma ascendente (ASC). Invierte con DESC.', code:`SELECT * FROM tripulantes ORDER BY rango ASC;\nSELECT * FROM tripulantes ORDER BY rango DESC;`, result:`nombre      | rango\n------------|------\nZara Vega   |   5\nKaito Mori  |   4` },
      { heading:'Múltiples columnas', content:'Puedes ordenar por varias columnas. El orden se aplica de izquierda a derecha.', code:`SELECT * FROM tripulantes\nORDER BY estado ASC, rango DESC;` },
    ]
  },
  {
    slug:'group-by', title:'GROUP BY', level:'INTERMEDIO', color:'amber',
    subtitle:'Agrupar y agregar datos',
    intro:'GROUP BY agrupa filas con el mismo valor y permite aplicar funciones de agregación sobre cada grupo.',
    sections:[
      { heading:'Funciones de agregación', content:'COUNT, SUM, AVG, MIN, MAX operan sobre un conjunto de filas y devuelven un único valor por grupo.', code:`SELECT COUNT(*) AS total FROM tripulantes;\nSELECT AVG(rango) AS rango_medio FROM tripulantes;` },
      { heading:'GROUP BY básico', content:'Combina con una función de agregación para obtener el cálculo por grupo.', code:`SELECT estado, COUNT(*) AS total\nFROM tripulantes\nGROUP BY estado;`, result:`estado   | total\n---------|------\nactivo   |   12\nherido   |    3` },
      { heading:'HAVING — filtrar grupos', content:'HAVING es como WHERE pero para grupos. Se aplica después del agrupamiento.', code:`SELECT estado, COUNT(*) AS total\nFROM tripulantes\nGROUP BY estado\nHAVING COUNT(*) > 5;` },
    ]
  },
  {
    slug:'joins', title:'JOINs', level:'INTERMEDIO', color:'amber',
    subtitle:'Combinar datos de múltiples tablas',
    intro:'Los JOINs combinan filas de dos o más tablas en función de una columna relacionada. Son el corazón del modelo relacional.',
    sections:[
      { heading:'INNER JOIN', content:'Devuelve únicamente las filas que tienen correspondencia en ambas tablas.', code:`SELECT t.nombre, n.nombre AS nave\nFROM tripulantes t\nINNER JOIN naves n ON t.nave_id = n.id;`, result:`nombre      | nave\n------------|----------\nZara Vega   | Nebula-7\nKaito Mori  | Nebula-7` },
      { heading:'LEFT JOIN', content:'Devuelve todas las filas de la tabla izquierda. Las columnas de la derecha serán NULL si no hay coincidencia.', code:`SELECT t.nombre, n.nombre AS nave\nFROM tripulantes t\nLEFT JOIN naves n ON t.nave_id = n.id;\n\n-- Sin nave asignada\nSELECT t.nombre FROM tripulantes t\nLEFT JOIN naves n ON t.nave_id = n.id\nWHERE n.id IS NULL;` },
      { heading:'Múltiples JOINs', content:'Puedes encadenar varios JOINs para combinar más de dos tablas.', code:`SELECT t.nombre, n.nombre AS nave, d.nombre AS depto\nFROM tripulantes t\nINNER JOIN naves        n ON t.nave_id = n.id\nINNER JOIN departamentos d ON t.dept_id = d.id;` },
    ]
  },
  {
    slug:'insert', title:'INSERT', level:'BÁSICO', color:'green',
    subtitle:'Insertar nuevos registros',
    intro:'INSERT INTO añade nuevas filas a una tabla.',
    sections:[
      { heading:'INSERT básico', content:'Especifica las columnas y sus valores.', code:`INSERT INTO tripulantes (nombre, rango, estado, incorporado)\nVALUES ('Nova Reyes', 4, 'activo', '2342-06-15');` },
      { heading:'Inserción múltiple', content:'Inserta varias filas en una sola sentencia.', code:`INSERT INTO tripulantes (nombre, rango, estado, incorporado)\nVALUES\n  ('Nova Reyes', 4, 'activo', '2342-06-15'),\n  ('Axel Fermi', 2, 'activo', '2342-07-01');` },
    ]
  },
  {
    slug:'update', title:'UPDATE', level:'BÁSICO', color:'green',
    subtitle:'Modificar registros existentes',
    intro:'UPDATE modifica columnas en filas existentes. ¡Siempre usa WHERE! Sin WHERE actualizarás TODAS las filas.',
    sections:[
      { heading:'UPDATE con WHERE', content:'Actualiza solo las filas que cumplan la condición.', code:`UPDATE tripulantes SET rango = 5 WHERE id = 1;\n\n-- Múltiples columnas\nUPDATE tripulantes\nSET rango = 3, estado = 'herido'\nWHERE nombre = 'Axel Fermi';` },
    ]
  },
  {
    slug:'delete', title:'DELETE', level:'BÁSICO', color:'green',
    subtitle:'Eliminar registros',
    intro:'DELETE elimina filas de una tabla. ¡Siempre usa WHERE! Sin WHERE borrarás todo.',
    sections:[
      { heading:'DELETE con WHERE', content:'Comprueba siempre con SELECT qué filas serán afectadas antes del DELETE.', code:`-- Comprobar primero\nSELECT * FROM tripulantes WHERE estado = 'inactivo';\n\n-- Luego eliminar\nDELETE FROM tripulantes WHERE estado = 'inactivo';` },
      { heading:'TRUNCATE vs DELETE', content:'TRUNCATE vacía la tabla entera de forma rápida. DELETE sin WHERE hace lo mismo pero fila a fila.', code:`DELETE FROM logs;    -- lento, registra cada fila\nTRUNCATE TABLE logs; -- rápido, no registrable fácilmente` },
    ]
  },
  {
    slug:'subqueries', title:'SUBQUERIES', level:'AVANZADO', color:'red',
    subtitle:'Consultas anidadas',
    intro:'Una subquery es un SELECT dentro de otro SELECT. Permiten filtrar y calcular usando el resultado de otra consulta.',
    sections:[
      { heading:'Subquery en WHERE', content:'La subquery devuelve valores que se usan como criterio de filtrado.', code:`-- Tripulantes con rango superior a la media\nSELECT nombre, rango FROM tripulantes\nWHERE rango > (SELECT AVG(rango) FROM tripulantes);` },
      { heading:'EXISTS', content:'Comprueba si la subquery devuelve al menos una fila.', code:`SELECT t.nombre FROM tripulantes t\nWHERE EXISTS (\n  SELECT 1 FROM misiones_asignadas m\n  WHERE m.tripulante_id = t.id\n);` },
      { heading:'CTE con WITH', content:'Las Common Table Expressions son subqueries nombradas que hacen el código más legible.', code:`WITH activos AS (\n  SELECT * FROM tripulantes WHERE estado = 'activo'\n)\nSELECT nombre, rango FROM activos\nORDER BY rango DESC;` },
    ]
  },
]

const colorMap: Record<string, any> = {
  green: { title:'text-green-glow', glow:'rgba(0,255,136,0.4)',  badge:'text-green-glow/70 border-green-glow/25 bg-green-glow/4',  heading:'text-cyan-glow/85' },
  amber: { title:'text-amber-glow', glow:'rgba(255,179,71,0.4)', badge:'text-amber-glow/70 border-amber-glow/25 bg-amber-glow/4', heading:'text-cyan-glow/85' },
  red:   { title:'text-red-glow',   glow:'rgba(255,68,68,0.4)',  badge:'text-red-glow/70 border-red-glow/25 bg-red-glow/4',       heading:'text-cyan-glow/85' },
}

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate  = useNavigate()
  const guide     = guides.find(g => g.slug === slug)

  if (!guide) return (
    <Layout showNav>
      <div className="flex items-center justify-center h-[calc(100vh-108px)]">
        <div className="text-center">
          <p className="text-white/40 mb-4">Guía no encontrada.</p>
          <Link to="/docs" className="text-cyan-glow text-[0.75rem] tracking-widest no-underline hover:text-glow-cyan">← VOLVER A DOCS</Link>
        </div>
      </div>
    </Layout>
  )

  const c    = colorMap[guide.color]
  const idx  = guides.findIndex(g => g.slug === slug)
  const prev = guides[idx - 1]
  const next = guides[idx + 1]

  const copyCode = (code: string) => navigator.clipboard.writeText(code)

  return (
    <Layout showNav>
      <div className="max-w-[1200px] mx-auto px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.62rem] tracking-widest mb-6">
          <Link to="/docs" className="text-cyan-glow/40 hover:text-cyan-glow no-underline transition-colors">DOCS</Link>
          <span className="text-cyan-glow/20">/</span>
          <span className={`font-display font-bold ${c.title}`}>{guide.title}</span>
        </nav>

        <div className="grid gap-8" style={{ gridTemplateColumns: '220px 1fr' }}>

          {/* Sidebar */}
          <aside className="hidden md:block" style={{ position:'sticky', top:'80px', alignSelf:'start' }}>
            <div className="p-4" style={{ background:'rgba(3,10,22,0.85)', border:'1px solid rgba(0,212,255,0.1)' }}>
              <div className="text-[0.58rem] text-cyan-glow/35 tracking-[0.15em] mb-3">// SECCIONES</div>
              <nav className="flex flex-col gap-0.5 mb-4">
                {guide.sections.map((s, i) => (
                  <a key={i} href={`#section-${i}`}
                     className="flex gap-2 items-start text-[0.68rem] text-white/40 hover:text-cyan-glow/80 no-underline py-1.5 px-2 transition-all border-l-2 border-transparent hover:border-cyan-glow/50 hover:bg-cyan-glow/4 leading-snug">
                    <span className="text-cyan-glow/30 flex-shrink-0 text-[0.62rem]">{String(i+1).padStart(2,'0')}</span>
                    {s.heading}
                  </a>
                ))}
              </nav>
              <div className="h-px mb-4" style={{ background:'linear-gradient(90deg,rgba(0,212,255,0.15),transparent)' }} />
              <div className="text-[0.58rem] text-cyan-glow/35 tracking-[0.15em] mb-2">// OTRAS GUÍAS</div>
              <nav className="flex flex-col gap-0.5">
                {guides.filter(g => g.slug !== guide.slug).map(g => {
                  const gc = colorMap[g.color]
                  return (
                    <Link key={g.slug} to={`/docs/${g.slug}`}
                          className="flex justify-between items-center text-[0.68rem] text-white/35 no-underline py-1.5 px-2 border-l-2 border-transparent hover:bg-white/4 transition-all hover:border-white/20">
                      <span className={`font-display font-bold text-[0.65rem] ${gc.title}`}>{g.title}</span>
                      <span className="text-[0.55rem] text-white/30">{g.level}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="flex flex-col gap-8">
            {/* Header */}
            <header>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[0.58rem] tracking-[0.12em] px-2 py-0.5 border ${c.badge}`}>{guide.level}</span>
                <span className="text-[0.58rem] text-cyan-glow/25 tracking-widest">#{guide.slug.toUpperCase()}</span>
              </div>
              <h1 className={`font-display text-[clamp(2rem,5vw,3rem)] font-black tracking-wider m-0 mb-2 ${c.title}`} style={{ textShadow:`0 0 20px ${c.glow}` }}>{guide.title}</h1>
              <p className="text-[0.85rem] text-white/45 tracking-wider m-0 mb-4">{guide.subtitle}</p>
              <div className="p-4 border-l-2 border-cyan-glow/20 bg-cyan-glow/2">
                <p className="text-[0.82rem] text-white/60 leading-relaxed m-0">{guide.intro}</p>
              </div>
            </header>

            {/* Sections */}
            {guide.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} className="animate-fadeUp border-t border-cyan-glow/7 pt-6" style={{ animationDelay:`${i*0.05}s` }}>
                <div className="flex items-start gap-4 mb-3">
                  <span className="font-display text-[2.5rem] font-black text-cyan-glow/4 leading-none select-none flex-shrink-0 mt-[-8px]">{String(i+1).padStart(2,'0')}</span>
                  <h2 className={`font-display text-[1rem] font-bold tracking-wider m-0 mt-1 ${c.heading}`}>{section.heading}</h2>
                </div>
                <p className="text-[0.8rem] text-white/55 leading-relaxed mb-4 ml-16">{section.content}</p>

                {section.code && (
                  <div className="ml-16 border border-cyan-glow/12 overflow-hidden mb-3" style={{ background:'rgba(2,6,14,0.95)' }}>
                    <div className="flex justify-between items-center px-3 py-2 border-b border-cyan-glow/8 bg-cyan-glow/3">
                      <span className="text-[0.6rem] text-cyan-glow/40 tracking-widest">SQL</span>
                      <button onClick={() => copyCode(section.code!)}
                              className="font-mono text-[0.6rem] text-cyan-glow/35 hover:text-cyan-glow border border-cyan-glow/12 hover:border-cyan-glow/40 px-2 py-0.5 bg-transparent cursor-pointer transition-all">
                        COPIAR
                      </button>
                    </div>
                    <pre className="m-0 p-4 overflow-x-auto"><code className="font-mono text-[0.78rem] text-cyan-glow/75 leading-relaxed whitespace-pre">{section.code}</code></pre>
                  </div>
                )}

                {section.result && (
                  <div className="ml-16 border border-green-glow/12 overflow-hidden" style={{ background:'rgba(0,10,5,0.6)' }}>
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-green-glow/8 bg-green-glow/3">
                      <span className="text-green-glow text-[0.7rem]">▶</span>
                      <span className="text-[0.6rem] text-green-glow/50 tracking-widest">RESULTADO ESPERADO</span>
                    </div>
                    <pre className="m-0 p-3 overflow-x-auto"><code className="font-mono text-[0.72rem] text-green-glow/65 leading-relaxed whitespace-pre">{section.result}</code></pre>
                  </div>
                )}
              </section>
            ))}

            {/* Practice CTA */}
            <div className="flex items-center gap-5 p-5 border border-cyan-glow/15 bg-cyan-glow/3">
              <span className="text-[1.75rem] flex-shrink-0">⚡</span>
              <div className="flex-1">
                <div className="font-display text-[0.75rem] font-bold text-cyan-glow tracking-widest mb-1">¿LISTO PARA PRACTICAR?</div>
                <p className="text-[0.72rem] text-white/45 leading-relaxed m-0">
                  Aplica <strong className="text-cyan-glow/80">{guide.title}</strong> en el terminal de la misión. Cada query correcta repara la nave.
                </p>
              </div>
              <Link to="/game" className="flex-shrink-0 flex items-center gap-2 font-display text-[0.68rem] font-bold text-cyan-glow no-underline px-4 py-2.5 border border-cyan-glow/35 bg-cyan-glow/8 hover:bg-cyan-glow/15 hover:border-cyan-glow transition-all tracking-widest whitespace-nowrap"
                    style={{ clipPath:'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                IR A LA MISIÓN →
              </Link>
            </div>

            {/* Prev/Next */}
            <nav className="grid grid-cols-2 gap-4 border-t border-cyan-glow/8 pt-6">
              {prev ? (
                <Link to={`/docs/${prev.slug}`} className="flex flex-col gap-1 p-3 border border-cyan-glow/10 bg-space-800/70 hover:border-cyan-glow/30 hover:bg-cyan-glow/4 no-underline transition-all">
                  <span className="text-[0.58rem] text-cyan-glow/35 tracking-widest">← ANTERIOR</span>
                  <span className={`font-display text-[0.85rem] font-bold ${colorMap[prev.color].title}`}>{prev.title}</span>
                </Link>
              ) : <div />}
              {next ? (
                <Link to={`/docs/${next.slug}`} className="flex flex-col gap-1 p-3 border border-cyan-glow/10 bg-space-800/70 hover:border-cyan-glow/30 hover:bg-cyan-glow/4 no-underline transition-all text-right">
                  <span className="text-[0.58rem] text-cyan-glow/35 tracking-widest">SIGUIENTE →</span>
                  <span className={`font-display text-[0.85rem] font-bold ${colorMap[next.color].title}`}>{next.title}</span>
                </Link>
              ) : <div />}
            </nav>
          </article>
        </div>
      </div>
    </Layout>
  )
}
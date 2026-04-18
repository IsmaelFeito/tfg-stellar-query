import { useEffect, useRef } from 'react'

interface Star {
  x: number; y: number; r: number
  opacity: number; speed: number
  twinkleSpeed: number; twinkleOffset: number
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let stars: Star[] = []
    let animId: number
    let t = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 3000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        opacity: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.03 + 0.005,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016
      for (const s of stars) {
        const twinkle = s.opacity + Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.2
        const alpha = Math.max(0, Math.min(1, twinkle))
        if (s.r > 1) {
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
          grad.addColorStop(0, `rgba(0,212,255,${alpha * 0.4})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = grad; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,230,255,${alpha})`; ctx.fill()
        s.y -= s.speed
        if (s.y + s.r < 0) { s.y = canvas.height + s.r; s.x = Math.random() * canvas.width }
      }
      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden"
         style={{ background: 'radial-gradient(ellipse at 20% 50%, #040d1a 0%, #020813 60%, #010508 100%)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Nebula layers */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 600, height: 400, top: -100, left: -100, background: 'radial-gradient(ellipse, rgba(0,60,120,0.18) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 25s ease-in-out infinite' }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, bottom: 100, right: -50, background: 'radial-gradient(ellipse, rgba(0,100,80,0.12) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 30s ease-in-out infinite reverse' }} />
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)' }} />
    </div>
  )
}
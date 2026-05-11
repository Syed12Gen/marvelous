'use client'

import { useEffect, useRef } from 'react'

interface Props {
  className?: string
}

export default function GlowOrb({ className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    let width = 0
    let height = 0
    const dpr = window.devicePixelRatio || 1
    let raf = 0
    let t = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const N = 1200
    const points: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < N; i++) {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      points.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      })
    }

    const ambient = Array.from({ length: 30 }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      r:  0.5 + Math.random() * 1.2,
    }))

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width  = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width  = width * dpr
      canvas.height = height * dpr
      canvas.style.width  = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2
      const R  = Math.min(width, height) * 0.35

      // halo
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8)
      grad.addColorStop(0,   'rgba(139,92,246,0.35)')
      grad.addColorStop(0.5, 'rgba(59,130,246,0.12)')
      grad.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // ambient particles
      for (const a of ambient) {
        a.x += a.vx
        a.y += a.vy
        if (a.x < 0 || a.x > 1) a.vx *= -1
        if (a.y < 0 || a.y > 1) a.vy *= -1
        ctx.fillStyle = 'rgba(167,139,250,0.5)'
        ctx.beginPath()
        ctx.arc(a.x * width, a.y * height, a.r, 0, Math.PI * 2)
        ctx.fill()
      }

      const cosT = Math.cos(t)
      const sinT = Math.sin(t)
      for (const p of points) {
        const x1    = p.x * cosT - p.z * sinT
        const z1    = p.x * sinT + p.z * cosT
        const y1    = p.y
        const depth = (z1 + 1) / 2
        const px    = cx + x1 * R
        const py    = cy + y1 * R
        const size  = 0.5 + depth * 1.6
        const alpha = 0.15 + depth * 0.75
        const r     = Math.round(139 + (59 - 139) * depth)
        const g     = Math.round(92 + (130 - 92) * depth)
        const b     = 246
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick)
        return
      }
      t += 0.004
      draw()
      raf = requestAnimationFrame(tick)
    }

    resize()
    draw()
    if (!reduced) raf = requestAnimationFrame(tick)

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(parent)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}

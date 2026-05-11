'use client'

import { useEffect, useRef } from 'react'

interface Props {
  className?: string
}

export default function ParticleWave({ className = '' }: Props) {
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

    const lerpColor = (a: number[], b: number[], t: number) =>
      `rgba(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(
        a[1] + (b[1] - a[1]) * t,
      )},${Math.round(a[2] + (b[2] - a[2]) * t)},`

    const violet = [139, 92, 246]
    const blue   = [59, 130, 246]

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const cols  = 64
      const rows  = 28
      const stepX = width / cols
      const stepY = height / rows
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x     = i * stepX
          const baseY = j * stepY
          const k1    = 0.012
          const k2    = 0.025
          const A1    = 18
          const A2    = 8
          const wave  = A1 * Math.sin(x * k1 + t) + A2 * Math.sin(x * k2 + t * 0.7 + j * 0.15)
          const depth = j / rows
          const y     = baseY + wave * (0.6 + depth * 0.7)
          const tx    = i / cols
          const alpha = 0.15 + 0.55 * (1 - Math.abs(0.5 - depth) * 1.6)
          const size  = 0.6 + 1.2 * (1 - depth)
          ctx.fillStyle = lerpColor(violet, blue, tx) + `${alpha.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const tick = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick)
        return
      }
      t += 0.018
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

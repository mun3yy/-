"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  growing: boolean
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationFrameId = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const createParticles = () => {
      particles.current = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000) // Adjust density

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5

        // Color variations - mostly white with hints of purple
        const colorChoice = Math.random()
        let color

        if (colorChoice < 0.7) {
          // 70% white/blue-ish particles
          color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
        } else if (colorChoice < 0.9) {
          // 20% light purple particles
          color = `rgba(${180 + Math.random() * 75}, ${150 + Math.random() * 50}, ${220 + Math.random() * 35}, ${Math.random() * 0.5 + 0.5})`
        } else {
          // 10% more vibrant purple particles
          color = `rgba(${130 + Math.random() * 50}, ${80 + Math.random() * 40}, ${200 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
        }

        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          color,
          alpha: Math.random() * 0.5 + 0.5,
          growing: Math.random() > 0.5,
        })
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width,
      )
      gradient.addColorStop(0, "rgba(20, 10, 30, 1)")
      gradient.addColorStop(0.5, "rgba(15, 5, 25, 1)")
      gradient.addColorStop(1, "rgba(10, 5, 20, 1)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Pulsate size
        if (particle.growing) {
          particle.size += 0.01
          if (particle.size > 2.5) particle.growing = false
        } else {
          particle.size -= 0.01
          if (particle.size < 0.5) particle.growing = true
        }

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 15
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw some larger glowing stars
      for (let i = 0; i < 20; i++) {
        const x = Math.sin(Date.now() * 0.001 + i) * 100 + canvas.width / 2
        const y = Math.cos(Date.now() * 0.001 + i) * 100 + canvas.height / 2
        const size = Math.sin(Date.now() * 0.002 + i) * 1 + 2

        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.shadowBlur = 20
        ctx.shadowColor = "rgba(180, 160, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 bg-zinc-950" style={{ pointerEvents: "none" }} />
  )
}

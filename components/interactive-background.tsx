"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  targetX: number
  targetY: number
}

interface InteractiveBackgroundProps {
  intensity?: "low" | "medium" | "high"
}

export default function InteractiveBackground({ intensity = "medium" }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>(0)
  const particles = useRef<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)

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

    // Particle settings based on intensity
    let particleCount = 0
    switch (intensity) {
      case "low":
        particleCount = 30
        break
      case "medium":
        particleCount = 60
        break
      case "high":
        particleCount = 100
        break
      default:
        particleCount = 60
    }

    // Create particles
    const createParticles = () => {
      particles.current = []
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1

        // Purple color variations
        const r = 100 + Math.floor(Math.random() * 70)
        const g = 50 + Math.floor(Math.random() * 50)
        const b = 180 + Math.floor(Math.random() * 75)
        const a = Math.random() * 0.5 + 0.2

        const color = `rgba(${r}, ${g}, ${b}, ${a})`

        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color,
          alpha: Math.random() * 0.5 + 0.2,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
        })
      }
    }

    createParticles()

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsMouseInCanvas(true)
    }

    const handleMouseLeave = () => {
      setIsMouseInCanvas(false)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient with purple hints
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width,
      )
      gradient.addColorStop(0, "rgba(20, 10, 30, 0.8)")
      gradient.addColorStop(0.5, "rgba(15, 5, 25, 0.8)")
      gradient.addColorStop(1, "rgba(10, 5, 20, 0.8)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.current.forEach((particle) => {
        // If mouse is in canvas, some particles should be attracted to it
        if (isMouseInCanvas && Math.random() < 0.05) {
          particle.targetX = mousePosition.x
          particle.targetY = mousePosition.y
        } else if (Math.random() < 0.01) {
          // Occasionally give particles new random targets
          particle.targetX = Math.random() * canvas.width
          particle.targetY = Math.random() * canvas.height
        }

        // Move towards target with slight attraction
        const dx = particle.targetX - particle.x
        const dy = particle.targetY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 1) {
          particle.speedX = (dx / distance) * 0.2
          particle.speedY = (dy / distance) * 0.2
        }

        // Add some randomness to movement
        particle.speedX += (Math.random() - 0.5) * 0.1
        particle.speedY += (Math.random() - 0.5) * 0.1

        // Apply friction
        particle.speedX *= 0.98
        particle.speedY *= 0.98

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw mouse cursor effect when mouse is in canvas
      if (isMouseInCanvas) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(mousePosition.x, mousePosition.y, 30, 0, Math.PI * 2)
        const cursorGradient = ctx.createRadialGradient(
          mousePosition.x,
          mousePosition.y,
          0,
          mousePosition.x,
          mousePosition.y,
          30,
        )
        cursorGradient.addColorStop(0, "rgba(180, 100, 255, 0.3)")
        cursorGradient.addColorStop(1, "rgba(180, 100, 255, 0)")
        ctx.fillStyle = cursorGradient
        ctx.fill()
        ctx.restore()
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: "none", opacity: 0.7 }}
    />
  )
}

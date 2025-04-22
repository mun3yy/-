"use client"

import { useEffect, useRef } from "react"

interface MainBackgroundProps {
  intensity?: "low" | "medium" | "high"
  color?: "purple" | "blue" | "green" | "mixed"
}

export default function MainBackground({ intensity = "medium", color = "mixed" }: MainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.5

      // Color based on preference
      let particleColor
      switch (color) {
        case "purple":
          particleColor = `rgba(${130 + Math.random() * 50}, ${80 + Math.random() * 40}, ${200 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
          break
        case "blue":
          particleColor = `rgba(${80 + Math.random() * 40}, ${130 + Math.random() * 50}, ${200 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
          break
        case "green":
          particleColor = `rgba(${80 + Math.random() * 40}, ${180 + Math.random() * 50}, ${100 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
          break
        case "mixed":
          // Mix of purple and other colors
          const colorChoice = Math.random()
          if (colorChoice < 0.6) {
            particleColor = `rgba(${130 + Math.random() * 50}, ${80 + Math.random() * 40}, ${200 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
          } else if (colorChoice < 0.8) {
            particleColor = `rgba(${80 + Math.random() * 40}, ${130 + Math.random() * 50}, ${200 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
          } else {
            particleColor = `rgba(${80 + Math.random() * 40}, ${180 + Math.random() * 50}, ${100 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
          }
          break
        default:
          particleColor = `rgba(${130 + Math.random() * 50}, ${80 + Math.random() * 40}, ${200 + Math.random() * 55}, ${Math.random() * 0.7 + 0.3})`
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: particleColor,
        alpha: Math.random() * 0.5 + 0.2,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
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

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [intensity, color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: "none", opacity: 0.4 }}
    />
  )
}

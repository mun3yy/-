"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Game state refs to avoid dependency issues in useEffect
  const birdRef = useRef({
    x: 50,
    y: 150,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -8,
    size: 20,
  })
  const pipesRef = useRef<Array<{ x: number; topHeight: number; passed: boolean }>>([])
  const gameOverRef = useRef(false)
  const gameStartedRef = useRef(false)
  const scoreRef = useRef(0)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 320
    canvas.height = 480

    // Initialize game
    const resetGame = () => {
      birdRef.current = {
        x: 50,
        y: 150,
        velocity: 0,
        gravity: 0.5,
        jumpStrength: -8,
        size: 20,
      }
      pipesRef.current = []
      gameOverRef.current = false
      scoreRef.current = 0
      setScore(0)
      setGameOver(false)
    }

    const startGame = () => {
      resetGame()
      gameStartedRef.current = true
      setGameStarted(true)
      gameLoop()
    }

    // Handle keyboard and touch input
    const handleJump = () => {
      if (gameOverRef.current) return

      if (!gameStartedRef.current) {
        startGame()
        return
      }

      birdRef.current.velocity = birdRef.current.jumpStrength
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault()
        handleJump()
      }
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      handleJump()
    }

    const handleClick = () => {
      handleJump()
    }

    window.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("touchstart", handleTouch)
    canvas.addEventListener("click", handleClick)

    // Game loop
    const gameLoop = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.fillStyle = "#70c5ce"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ground
      ctx.fillStyle = "#ded895"
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30)

      // Update bird
      birdRef.current.velocity += birdRef.current.gravity
      birdRef.current.y += birdRef.current.velocity

      // Draw bird
      ctx.fillStyle = "#f7dc6f"
      ctx.beginPath()
      ctx.arc(birdRef.current.x, birdRef.current.y, birdRef.current.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add eye
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(birdRef.current.x + 8, birdRef.current.y - 5, 3, 0, Math.PI * 2)
      ctx.fill()

      // Add beak
      ctx.fillStyle = "#e67e22"
      ctx.beginPath()
      ctx.moveTo(birdRef.current.x + 15, birdRef.current.y)
      ctx.lineTo(birdRef.current.x + 25, birdRef.current.y - 5)
      ctx.lineTo(birdRef.current.x + 25, birdRef.current.y + 5)
      ctx.closePath()
      ctx.fill()

      // Generate pipes
      if (gameStartedRef.current && !gameOverRef.current) {
        if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < canvas.width - 200) {
          const gap = 150
          const minHeight = 50
          const maxHeight = canvas.height - gap - minHeight - 30 // 30 is ground height
          const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight
          pipesRef.current.push({ x: canvas.width, topHeight, passed: false })
        }
      }

      // Update and draw pipes
      for (let i = 0; i < pipesRef.current.length; i++) {
        const pipe = pipesRef.current[i]

        if (gameStartedRef.current && !gameOverRef.current) {
          pipe.x -= 2
        }

        // Draw top pipe
        ctx.fillStyle = "#2ecc71"
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight)
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.strokeRect(pipe.x, 0, 50, pipe.topHeight)

        // Draw bottom pipe
        const gap = 150
        const bottomPipeY = pipe.topHeight + gap
        ctx.fillRect(pipe.x, bottomPipeY, 50, canvas.height - bottomPipeY - 30)
        ctx.strokeRect(pipe.x, bottomPipeY, 50, canvas.height - bottomPipeY - 30)

        // Check collision
        if (
          birdRef.current.x + birdRef.current.size > pipe.x &&
          birdRef.current.x - birdRef.current.size < pipe.x + 50 &&
          (birdRef.current.y - birdRef.current.size < pipe.topHeight ||
            birdRef.current.y + birdRef.current.size > bottomPipeY)
        ) {
          gameOverRef.current = true
          setGameOver(true)
        }

        // Check if pipe is passed
        if (!pipe.passed && pipe.x + 50 < birdRef.current.x - birdRef.current.size) {
          pipe.passed = true
          scoreRef.current += 1
          setScore(scoreRef.current)
          setHighScore((prev) => Math.max(prev, scoreRef.current))
        }
      }

      // Remove off-screen pipes
      pipesRef.current = pipesRef.current.filter((pipe) => pipe.x > -50)

      // Check if bird hits ground or ceiling
      if (
        birdRef.current.y + birdRef.current.size > canvas.height - 30 ||
        birdRef.current.y - birdRef.current.size < 0
      ) {
        gameOverRef.current = true
        setGameOver(true)
        birdRef.current.y = Math.min(
          Math.max(birdRef.current.y, birdRef.current.size),
          canvas.height - 30 - birdRef.current.size,
        )
      }

      // Draw score
      ctx.fillStyle = "#fff"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, 50)

      // Draw instructions if game not started
      if (!gameStartedRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Tap or Press Space", canvas.width / 2, canvas.height / 2 - 20)
        ctx.fillText("to Start", canvas.width / 2, canvas.height / 2 + 20)
      }

      // Draw game over screen
      if (gameOverRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50)
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2)
        ctx.fillText(`High Score: ${Math.max(highScore, scoreRef.current)}`, canvas.width / 2, canvas.height / 2 + 40)
      }

      // Continue game loop if not game over
      if (!gameOverRef.current || !gameStartedRef.current) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
      }
    }

    // Start initial render
    gameLoop()

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("touchstart", handleTouch)
      canvas.removeEventListener("click", handleClick)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [highScore])

  const handleRestart = () => {
    gameOverRef.current = false
    gameStartedRef.current = true
    scoreRef.current = 0
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
    birdRef.current = {
      x: 50,
      y: 150,
      velocity: 0,
      gravity: 0.5,
      jumpStrength: -8,
      size: 20,
    }
    pipesRef.current = []
    animationFrameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const gameLoop = () => {
        // Game loop implementation
      }
      gameLoop()
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Flappy Bird</h1>

      <div className="relative mb-4">
        <canvas ref={canvasRef} className="border-2 border-zinc-700 rounded-lg bg-sky-400" width={320} height={480} />

        {gameOver && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button onClick={handleRestart} className="bg-purple-600 hover:bg-purple-700">
              Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-zinc-400 text-center">Tap the screen or press Space/Up Arrow to jump</div>
    </div>
  )
}

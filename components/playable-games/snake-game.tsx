"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Game state refs to avoid dependency issues in useEffect
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }])
  const foodRef = useRef<Position>({ x: 5, y: 5 })
  const directionRef = useRef<Direction>("RIGHT")
  const speedRef = useRef(100)
  const gameOverRef = useRef(false)
  const pausedRef = useRef(false)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 300
    canvas.height = 300

    // Generate initial food
    placeFood()

    // Game loop
    let lastTime = 0
    const gameLoop = (timestamp: number) => {
      if (!pausedRef.current) {
        const deltaTime = timestamp - lastTime

        if (deltaTime >= speedRef.current) {
          lastTime = timestamp
          update()
          draw()
        }
      }

      if (!gameOverRef.current) {
        requestAnimationFrame(gameLoop)
      }
    }

    // Start game loop
    requestAnimationFrame(gameLoop)

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "DOWN") directionRef.current = "UP"
          break
        case "ArrowDown":
          if (directionRef.current !== "UP") directionRef.current = "DOWN"
          break
        case "ArrowLeft":
          if (directionRef.current !== "RIGHT") directionRef.current = "LEFT"
          break
        case "ArrowRight":
          if (directionRef.current !== "LEFT") directionRef.current = "RIGHT"
          break
        case " ":
          togglePause()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Game functions
    function update() {
      if (gameOverRef.current) return

      const head = { ...snakeRef.current[0] }

      // Move head based on direction
      switch (directionRef.current) {
        case "UP":
          head.y -= 1
          break
        case "DOWN":
          head.y += 1
          break
        case "LEFT":
          head.x -= 1
          break
        case "RIGHT":
          head.x += 1
          break
      }

      // Check for collisions
      if (
        head.x < 0 ||
        head.x >= 30 ||
        head.y < 0 ||
        head.y >= 30 ||
        snakeRef.current.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        gameOverRef.current = true
        setGameOver(true)
        return
      }

      // Check if snake ate food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        placeFood()
        setScore((prev) => prev + 1)
        // Speed up slightly
        speedRef.current = Math.max(50, speedRef.current - 2)
      } else {
        // Remove tail if no food was eaten
        snakeRef.current.pop()
      }

      // Add new head
      snakeRef.current.unshift(head)
    }

    function draw() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.fillStyle = "#1f1f1f"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw snake
      snakeRef.current.forEach((segment, index) => {
        // Head is purple, body is gradient from purple to lighter purple
        const colorValue = Math.min(255, 130 + index * 5)
        ctx.fillStyle =
          index === 0
            ? "#9333ea" // Purple for head
            : `rgb(${colorValue}, ${Math.max(80, colorValue - 100)}, ${Math.min(255, colorValue + 50)})`

        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10)

        // Add a border to each segment
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.strokeRect(segment.x * 10, segment.y * 10, 10, 10)
      })

      // Draw food
      ctx.fillStyle = "#10b981" // Emerald color
      ctx.beginPath()
      ctx.arc(foodRef.current.x * 10 + 5, foodRef.current.y * 10 + 5, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    function placeFood() {
      // Generate random position for food
      const x = Math.floor(Math.random() * 30)
      const y = Math.floor(Math.random() * 30)

      // Make sure food doesn't spawn on snake
      if (snakeRef.current.some((segment) => segment.x === x && segment.y === y)) {
        placeFood()
      } else {
        foodRef.current = { x, y }
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }]
    directionRef.current = "RIGHT"
    speedRef.current = 100
    gameOverRef.current = false
    pausedRef.current = false
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    placeFood()
  }

  const togglePause = () => {
    pausedRef.current = !pausedRef.current
    setIsPaused(!isPaused)
  }

  function placeFood() {
    // Generate random position for food
    const x = Math.floor(Math.random() * 30)
    const y = Math.floor(Math.random() * 30)

    // Make sure food doesn't spawn on snake
    if (snakeRef.current.some((segment) => segment.x === x && segment.y === y)) {
      placeFood()
    } else {
      foodRef.current = { x, y }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-2">Snake Game</h1>
      <div className="mb-2">Score: {score}</div>

      <div className="relative mb-4">
        <canvas ref={canvasRef} className="border-2 border-zinc-700 rounded-lg" width={300} height={300} />

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-xl font-bold mb-2">Game Over!</div>
            <div className="mb-4">Final Score: {score}</div>
            <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
              Play Again
            </Button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-xl font-bold">Paused</div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={togglePause} disabled={gameOver} className="bg-zinc-700 hover:bg-zinc-600">
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
          Reset
        </Button>
      </div>

      <div className="mt-4 text-sm text-zinc-400 text-center">
        Use arrow keys to control the snake.
        <br />
        Press space to pause/resume.
      </div>
    </div>
  )
}

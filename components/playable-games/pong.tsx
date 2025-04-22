"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState({ player: 0, ai: 0 })
  const [winner, setWinner] = useState<string | null>(null)

  // Game state refs
  const ballRef = useRef({ x: 400, y: 200, dx: 5, dy: 5, radius: 10 })
  const paddlesRef = useRef({
    player: { x: 10, y: 175, width: 10, height: 50, dy: 0 },
    ai: { x: 780, y: 175, width: 10, height: 50, dy: 0 },
  })
  const keysRef = useRef({ ArrowUp: false, ArrowDown: false })
  const scoreRef = useRef({ player: 0, ai: 0 })
  const gameOverRef = useRef(false)
  const gameStartedRef = useRef(false)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 400

    // Initialize game
    const resetBall = () => {
      ballRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: Math.random() > 0.5 ? 5 : -5,
        dy: Math.random() * 6 - 3,
        radius: 10,
      }
    }

    const resetGame = () => {
      resetBall()
      paddlesRef.current = {
        player: { x: 10, y: canvas.height / 2 - 25, width: 10, height: 50, dy: 0 },
        ai: { x: canvas.width - 20, y: canvas.height / 2 - 25, width: 10, height: 50, dy: 0 },
      }
      scoreRef.current = { player: 0, ai: 0 }
      setScore({ player: 0, ai: 0 })
      gameOverRef.current = false
      setGameOver(false)
      setWinner(null)
    }

    const startGame = () => {
      resetGame()
      gameStartedRef.current = true
      setGameStarted(true)
      gameLoop()
    }

    // Draw the game
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw middle line
      ctx.strokeStyle = "#fff"
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw ball
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw paddles
      ctx.fillStyle = "#fff"
      ctx.fillRect(
        paddlesRef.current.player.x,
        paddlesRef.current.player.y,
        paddlesRef.current.player.width,
        paddlesRef.current.player.height,
      )
      ctx.fillRect(
        paddlesRef.current.ai.x,
        paddlesRef.current.ai.y,
        paddlesRef.current.ai.width,
        paddlesRef.current.ai.height,
      )

      // Draw score
      ctx.font = "32px Arial"
      ctx.fillText(scoreRef.current.player.toString(), canvas.width / 4, 50)
      ctx.fillText(scoreRef.current.ai.toString(), (3 * canvas.width) / 4, 50)
    }

    // Update game state
    const update = () => {
      // Move player paddle
      if (keysRef.current.ArrowUp) {
        paddlesRef.current.player.y = Math.max(0, paddlesRef.current.player.y - 7)
      }
      if (keysRef.current.ArrowDown) {
        paddlesRef.current.player.y = Math.min(
          canvas.height - paddlesRef.current.player.height,
          paddlesRef.current.player.y + 7,
        )
      }

      // Move AI paddle (with some delay to make it beatable)
      const aiSpeed = 5
      const aiTarget = ballRef.current.y - paddlesRef.current.ai.height / 2

      // Add some "thinking" delay and imperfection
      if (ballRef.current.dx > 0) {
        // Only move when ball is coming towards AI
        if (paddlesRef.current.ai.y < aiTarget - 10) {
          paddlesRef.current.ai.y += aiSpeed
        } else if (paddlesRef.current.ai.y > aiTarget + 10) {
          paddlesRef.current.ai.y -= aiSpeed
        }
      }

      // Keep AI paddle within bounds
      paddlesRef.current.ai.y = Math.max(
        0,
        Math.min(canvas.height - paddlesRef.current.ai.height, paddlesRef.current.ai.y),
      )

      // Move ball
      ballRef.current.x += ballRef.current.dx
      ballRef.current.y += ballRef.current.dy

      // Ball collision with top and bottom walls
      if (
        ballRef.current.y - ballRef.current.radius < 0 ||
        ballRef.current.y + ballRef.current.radius > canvas.height
      ) {
        ballRef.current.dy = -ballRef.current.dy
      }

      // Ball collision with paddles
      // Player paddle
      if (
        ballRef.current.x - ballRef.current.radius < paddlesRef.current.player.x + paddlesRef.current.player.width &&
        ballRef.current.y > paddlesRef.current.player.y &&
        ballRef.current.y < paddlesRef.current.player.y + paddlesRef.current.player.height &&
        ballRef.current.dx < 0
      ) {
        // Calculate angle based on where ball hits paddle
        const hitPosition = (ballRef.current.y - paddlesRef.current.player.y) / paddlesRef.current.player.height
        const angle = hitPosition * Math.PI - Math.PI / 2

        ballRef.current.dx = Math.cos(angle) * 7
        ballRef.current.dy = Math.sin(angle) * 7
      }

      // AI paddle
      if (
        ballRef.current.x + ballRef.current.radius > paddlesRef.current.ai.x &&
        ballRef.current.y > paddlesRef.current.ai.y &&
        ballRef.current.y < paddlesRef.current.ai.y + paddlesRef.current.ai.height &&
        ballRef.current.dx > 0
      ) {
        // Calculate angle based on where ball hits paddle
        const hitPosition = (ballRef.current.y - paddlesRef.current.ai.y) / paddlesRef.current.ai.height
        const angle = hitPosition * Math.PI + Math.PI / 2

        ballRef.current.dx = Math.cos(angle) * 7
        ballRef.current.dy = Math.sin(angle) * 7
      }

      // Ball out of bounds - scoring
      if (ballRef.current.x < 0) {
        // AI scores
        scoreRef.current.ai += 1
        setScore({ ...scoreRef.current })
        resetBall()

        // Check for game over
        if (scoreRef.current.ai >= 5) {
          gameOverRef.current = true
          setGameOver(true)
          setWinner("AI")
        }
      } else if (ballRef.current.x > canvas.width) {
        // Player scores
        scoreRef.current.player += 1
        setScore({ ...scoreRef.current })
        resetBall()

        // Check for game over
        if (scoreRef.current.player >= 5) {
          gameOverRef.current = true
          setGameOver(true)
          setWinner("Player")
        }
      }
    }

    // Game loop
    const gameLoop = () => {
      if (!gameStartedRef.current) {
        // Draw start screen
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "32px Arial"
        ctx.textAlign = "center"
        ctx.fillText("PONG", canvas.width / 2, canvas.height / 2 - 50)
        ctx.font = "16px Arial"
        ctx.fillText("Press ENTER or click to start", canvas.width / 2, canvas.height / 2)
        ctx.fillText("Use arrow keys to move paddle", canvas.width / 2, canvas.height / 2 + 30)
        ctx.fillText("First to 5 points wins", canvas.width / 2, canvas.height / 2 + 60)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (gameOverRef.current) {
        // Draw game over screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "32px Arial"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30)
        ctx.font = "24px Arial"
        ctx.fillText(`${winner} wins!`, canvas.width / 2, canvas.height / 2 + 10)
        ctx.font = "16px Arial"
        ctx.fillText("Press ENTER or click to play again", canvas.width / 2, canvas.height / 2 + 50)

        return
      }

      update()
      draw()

      // Continue the game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysRef.current[e.key] = true
      }

      if (e.key === "Enter") {
        if (!gameStartedRef.current) {
          startGame()
        } else if (gameOverRef.current) {
          resetGame()
          gameOverRef.current = false
          setGameOver(false)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysRef.current[e.key] = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Handle canvas click
    const handleCanvasClick = () => {
      if (!gameStartedRef.current) {
        startGame()
      } else if (gameOverRef.current) {
        resetGame()
        gameOverRef.current = false
        setGameOver(false)
      }
    }

    canvas.addEventListener("click", handleCanvasClick)

    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("click", handleCanvasClick)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const handleStartGame = () => {
    if (!gameStartedRef.current) {
      gameStartedRef.current = true
      setGameStarted(true)
      resetGame()
    } else if (gameOverRef.current) {
      resetGame()
    }
  }

  const resetGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: Math.random() > 0.5 ? 5 : -5,
      dy: Math.random() * 6 - 3,
      radius: 10,
    }

    paddlesRef.current = {
      player: { x: 10, y: canvas.height / 2 - 25, width: 10, height: 50, dy: 0 },
      ai: { x: canvas.width - 20, y: canvas.height / 2 - 25, width: 10, height: 50, dy: 0 },
    }

    scoreRef.current = { player: 0, ai: 0 }
    setScore({ player: 0, ai: 0 })
    gameOverRef.current = false
    setGameOver(false)
    setWinner(null)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Pong</h1>

      <div className="relative mb-4">
        <canvas ref={canvasRef} className="border-2 border-zinc-700 rounded-lg bg-black" width={800} height={400} />

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button onClick={handleStartGame} className="bg-purple-600 hover:bg-purple-700">
              Start Game
            </Button>
            <div className="text-center text-white px-4 mt-4">
              <p className="mb-2">Use arrow keys to move paddle</p>
              <p>First to 5 points wins</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-center text-white mb-4">
              <h2 className="text-xl font-bold mb-2">Game Over</h2>
              <p className="mb-1">{winner} wins!</p>
              <p>
                Score: {score.player} - {score.ai}
              </p>
            </div>
            <Button onClick={handleStartGame} className="bg-purple-600 hover:bg-purple-700">
              Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-zinc-400 text-center">
        <p>Use Up and Down arrow keys to move your paddle</p>
      </div>
    </div>
  )
}

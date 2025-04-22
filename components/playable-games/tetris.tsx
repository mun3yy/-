"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

// Tetromino shapes
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  // L
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  // O
  [
    [4, 4],
    [4, 4],
  ],
  // S
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  // T
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  // Z
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
]

// Colors for each tetromino
const COLORS = [
  "transparent",
  "#00f0f0", // I - Cyan
  "#0000f0", // J - Blue
  "#f0a000", // L - Orange
  "#f0f000", // O - Yellow
  "#00f000", // S - Green
  "#a000f0", // T - Purple
  "#f00000", // Z - Red
]

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Game state refs
  const boardRef = useRef<number[][]>(
    Array(20)
      .fill(null)
      .map(() => Array(10).fill(0)),
  )
  const currentPieceRef = useRef<{ shape: number[][]; x: number; y: number; color: number }>({
    shape: SHAPES[0],
    x: 3,
    y: 0,
    color: 1,
  })
  const nextPieceRef = useRef<{ shape: number[][]; color: number }>({
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: Math.floor(Math.random() * SHAPES.length) + 1,
  })
  const scoreRef = useRef(0)
  const levelRef = useRef(1)
  const gameOverRef = useRef(false)
  const pausedRef = useRef(false)
  const gameStartedRef = useRef(false)
  const lastMoveTimeRef = useRef(0)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 300
    canvas.height = 600

    // Cell size
    const cellSize = canvas.width / 10

    // Initialize game
    const resetGame = () => {
      boardRef.current = Array(20)
        .fill(null)
        .map(() => Array(10).fill(0))
      scoreRef.current = 0
      levelRef.current = 1
      gameOverRef.current = false
      pausedRef.current = false
      setScore(0)
      setLevel(1)
      setGameOver(false)
      setIsPaused(false)

      // Generate random first piece
      const randomIndex = Math.floor(Math.random() * SHAPES.length)
      currentPieceRef.current = {
        shape: SHAPES[randomIndex],
        x: 3,
        y: 0,
        color: randomIndex + 1,
      }

      // Generate random next piece
      const nextRandomIndex = Math.floor(Math.random() * SHAPES.length)
      nextPieceRef.current = {
        shape: SHAPES[nextRandomIndex],
        color: nextRandomIndex + 1,
      }
    }

    const startGame = () => {
      resetGame()
      gameStartedRef.current = true
      setGameStarted(true)
      gameLoop(0)
    }

    // Draw the board
    const drawBoard = () => {
      // Clear canvas
      ctx.fillStyle = "#111"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 1

      // Draw vertical lines
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath()
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, canvas.height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let i = 0; i <= 20; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(canvas.width, i * cellSize)
        ctx.stroke()
      }

      // Draw board cells
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          if (boardRef.current[y][x] !== 0) {
            ctx.fillStyle = COLORS[boardRef.current[y][x]]
            ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)
          }
        }
      }

      // Draw current piece
      const piece = currentPieceRef.current
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] !== 0) {
            ctx.fillStyle = COLORS[piece.color]
            ctx.fillRect((piece.x + x) * cellSize + 1, (piece.y + y) * cellSize + 1, cellSize - 2, cellSize - 2)
          }
        }
      }

      // Draw score and level
      ctx.fillStyle = "#fff"
      ctx.font = "16px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 25)
      ctx.fillText(`Level: ${levelRef.current}`, 10, 50)
    }

    // Check if a move is valid
    const isValidMove = (shape: number[][], x: number, y: number) => {
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] !== 0) {
            const boardX = x + col
            const boardY = y + row

            // Check if out of bounds
            if (boardX < 0 || boardX >= 10 || boardY >= 20) {
              return false
            }

            // Check if overlapping with existing pieces
            if (boardY >= 0 && boardRef.current[boardY][boardX] !== 0) {
              return false
            }
          }
        }
      }
      return true
    }

    // Rotate the current piece
    const rotatePiece = () => {
      const piece = currentPieceRef.current
      const shape = piece.shape
      const newShape = Array(shape[0].length)
        .fill(null)
        .map(() => Array(shape.length).fill(0))

      // Transpose and reverse rows to rotate 90 degrees clockwise
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          newShape[x][shape.length - 1 - y] = shape[y][x]
        }
      }

      // Check if rotation is valid
      if (isValidMove(newShape, piece.x, piece.y)) {
        piece.shape = newShape
      }
    }

    // Move the current piece
    const movePiece = (dx: number, dy: number) => {
      const piece = currentPieceRef.current
      if (isValidMove(piece.shape, piece.x + dx, piece.y + dy)) {
        piece.x += dx
        piece.y += dy
        return true
      }
      return false
    }

    // Lock the current piece in place and generate a new one
    const lockPiece = () => {
      const piece = currentPieceRef.current

      // Add the piece to the board
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] !== 0) {
            const boardY = piece.y + y
            const boardX = piece.x + x

            // If piece is locked above the board, game over
            if (boardY < 0) {
              gameOverRef.current = true
              setGameOver(true)
              return
            }

            boardRef.current[boardY][boardX] = piece.color
          }
        }
      }

      // Check for completed lines
      let linesCleared = 0
      for (let y = 0; y < 20; y++) {
        if (boardRef.current[y].every((cell) => cell !== 0)) {
          // Remove the line
          boardRef.current.splice(y, 1)
          // Add a new empty line at the top
          boardRef.current.unshift(Array(10).fill(0))
          linesCleared++
        }
      }

      // Update score
      if (linesCleared > 0) {
        const points = [0, 40, 100, 300, 1200][linesCleared] * levelRef.current
        scoreRef.current += points
        setScore(scoreRef.current)

        // Update level every 10 lines
        const newLevel = Math.floor(scoreRef.current / 1000) + 1
        if (newLevel > levelRef.current) {
          levelRef.current = newLevel
          setLevel(newLevel)
        }
      }

      // Set the next piece as current
      currentPieceRef.current = {
        shape: nextPieceRef.current.shape,
        x: 3,
        y: 0,
        color: nextPieceRef.current.color,
      }

      // Generate a new next piece
      const randomIndex = Math.floor(Math.random() * SHAPES.length)
      nextPieceRef.current = {
        shape: SHAPES[randomIndex],
        color: randomIndex + 1,
      }
    }

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOverRef.current || !gameStartedRef.current) return

      if (pausedRef.current) {
        if (e.key === "p" || e.key === "P") {
          pausedRef.current = false
          setIsPaused(false)
        }
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1, 0)
          break
        case "ArrowRight":
          movePiece(1, 0)
          break
        case "ArrowDown":
          if (!movePiece(0, 1)) {
            lockPiece()
          }
          break
        case "ArrowUp":
          rotatePiece()
          break
        case "p":
        case "P":
          pausedRef.current = true
          setIsPaused(true)
          break
      }
    }

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (!gameStartedRef.current) {
        // Draw start screen
        ctx.fillStyle = "#111"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("TETRIS", canvas.width / 2, canvas.height / 2 - 50)
        ctx.font = "16px Arial"
        ctx.fillText("Press ENTER to start", canvas.width / 2, canvas.height / 2)
        ctx.fillText("Arrow keys to move", canvas.width / 2, canvas.height / 2 + 30)
        ctx.fillText("Up arrow to rotate", canvas.width / 2, canvas.height / 2 + 60)
        ctx.fillText("P to pause", canvas.width / 2, canvas.height / 2 + 90)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (gameOverRef.current) {
        // Draw game over screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30)
        ctx.font = "16px Arial"
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 10)
        ctx.fillText(`Level: ${levelRef.current}`, canvas.width / 2, canvas.height / 2 + 40)

        return
      }

      if (pausedRef.current) {
        // Draw pause screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
        ctx.font = "16px Arial"
        ctx.fillText("Press P to continue", canvas.width / 2, canvas.height / 2 + 30)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Move piece down at regular intervals
      const dropInterval = Math.max(100, 800 - (levelRef.current - 1) * 50) // Speed increases with level
      if (timestamp - lastMoveTimeRef.current > dropInterval) {
        if (!movePiece(0, 1)) {
          lockPiece()
        }
        lastMoveTimeRef.current = timestamp
      }

      // Draw the game
      drawBoard()

      // Continue the game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Handle keyboard events
    window.addEventListener("keydown", handleKeyDown)

    // Handle start game with Enter key
    const handleStartGame = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !gameStartedRef.current) {
        startGame()
      }
    }

    window.addEventListener("keydown", handleStartGame)

    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keydown", handleStartGame)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const handleStartGame = () => {
    if (!gameStartedRef.current) {
      gameStartedRef.current = true
      setGameStarted(true)
      resetGame()
    }
  }

  const resetGame = () => {
    boardRef.current = Array(20)
      .fill(null)
      .map(() => Array(10).fill(0))
    scoreRef.current = 0
    levelRef.current = 1
    gameOverRef.current = false
    pausedRef.current = false
    setScore(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)

    // Generate random first piece
    const randomIndex = Math.floor(Math.random() * SHAPES.length)
    currentPieceRef.current = {
      shape: SHAPES[randomIndex],
      x: 3,
      y: 0,
      color: randomIndex + 1,
    }

    // Generate random next piece
    const nextRandomIndex = Math.floor(Math.random() * SHAPES.length)
    nextPieceRef.current = {
      shape: SHAPES[nextRandomIndex],
      color: nextRandomIndex + 1,
    }
  }

  const togglePause = () => {
    pausedRef.current = !pausedRef.current
    setIsPaused(!isPaused)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Tetris</h1>

      <div className="relative mb-4">
        <canvas ref={canvasRef} className="border-2 border-zinc-700 rounded-lg" width={300} height={600} />

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <Button onClick={handleStartGame} className="bg-purple-600 hover:bg-purple-700 mb-4">
              Start Game
            </Button>
            <div className="text-center text-white px-4">
              <p className="mb-2">Arrow keys to move</p>
              <p className="mb-2">Up arrow to rotate</p>
              <p>P to pause</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-center text-white mb-4">
              <h2 className="text-xl font-bold mb-2">Game Over</h2>
              <p className="mb-1">Score: {score}</p>
              <p>Level: {level}</p>
            </div>
            <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
              Play Again
            </Button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-xl font-bold mb-4 text-white">Paused</h2>
            <Button onClick={togglePause} className="bg-purple-600 hover:bg-purple-700">
              Resume
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {gameStarted && !gameOver && (
          <Button onClick={togglePause} className="bg-zinc-700 hover:bg-zinc-600">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        )}

        {gameStarted && gameOver && (
          <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
            Play Again
          </Button>
        )}
      </div>

      <div className="mt-4 text-sm text-zinc-400 text-center">
        <p>Arrow keys to move and rotate</p>
        <p>P to pause the game</p>
      </div>
    </div>
  )
}

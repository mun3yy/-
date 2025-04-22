"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

// Simple maze layout
// 0 = empty space, 1 = wall, 2 = dot, 3 = power pellet
const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

type Direction = "up" | "down" | "left" | "right" | null

export default function PacMan() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)

  // Game state refs
  const mazeRef = useRef(JSON.parse(JSON.stringify(MAZE)))
  const pacmanRef = useRef({ x: 9, y: 15, direction: "right" as Direction, nextDirection: null as Direction })
  const ghostsRef = useRef([
    { x: 9, y: 9, direction: "up" as Direction, color: "#FF0000" }, // Red
    { x: 8, y: 9, direction: "left" as Direction, color: "#00FFFF" }, // Cyan
    { x: 10, y: 9, direction: "right" as Direction, color: "#FFB8FF" }, // Pink
    { x: 9, y: 8, direction: "down" as Direction, color: "#FFB852" }, // Orange
  ])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const gameOverRef = useRef(false)
  const gameWonRef = useRef(false)
  const gameStartedRef = useRef(false)
  const animationFrameRef = useRef<number>(0)
  const powerModeRef = useRef(false)
  const powerModeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const totalDotsRef = useRef(0)
  const dotsEatenRef = useRef(0)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 380
    canvas.height = 420

    // Count total dots
    let totalDots = 0
    for (let y = 0; y < MAZE.length; y++) {
      for (let x = 0; x < MAZE[y].length; x++) {
        if (MAZE[y][x] === 2 || MAZE[y][x] === 3) {
          totalDots++
        }
      }
    }
    totalDotsRef.current = totalDots

    // Draw start screen
    const drawStartScreen = () => {
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#FFD800"
      ctx.font = "30px Arial"
      ctx.textAlign = "center"
      ctx.fillText("PAC-MAN", canvas.width / 2, canvas.height / 2 - 50)

      ctx.fillStyle = "#FFF"
      ctx.font = "16px Arial"
      ctx.fillText("Press ENTER or click to start", canvas.width / 2, canvas.height / 2)
      ctx.fillText("Use arrow keys to move", canvas.width / 2, canvas.height / 2 + 30)
    }

    drawStartScreen()

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !gameStartedRef.current) {
        startGame()
        return
      }

      if (!gameStartedRef.current || gameOverRef.current || gameWonRef.current) return

      switch (e.key) {
        case "ArrowUp":
          pacmanRef.current.nextDirection = "up"
          break
        case "ArrowDown":
          pacmanRef.current.nextDirection = "down"
          break
        case "ArrowLeft":
          pacmanRef.current.nextDirection = "left"
          break
        case "ArrowRight":
          pacmanRef.current.nextDirection = "right"
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Handle canvas click
    const handleCanvasClick = () => {
      if (!gameStartedRef.current) {
        startGame()
      } else if (gameOverRef.current || gameWonRef.current) {
        resetGame()
      }
    }

    canvas.addEventListener("click", handleCanvasClick)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("click", handleCanvasClick)
      cancelAnimationFrame(animationFrameRef.current)
      if (powerModeTimerRef.current) {
        clearTimeout(powerModeTimerRef.current)
      }
    }
  }, [])

  // Start game
  const startGame = () => {
    resetGame()
    gameStartedRef.current = true
    setGameStarted(true)
    gameLoop()
  }

  // Reset game
  const resetGame = () => {
    mazeRef.current = JSON.parse(JSON.stringify(MAZE))
    pacmanRef.current = { x: 9, y: 15, direction: "right", nextDirection: null }
    ghostsRef.current = [
      { x: 9, y: 9, direction: "up", color: "#FF0000" },
      { x: 8, y: 9, direction: "left", color: "#00FFFF" },
      { x: 10, y: 9, direction: "right", color: "#FFB8FF" },
      { x: 9, y: 8, direction: "down", color: "#FFB852" },
    ]
    scoreRef.current = 0
    livesRef.current = 3
    gameOverRef.current = false
    gameWonRef.current = false
    powerModeRef.current = false
    dotsEatenRef.current = 0

    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameWon(false)

    if (powerModeTimerRef.current) {
      clearTimeout(powerModeTimerRef.current)
      powerModeTimerRef.current = null
    }
  }

  // Game loop
  const gameLoop = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw maze
    const cellSize = 20
    for (let y = 0; y < mazeRef.current.length; y++) {
      for (let x = 0; x < mazeRef.current[y].length; x++) {
        const cell = mazeRef.current[y][x]

        if (cell === 1) {
          // Wall
          ctx.fillStyle = "#2121ff"
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        } else if (cell === 2) {
          // Dot
          ctx.fillStyle = "#FFB8FF"
          ctx.beginPath()
          ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (cell === 3) {
          // Power pellet
          ctx.fillStyle = "#FFB8FF"
          ctx.beginPath()
          ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Update pacman direction if possible
    if (pacmanRef.current.nextDirection) {
      const { x, y } = pacmanRef.current
      const { nextDirection } = pacmanRef.current

      let newX = x
      let newY = y

      if (nextDirection === "up") newY--
      else if (nextDirection === "down") newY++
      else if (nextDirection === "left") newX--
      else if (nextDirection === "right") newX++

      // Check if the new position is valid
      if (
        newY >= 0 &&
        newY < mazeRef.current.length &&
        newX >= 0 &&
        newX < mazeRef.current[newY].length &&
        mazeRef.current[newY][newX] !== 1
      ) {
        pacmanRef.current.direction = nextDirection
        pacmanRef.current.nextDirection = null
      }
    }

    // Move pacman
    if (pacmanRef.current.direction) {
      const { x, y, direction } = pacmanRef.current
      let newX = x
      let newY = y

      if (direction === "up") newY--
      else if (direction === "down") newY++
      else if (direction === "left") newX--
      else if (direction === "right") newX++

      // Wrap around
      if (newX < 0) newX = mazeRef.current[0].length - 1
      if (newX >= mazeRef.current[0].length) newX = 0

      // Check if the new position is valid
      if (newY >= 0 && newY < mazeRef.current.length && mazeRef.current[newY][newX] !== 1) {
        pacmanRef.current.x = newX
        pacmanRef.current.y = newY

        // Check if pacman ate a dot
        if (mazeRef.current[newY][newX] === 2) {
          mazeRef.current[newY][newX] = 0
          scoreRef.current += 10
          dotsEatenRef.current++
          setScore(scoreRef.current)
        }
        // Check if pacman ate a power pellet
        else if (mazeRef.current[newY][newX] === 3) {
          mazeRef.current[newY][newX] = 0
          scoreRef.current += 50
          dotsEatenRef.current++
          setScore(scoreRef.current)

          // Activate power mode
          powerModeRef.current = true

          // Clear existing timer
          if (powerModeTimerRef.current) {
            clearTimeout(powerModeTimerRef.current)
          }

          // Set timer to end power mode
          powerModeTimerRef.current = setTimeout(() => {
            powerModeRef.current = false
          }, 8000)
        }

        // Check if all dots are eaten
        if (dotsEatenRef.current >= totalDotsRef.current) {
          gameWonRef.current = true
          setGameWon(true)
        }
      }
    }

    // Draw pacman
    ctx.fillStyle = "#FFD800"
    ctx.beginPath()

    const pacmanX = pacmanRef.current.x * cellSize + cellSize / 2
    const pacmanY = pacmanRef.current.y * cellSize + cellSize / 2
    const pacmanRadius = cellSize / 2

    // Calculate mouth angle based on direction
    let startAngle = 0.2 * Math.PI
    let endAngle = 1.8 * Math.PI

    if (pacmanRef.current.direction === "up") {
      startAngle = 1.2 * Math.PI
      endAngle = 2.8 * Math.PI
    } else if (pacmanRef.current.direction === "down") {
      startAngle = 0.2 * Math.PI
      endAngle = 1.8 * Math.PI
    } else if (pacmanRef.current.direction === "left") {
      startAngle = 0.7 * Math.PI
      endAngle = 2.3 * Math.PI
    } else if (pacmanRef.current.direction === "right") {
      startAngle = 0.2 * Math.PI
      endAngle = 1.8 * Math.PI
    }

    ctx.arc(pacmanX, pacmanY, pacmanRadius, startAngle, endAngle)
    ctx.lineTo(pacmanX, pacmanY)
    ctx.fill()

    // Move and draw ghosts
    for (let i = 0; i < ghostsRef.current.length; i++) {
      const ghost = ghostsRef.current[i]

      // Decide ghost direction
      const possibleDirections: Direction[] = []

      if (ghost.y > 0 && mazeRef.current[ghost.y - 1][ghost.x] !== 1 && ghost.direction !== "down") {
        possibleDirections.push("up")
      }

      if (
        ghost.y < mazeRef.current.length - 1 &&
        mazeRef.current[ghost.y + 1][ghost.x] !== 1 &&
        ghost.direction !== "up"
      ) {
        possibleDirections.push("down")
      }

      if (ghost.x > 0 && mazeRef.current[ghost.y][ghost.x - 1] !== 1 && ghost.direction !== "right") {
        possibleDirections.push("left")
      }

      if (
        ghost.x < mazeRef.current[0].length - 1 &&
        mazeRef.current[ghost.y][ghost.x + 1] !== 1 &&
        ghost.direction !== "left"
      ) {
        possibleDirections.push("right")
      }

      // If at an intersection, choose a direction that gets closer to pacman
      // unless in power mode, then try to get away
      if (possibleDirections.length > 1) {
        const dx = pacmanRef.current.x - ghost.x
        const dy = pacmanRef.current.y - ghost.y

        // Sort directions by how much they get closer to/away from pacman
        possibleDirections.sort((a, b) => {
          let aScore = 0
          let bScore = 0

          if (a === "up") aScore = powerModeRef.current ? -dy : dy
          else if (a === "down") aScore = powerModeRef.current ? dy : -dy
          else if (a === "left") aScore = powerModeRef.current ? -dx : dx
          else if (a === "right") aScore = powerModeRef.current ? dx : -dx

          if (b === "up") bScore = powerModeRef.current ? -dy : dy
          else if (b === "down") bScore = powerModeRef.current ? dy : -dy
          else if (b === "left") bScore = powerModeRef.current ? -dx : dx
          else if (b === "right") bScore = powerModeRef.current ? dx : -dx

          return bScore - aScore
        })

        // 70% chance to choose the best direction, 30% to choose randomly
        if (Math.random() < 0.7) {
          ghost.direction = possibleDirections[0]
        } else {
          ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
        }
      } else if (possibleDirections.length === 1) {
        ghost.direction = possibleDirections[0]
      } else {
        // No valid direction, reverse
        if (ghost.direction === "up") ghost.direction = "down"
        else if (ghost.direction === "down") ghost.direction = "up"
        else if (ghost.direction === "left") ghost.direction = "right"
        else if (ghost.direction === "right") ghost.direction = "left"
      }

      // Move ghost
      if (ghost.direction === "up") ghost.y--
      else if (ghost.direction === "down") ghost.y++
      else if (ghost.direction === "left") ghost.x--
      else if (ghost.direction === "right") ghost.x++

      // Wrap around
      if (ghost.x < 0) ghost.x = mazeRef.current[0].length - 1
      if (ghost.x >= mazeRef.current[0].length) ghost.x = 0

      // Draw ghost
      ctx.fillStyle = powerModeRef.current ? "#2121ff" : ghost.color

      // Ghost body
      ctx.beginPath()
      ctx.arc(
        ghost.x * cellSize + cellSize / 2,
        ghost.y * cellSize + cellSize / 2 - 2,
        cellSize / 2 - 2,
        Math.PI,
        0,
        false,
      )
      ctx.lineTo(ghost.x * cellSize + cellSize, ghost.y * cellSize + cellSize / 2 + 6)

      // Wavy bottom
      for (let j = 0; j < 3; j++) {
        ctx.quadraticCurveTo(
          ghost.x * cellSize + cellSize - ((j * cellSize) / 3 + cellSize / 6),
          ghost.y * cellSize + cellSize / 2 + (j % 2 === 0 ? 10 : 6),
          ghost.x * cellSize + cellSize - ((j + 1) * cellSize) / 3,
          ghost.y * cellSize + cellSize / 2 + 6,
        )
      }

      ctx.lineTo(ghost.x * cellSize, ghost.y * cellSize + cellSize / 2 + 6)
      ctx.fill()

      // Eyes
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.arc(ghost.x * cellSize + cellSize / 3, ghost.y * cellSize + cellSize / 2 - 2, cellSize / 6, 0, Math.PI * 2)
      ctx.arc(
        ghost.x * cellSize + (cellSize * 2) / 3,
        ghost.y * cellSize + cellSize / 2 - 2,
        cellSize / 6,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#000"

      let pupilOffsetX = 0
      let pupilOffsetY = 0

      if (ghost.direction === "up") pupilOffsetY = -1
      else if (ghost.direction === "down") pupilOffsetY = 1
      else if (ghost.direction === "left") pupilOffsetX = -1
      else if (ghost.direction === "right") pupilOffsetX = 1

      ctx.beginPath()
      ctx.arc(
        ghost.x * cellSize + cellSize / 3 + pupilOffsetX * 2,
        ghost.y * cellSize + cellSize / 2 - 2 + pupilOffsetY * 2,
        cellSize / 10,
        0,
        Math.PI * 2,
      )
      ctx.arc(
        ghost.x * cellSize + (cellSize * 2) / 3 + pupilOffsetX * 2,
        ghost.y * cellSize + cellSize / 2 - 2 + pupilOffsetY * 2,
        cellSize / 10,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Check collision with pacman
      if (ghost.x === pacmanRef.current.x && ghost.y === pacmanRef.current.y) {
        if (powerModeRef.current) {
          // Pacman eats ghost
          scoreRef.current += 200
          setScore(scoreRef.current)

          // Reset ghost position
          ghost.x = 9
          ghost.y = 9
        } else {
          // Ghost catches pacman
          livesRef.current--
          setLives(livesRef.current)

          if (livesRef.current <= 0) {
            gameOverRef.current = true
            setGameOver(true)
          } else {
            // Reset positions
            pacmanRef.current = { x: 9, y: 15, direction: "right", nextDirection: null }
            ghostsRef.current = [
              { x: 9, y: 9, direction: "up", color: "#FF0000" },
              { x: 8, y: 9, direction: "left", color: "#00FFFF" },
              { x: 10, y: 9, direction: "right", color: "#FFB8FF" },
              { x: 9, y: 8, direction: "down", color: "#FFB852" },
            ]
          }
        }
      }
    }

    // Draw score and lives
    ctx.fillStyle = "#FFF"
    ctx.font = "16px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${scoreRef.current}`, 10, mazeRef.current.length * cellSize + 20)

    // Draw lives
    ctx.fillText("Lives:", 10, mazeRef.current.length * cellSize + 40)
    for (let i = 0; i < livesRef.current; i++) {
      ctx.fillStyle = "#FFD800"
      ctx.beginPath()
      ctx.arc(80 + i * 25, mazeRef.current.length * cellSize + 35, 8, 0.2 * Math.PI, 1.8 * Math.PI)
      ctx.lineTo(80 + i * 25, mazeRef.current.length * cellSize + 35)
      ctx.fill()
    }

    // Draw power mode timer
    if (powerModeRef.current) {
      ctx.fillStyle = "#2121ff"
      ctx.fillText("POWER MODE!", 200, mazeRef.current.length * cellSize + 20)
    }

    // Game over or win screen
    if (gameOverRef.current || gameWonRef.current) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#FFF"
      ctx.font = "30px Arial"
      ctx.textAlign = "center"
      ctx.fillText(gameWonRef.current ? "YOU WIN!" : "GAME OVER", canvas.width / 2, canvas.height / 2 - 20)

      ctx.font = "20px Arial"
      ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 20)

      ctx.font = "16px Arial"
      ctx.fillText("Click or press ENTER to play again", canvas.width / 2, canvas.height / 2 + 60)

      return
    }

    // Continue game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }

  const handleStartGame = () => {
    if (!gameStartedRef.current) {
      startGame()
    } else if (gameOverRef.current || gameWonRef.current) {
      resetGame()
      gameLoop()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Pac-Man</h1>

      <div className="relative mb-4">
        <canvas ref={canvasRef} className="border-2 border-zinc-700 rounded-lg bg-black" width={380} height={420} />

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button onClick={handleStartGame} className="bg-purple-600 hover:bg-purple-700">
              Start Game
            </Button>
          </div>
        )}
      </div>

      {(gameOver || gameWon) && (
        <Button onClick={handleStartGame} className="bg-purple-600 hover:bg-purple-700">
          Play Again
        </Button>
      )}

      <div className="mt-4 text-sm text-zinc-400 text-center">
        <p>Use arrow keys to move Pac-Man</p>
        <p>Eat all dots to win!</p>
      </div>
    </div>
  )
}

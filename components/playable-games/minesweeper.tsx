"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bomb, Flag, RefreshCw, SmilePlus, Frown } from "lucide-react"

type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

type Difficulty = "easy" | "medium" | "hard"

const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
}

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [flagsPlaced, setFlagsPlaced] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  // Initialize the board
  useEffect(() => {
    initializeBoard()
  }, [difficulty])

  // Timer logic
  useEffect(() => {
    if (startTime && !gameOver && !gameWon) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      setTimerInterval(interval)
      return () => clearInterval(interval)
    }
  }, [startTime, gameOver, gameWon])

  // Stop timer when game ends
  useEffect(() => {
    if ((gameOver || gameWon) && timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [gameOver, gameWon, timerInterval])

  const initializeBoard = () => {
    const { rows, cols } = DIFFICULTY_SETTINGS[difficulty]
    const newBoard: Cell[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          })),
      )

    setBoard(newBoard)
    setGameOver(false)
    setGameWon(false)
    setFlagsPlaced(0)
    setFirstClick(true)
    setStartTime(null)
    setElapsedTime(0)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }

  const placeMines = (firstClickRow: number, firstClickCol: number) => {
    const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty]
    const newBoard = [...board]
    let minesPlaced = 0

    // Create a safe zone around the first click
    const safeZone = []
    for (let r = Math.max(0, firstClickRow - 1); r <= Math.min(rows - 1, firstClickRow + 1); r++) {
      for (let c = Math.max(0, firstClickCol - 1); c <= Math.min(cols - 1, firstClickCol + 1); c++) {
        safeZone.push({ r, c })
      }
    }

    // Place mines randomly
    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows)
      const c = Math.floor(Math.random() * cols)

      // Skip if mine already placed or in safe zone
      if (newBoard[r][c].isMine || safeZone.some((pos) => pos.r === r && pos.c === c)) {
        continue
      }

      newBoard[r][c].isMine = true
      minesPlaced++
    }

    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c].isMine) continue

        let count = 0
        // Check all 8 neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue

            const nr = r + dr
            const nc = c + dc

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
              count++
            }
          }
        }

        newBoard[r][c].neighborMines = count
      }
    }

    setBoard(newBoard)
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed || board[row][col].isFlagged) {
      return
    }

    // Start timer on first click
    if (firstClick) {
      setFirstClick(false)
      setStartTime(Date.now())
      placeMines(row, col)
    }

    const newBoard = [...board]

    // Game over if mine clicked
    if (newBoard[row][col].isMine) {
      revealAllMines()
      setGameOver(true)
      return
    }

    // Reveal the cell
    revealCell(newBoard, row, col)

    // Check for win
    checkWinCondition(newBoard)

    setBoard(newBoard)
  }

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()

    if (gameOver || gameWon || board[row][col].isRevealed) {
      return
    }

    const newBoard = [...board]
    const cell = newBoard[row][col]

    // Toggle flag
    if (cell.isFlagged) {
      cell.isFlagged = false
      setFlagsPlaced(flagsPlaced - 1)
    } else {
      cell.isFlagged = true
      setFlagsPlaced(flagsPlaced + 1)
    }

    setBoard(newBoard)
  }

  const revealCell = (board: Cell[][], row: number, col: number) => {
    const { rows, cols } = DIFFICULTY_SETTINGS[difficulty]

    // Out of bounds or already revealed
    if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col].isRevealed || board[row][col].isFlagged) {
      return
    }

    // Reveal the cell
    board[row][col].isRevealed = true

    // If it's a 0, reveal neighbors recursively
    if (board[row][col].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          revealCell(board, row + dr, col + dc)
        }
      }
    }
  }

  const revealAllMines = () => {
    const newBoard = [...board]

    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[r].length; c++) {
        if (newBoard[r][c].isMine) {
          newBoard[r][c].isRevealed = true
        }
      }
    }

    setBoard(newBoard)
  }

  const checkWinCondition = (board: Cell[][]) => {
    const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty]
    let revealedCount = 0

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isRevealed) {
          revealedCount++
        }
      }
    }

    // Win if all non-mine cells are revealed
    if (revealedCount === rows * cols - mines) {
      setGameWon(true)

      // Flag all mines
      const newBoard = [...board]
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isFlagged = true
          }
        }
      }
      setBoard(newBoard)
      setFlagsPlaced(mines)
    }
  }

  const getCellColor = (cell: Cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return "bg-red-600"
      }
      return "bg-zinc-300"
    }
    return "bg-zinc-500 hover:bg-zinc-400"
  }

  const getNumberColor = (count: number) => {
    const colors = [
      "", // 0 has no number
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-purple-800",
      "text-yellow-600",
      "text-cyan-600",
      "text-black",
      "text-gray-600",
    ]
    return colors[count] || ""
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Minesweeper</h1>

      <div className="mb-4 flex gap-2">
        <Button
          onClick={() => {
            setDifficulty("easy")
            initializeBoard()
          }}
          className={`${difficulty === "easy" ? "bg-purple-600" : "bg-zinc-700"}`}
          size="sm"
        >
          Easy
        </Button>
        <Button
          onClick={() => {
            setDifficulty("medium")
            initializeBoard()
          }}
          className={`${difficulty === "medium" ? "bg-purple-600" : "bg-zinc-700"}`}
          size="sm"
        >
          Medium
        </Button>
        <Button
          onClick={() => {
            setDifficulty("hard")
            initializeBoard()
          }}
          className={`${difficulty === "hard" ? "bg-purple-600" : "bg-zinc-700"}`}
          size="sm"
        >
          Hard
        </Button>
      </div>

      <div className="mb-4 flex justify-between w-full max-w-md bg-zinc-800 p-2 rounded-md">
        <div className="flex items-center">
          <Flag className="h-4 w-4 mr-1 text-red-500" />
          <span>
            {flagsPlaced} / {DIFFICULTY_SETTINGS[difficulty].mines}
          </span>
        </div>

        <div className="flex items-center">
          {gameOver ? (
            <Frown className="h-6 w-6 text-red-500 mx-2" />
          ) : gameWon ? (
            <SmilePlus className="h-6 w-6 text-green-500 mx-2" />
          ) : (
            <Button onClick={initializeBoard} size="icon" variant="ghost" className="h-6 w-6 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center">
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>

      <div className="border-2 border-zinc-700 rounded-lg overflow-hidden">
        <div
          className="grid gap-px bg-zinc-700"
          style={{
            gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].cols}, 1fr)`,
            width: `${Math.min(DIFFICULTY_SETTINGS[difficulty].cols * 30, 450)}px`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-7 h-7 flex items-center justify-center text-sm font-bold cursor-pointer
                  ${getCellColor(cell)}
                  ${cell.isRevealed ? "cursor-default" : ""}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
              >
                {cell.isFlagged ? (
                  <Flag className="h-4 w-4 text-red-500" />
                ) : cell.isRevealed ? (
                  cell.isMine ? (
                    <Bomb className="h-4 w-4" />
                  ) : cell.neighborMines > 0 ? (
                    <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
                  ) : null
                ) : null}
              </div>
            )),
          )}
        </div>
      </div>

      {(gameOver || gameWon) && (
        <Button onClick={initializeBoard} className="mt-4 bg-purple-600 hover:bg-purple-700">
          {gameOver ? "Try Again" : "Play Again"}
        </Button>
      )}

      <div className="mt-4 text-sm text-zinc-400 text-center">
        <p>Left click to reveal, right click to flag</p>
      </div>
    </div>
  )
}

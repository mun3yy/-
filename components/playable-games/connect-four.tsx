"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type Player = 1 | 2
type Cell = Player | null
type Board = Cell[][]

export default function ConnectFour() {
  const [board, setBoard] = useState<Board>(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1)
  const [winner, setWinner] = useState<Player | null>(null)
  const [isDraw, setIsDraw] = useState<boolean>(false)
  const [winningCells, setWinningCells] = useState<[number, number][]>([])
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [isAIMode, setIsAIMode] = useState<boolean>(false)
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false)

  // Initialize game
  const initializeGame = (aiMode: boolean) => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(7).fill(null)),
    )
    setCurrentPlayer(1)
    setWinner(null)
    setIsDraw(false)
    setWinningCells([])
    setGameStarted(true)
    setIsAIMode(aiMode)
    setIsAIThinking(false)
  }

  // AI move
  useEffect(() => {
    if (gameStarted && isAIMode && currentPlayer === 2 && !winner && !isDraw) {
      setIsAIThinking(true)

      // Add a small delay to make it seem like the AI is thinking
      const timeoutId = setTimeout(() => {
        makeAIMove()
        setIsAIThinking(false)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [currentPlayer, gameStarted, isAIMode, winner, isDraw])

  // Make a move
  const makeMove = (col: number) => {
    if (winner || isDraw || isAIThinking) return

    // Find the lowest empty row in the selected column
    const newBoard = [...board.map((row) => [...row])]
    let rowIndex = -1

    for (let i = newBoard.length - 1; i >= 0; i--) {
      if (newBoard[i][col] === null) {
        rowIndex = i
        break
      }
    }

    // If column is full, do nothing
    if (rowIndex === -1) return

    // Place the piece
    newBoard[rowIndex][col] = currentPlayer
    setBoard(newBoard)

    // Check for win
    const win = checkWin(newBoard, rowIndex, col)
    if (win) {
      setWinner(currentPlayer)
      setWinningCells(win)
      return
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true)
      return
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
  }

  // AI move logic
  const makeAIMove = () => {
    // Simple AI: first try to win, then block opponent, then random move

    // Try each column
    for (let col = 0; col < 7; col++) {
      // Find the row where the piece would land
      let rowIndex = -1
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][col] === null) {
          rowIndex = i
          break
        }
      }

      // Skip if column is full
      if (rowIndex === -1) continue

      // Check if AI can win with this move
      const tempBoard = [...board.map((row) => [...row])]
      tempBoard[rowIndex][col] = 2

      const win = checkWin(tempBoard, rowIndex, col)
      if (win) {
        makeMove(col)
        return
      }
    }

    // Try to block opponent
    for (let col = 0; col < 7; col++) {
      // Find the row where the piece would land
      let rowIndex = -1
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][col] === null) {
          rowIndex = i
          break
        }
      }

      // Skip if column is full
      if (rowIndex === -1) continue

      // Check if opponent can win with this move
      const tempBoard = [...board.map((row) => [...row])]
      tempBoard[rowIndex][col] = 1

      const win = checkWin(tempBoard, rowIndex, col)
      if (win) {
        makeMove(col)
        return
      }
    }

    // Make a random move
    const availableCols = []
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) {
        availableCols.push(col)
      }
    }

    if (availableCols.length > 0) {
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)]
      makeMove(randomCol)
    }
  }

  // Check for win
  const checkWin = (board: Board, row: number, col: number): [number, number][] | null => {
    const player = board[row][col]
    if (!player) return null

    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ]

    for (const [dr, dc] of directions) {
      const winningCells: [number, number][] = [[row, col]]

      // Check in positive direction
      let r = row + dr
      let c = col + dc
      while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
        winningCells.push([r, c])
        r += dr
        c += dc
      }

      // Check in negative direction
      r = row - dr
      c = col - dc
      while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
        winningCells.push([r, c])
        r -= dr
        c -= dc
      }

      if (winningCells.length >= 4) {
        return winningCells
      }
    }

    return null
  }

  // Check for draw
  const checkDraw = (board: Board): boolean => {
    return board[0].every((cell) => cell !== null)
  }

  // Get cell color
  const getCellColor = (cell: Cell, row: number, col: number) => {
    if (winningCells.some(([r, c]) => r === row && c === col)) {
      return "bg-yellow-400 animate-pulse"
    }

    if (cell === 1) return "bg-red-500"
    if (cell === 2) return "bg-yellow-500"
    return "bg-zinc-700"
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Connect Four</h1>

      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Select Game Mode</h2>
          <div className="flex gap-4">
            <Button onClick={() => initializeGame(false)} className="bg-purple-600 hover:bg-purple-700">
              2 Players
            </Button>
            <Button onClick={() => initializeGame(true)} className="bg-purple-600 hover:bg-purple-700">
              vs AI
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between w-full max-w-md">
            <div className={`font-bold ${currentPlayer === 1 ? "text-red-500" : "text-yellow-500"}`}>
              {winner
                ? `Player ${winner} Wins!`
                : isDraw
                  ? "Draw!"
                  : isAIThinking
                    ? "AI is thinking..."
                    : `Player ${currentPlayer}'s Turn`}
            </div>
          </div>

          <div className="bg-blue-600 p-2 rounded-lg mb-4">
            {/* Column buttons */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {Array(7)
                .fill(null)
                .map((_, col) => (
                  <Button
                    key={col}
                    onClick={() => makeMove(col)}
                    disabled={board[0][col] !== null || winner !== null || isDraw || (isAIMode && currentPlayer === 2)}
                    className="h-8 min-w-0 p-0 bg-blue-500 hover:bg-blue-400 disabled:opacity-50"
                  >
                    ↓
                  </Button>
                ))}
            </div>

            {/* Game board */}
            <div className="grid grid-cols-7 gap-1">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-10 h-10 rounded-full ${getCellColor(cell, rowIndex, colIndex)}`}
                    initial={{ y: cell !== null ? -50 : 0 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )),
              )}
            </div>
          </div>

          {(winner || isDraw) && (
            <div className="flex gap-2">
              <Button onClick={() => initializeGame(isAIMode)} className="bg-purple-600 hover:bg-purple-700">
                Play Again
              </Button>
              <Button onClick={() => setGameStarted(false)} className="bg-zinc-700 hover:bg-zinc-600">
                Main Menu
              </Button>
            </div>
          )}

          {!winner && !isDraw && (
            <Button onClick={() => setGameStarted(false)} className="bg-zinc-700 hover:bg-zinc-600">
              Restart
            </Button>
          )}
        </>
      )}
    </div>
  )
}

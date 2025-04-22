"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  const handleClick = (i: number) => {
    if (gameOver || board[i]) return

    const newBoard = [...board]
    newBoard[i] = xIsNext ? "X" : "O"
    setBoard(newBoard)
    setXIsNext(!xIsNext)

    // Check for winner
    const winner = calculateWinner(newBoard)
    if (winner || newBoard.every((square) => square !== null)) {
      setGameOver(true)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
    setGameOver(false)
  }

  const winner = calculateWinner(board)
  const status = winner
    ? `Winner: ${winner}`
    : board.every((square) => square !== null)
      ? "Game ended in a draw!"
      : `Next player: ${xIsNext ? "X" : "O"}`

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Tic Tac Toe</h1>
      <div className="mb-4 text-lg">{status}</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((square, i) => (
          <button
            key={i}
            className="w-20 h-20 bg-zinc-800 hover:bg-zinc-700 text-3xl font-bold flex items-center justify-center border border-zinc-600"
            onClick={() => handleClick(i)}
            disabled={gameOver || !!square}
          >
            {square}
          </button>
        ))}
      </div>
      <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
        Reset Game
      </Button>
    </div>
  )
}

function calculateWinner(squares: Array<string | null>): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] as string
    }
  }
  return null
}

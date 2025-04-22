"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Word list (common 5-letter words)
const WORD_LIST = [
  "apple",
  "beach",
  "brain",
  "bread",
  "brush",
  "chair",
  "chest",
  "chord",
  "click",
  "clock",
  "cloud",
  "dance",
  "diary",
  "drink",
  "earth",
  "flute",
  "fruit",
  "ghost",
  "grape",
  "green",
  "happy",
  "heart",
  "house",
  "juice",
  "light",
  "money",
  "music",
  "party",
  "pizza",
  "plant",
  "radio",
  "river",
  "robot",
  "rocket",
  "smile",
  "snake",
  "space",
  "storm",
  "story",
  "sugar",
  "table",
  "tiger",
  "train",
  "water",
  "whale",
  "wheel",
  "woman",
  "world",
  "write",
  "youth",
]

type GameState = "playing" | "won" | "lost"

export default function Wordle() {
  const [targetWord, setTargetWord] = useState<string>("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState<string>("")
  const [gameState, setGameState] = useState<GameState>("playing")
  const [message, setMessage] = useState<string>("")
  const [shake, setShake] = useState<boolean>(false)
  const [revealIndices, setRevealIndices] = useState<{ [key: number]: number[] }>({})
  const [usedLetters, setUsedLetters] = useState<{ [key: string]: "correct" | "present" | "absent" | null }>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const MAX_GUESSES = 6

  // Initialize game
  useEffect(() => {
    startNewGame()
  }, [])

  // Focus input when game state changes
  useEffect(() => {
    if (gameState === "playing") {
      inputRef.current?.focus()
    }
  }, [gameState, guesses])

  // Start a new game
  const startNewGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    setTargetWord(randomWord)
    setGuesses([])
    setCurrentGuess("")
    setGameState("playing")
    setMessage("")
    setShake(false)
    setRevealIndices({})
    setUsedLetters({})
  }

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameState !== "playing") return

    if (e.key === "Enter") {
      submitGuess()
    } else if (e.key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + e.key.toLowerCase())
    }
  }

  // Submit a guess
  const submitGuess = () => {
    // Validate guess
    if (currentGuess.length !== 5) {
      setMessage("Word must be 5 letters")
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    if (!WORD_LIST.includes(currentGuess)) {
      setMessage("Not in word list")
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    // Add guess to list
    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    // Set up animation for revealing letters
    const newRevealIndices = { ...revealIndices }
    newRevealIndices[newGuesses.length - 1] = [0, 1, 2, 3, 4]
    setRevealIndices(newRevealIndices)

    // Update used letters
    const newUsedLetters = { ...usedLetters }
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i]

      if (letter === targetWord[i]) {
        newUsedLetters[letter] = "correct"
      } else if (targetWord.includes(letter) && newUsedLetters[letter] !== "correct") {
        newUsedLetters[letter] = "present"
      } else if (!targetWord.includes(letter)) {
        newUsedLetters[letter] = "absent"
      }
    }
    setUsedLetters(newUsedLetters)

    // Check for win
    if (currentGuess === targetWord) {
      setGameState("won")
      setMessage("You won!")
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState("lost")
      setMessage(`You lost! The word was ${targetWord}`)
    }

    // Reset current guess
    setCurrentGuess("")
  }

  // Get cell color based on letter status
  const getCellColor = (guess: string, index: number) => {
    const letter = guess[index]

    if (letter === targetWord[index]) {
      return "bg-green-500 border-green-600"
    } else if (targetWord.includes(letter)) {
      return "bg-yellow-500 border-yellow-600"
    } else {
      return "bg-zinc-700 border-zinc-600"
    }
  }

  // Get keyboard key color
  const getKeyColor = (letter: string) => {
    if (!usedLetters[letter]) return "bg-zinc-600"

    switch (usedLetters[letter]) {
      case "correct":
        return "bg-green-500"
      case "present":
        return "bg-yellow-500"
      case "absent":
        return "bg-zinc-800"
      default:
        return "bg-zinc-600"
    }
  }

  // Keyboard layout
  const keyboard = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Wordle</h1>

      <div className="mb-4">
        {message && <div className="text-center font-bold mb-2">{message}</div>}

        <div className="grid grid-rows-6 gap-1 mb-4">
          {Array(MAX_GUESSES)
            .fill(null)
            .map((_, rowIndex) => (
              <motion.div
                key={rowIndex}
                className={`grid grid-cols-5 gap-1 ${rowIndex === guesses.length && shake ? "animate-shake" : ""}`}
              >
                {Array(5)
                  .fill(null)
                  .map((_, colIndex) => {
                    const isCurrentRow = rowIndex === guesses.length
                    const isRevealingRow = rowIndex < guesses.length
                    const shouldReveal = isRevealingRow && revealIndices[rowIndex]?.includes(colIndex)

                    return (
                      <motion.div
                        key={colIndex}
                        className={`
                      w-12 h-12 flex items-center justify-center text-xl font-bold
                      border-2 ${isCurrentRow ? "border-zinc-500" : "border-zinc-700"}
                      ${isRevealingRow ? getCellColor(guesses[rowIndex], colIndex) : "bg-transparent"}
                    `}
                        animate={shouldReveal ? { rotateX: [0, 90, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, delay: colIndex * 0.15 }}
                      >
                        {isCurrentRow && colIndex < currentGuess.length
                          ? currentGuess[colIndex].toUpperCase()
                          : isRevealingRow
                            ? guesses[rowIndex][colIndex].toUpperCase()
                            : ""}
                      </motion.div>
                    )
                  })}
              </motion.div>
            ))}
        </div>

        {/* Virtual keyboard */}
        <div className="flex flex-col items-center gap-1">
          {keyboard.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((key) => (
                <Button
                  key={key}
                  className={`
                    h-10 ${key === "Enter" || key === "Backspace" ? "w-16" : "w-8"} 
                    text-sm font-medium p-0 ${getKeyColor(key.toLowerCase())}
                  `}
                  onClick={() => {
                    if (key === "Enter") {
                      submitGuess()
                    } else if (key === "Backspace") {
                      setCurrentGuess((prev) => prev.slice(0, -1))
                    } else if (currentGuess.length < 5) {
                      setCurrentGuess((prev) => prev + key.toLowerCase())
                    }
                  }}
                  disabled={gameState !== "playing"}
                >
                  {key === "Backspace" ? "⌫" : key}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {gameState !== "playing" && (
        <Button onClick={startNewGame} className="bg-purple-600 hover:bg-purple-700">
          Play Again
        </Button>
      )}

      {/* Hidden input for keyboard focus */}
      <input
        ref={inputRef}
        className="opacity-0 absolute"
        value={currentGuess}
        onChange={(e) => setCurrentGuess(e.target.value.toLowerCase().slice(0, 5))}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}

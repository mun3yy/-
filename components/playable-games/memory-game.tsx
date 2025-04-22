"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type Card = {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")

  // Emoji sets for different difficulties
  const emojiSets = {
    easy: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    medium: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮"],
    hard: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"],
  }

  // Get grid dimensions based on difficulty
  const getGridDimensions = () => {
    switch (difficulty) {
      case "easy":
        return { cols: 4, rows: 4 }
      case "medium":
        return { cols: 4, rows: 6 }
      case "hard":
        return { cols: 4, rows: 8 }
    }
  }

  // Initialize game
  const initializeGame = () => {
    const { cols, rows } = getGridDimensions()
    const totalCards = cols * rows
    const pairsCount = totalCards / 2
    const emojis = emojiSets[difficulty].slice(0, pairsCount)

    // Create pairs of cards
    let cardValues = [...emojis, ...emojis]

    // Shuffle cards
    cardValues = cardValues.sort(() => Math.random() - 0.5)

    // Create card objects
    const newCards = cardValues.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }))

    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameOver(false)
    setGameStarted(true)
  }

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore if game is over or card is already flipped/matched
    if (gameOver || flippedCards.length >= 2) return

    const clickedCard = cards.find((card) => card.id === id)
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return

    // Flip the card
    const updatedCards = cards.map((card) => (card.id === id ? { ...card, flipped: true } : card))

    const updatedFlippedCards = [...flippedCards, id]

    setCards(updatedCards)
    setFlippedCards(updatedFlippedCards)

    // Check for match if two cards are flipped
    if (updatedFlippedCards.length === 2) {
      setMoves(moves + 1)

      const [firstId, secondId] = updatedFlippedCards
      const firstCard = updatedCards.find((card) => card.id === firstId)
      const secondCard = updatedCards.find((card) => card.id === secondId)

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          const matchedCards = updatedCards.map((card) =>
            card.id === firstId || card.id === secondId ? { ...card, matched: true } : card,
          )

          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs(matchedPairs + 1)

          // Check if game is over
          const { cols, rows } = getGridDimensions()
          if (matchedPairs + 1 === (cols * rows) / 2) {
            setGameOver(true)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = updatedCards.map((card) =>
            card.id === firstId || card.id === secondId ? { ...card, flipped: false } : card,
          )

          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Get card background color
  const getCardColor = (card: Card) => {
    if (card.matched) return "bg-green-500"
    if (card.flipped) return "bg-purple-600"
    return "bg-zinc-700 hover:bg-zinc-600"
  }

  // Calculate star rating based on moves
  const getStarRating = () => {
    const { cols, rows } = getGridDimensions()
    const totalPairs = (cols * rows) / 2

    // Perfect game would be totalPairs moves
    if (moves <= totalPairs * 1.2) return 3
    if (moves <= totalPairs * 1.6) return 2
    return 1
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold mb-4">Memory Game</h1>

      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-center">Select Difficulty</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setDifficulty("easy")}
                className={`${difficulty === "easy" ? "bg-purple-600" : "bg-zinc-700"}`}
              >
                Easy
              </Button>
              <Button
                onClick={() => setDifficulty("medium")}
                className={`${difficulty === "medium" ? "bg-purple-600" : "bg-zinc-700"}`}
              >
                Medium
              </Button>
              <Button
                onClick={() => setDifficulty("hard")}
                className={`${difficulty === "hard" ? "bg-purple-600" : "bg-zinc-700"}`}
              >
                Hard
              </Button>
            </div>
          </div>

          <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700">
            Start Game
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between w-full max-w-md">
            <div>Moves: {moves}</div>
            <div>
              Pairs: {matchedPairs} / {cards.length / 2}
            </div>
          </div>

          <div
            className="grid gap-2 mb-4"
            style={{
              gridTemplateColumns: `repeat(4, 1fr)`,
              width: `${Math.min(4 * 70 + 3 * 8, 400)}px`,
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className={`
                  w-16 h-16 flex items-center justify-center text-2xl 
                  rounded-md cursor-pointer ${getCardColor(card)}
                  ${card.matched || card.flipped ? "" : "hover:bg-zinc-600"}
                `}
                onClick={() => handleCardClick(card.id)}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  style={{
                    transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0)",
                    opacity: card.flipped || card.matched ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                >
                  {card.value}
                </div>
              </motion.div>
            ))}
          </div>

          {gameOver && (
            <div className="bg-zinc-800 p-4 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">Game Complete!</h2>
              <p className="mb-2">You completed the game in {moves} moves</p>
              <div className="flex justify-center mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="text-2xl">
                    {i < getStarRating() ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
              <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700 mr-2">
                Play Again
              </Button>
              <Button onClick={() => setGameStarted(false)} className="bg-zinc-700 hover:bg-zinc-600">
                Change Difficulty
              </Button>
            </div>
          )}

          {!gameOver && (
            <Button onClick={() => setGameStarted(false)} className="bg-zinc-700 hover:bg-zinc-600">
              Restart
            </Button>
          )}
        </>
      )}
    </div>
  )
}

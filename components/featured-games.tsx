"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"

type Game = {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
}

export default function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Fetch games from API
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games")
        if (response.ok) {
          const allGames = await response.json()
          // Select a few games to feature
          const featuredGames = allGames
            .sort(() => 0.5 - Math.random()) // Shuffle the games
            .slice(0, 5) // Take the first 5
          setGames(featuredGames)
        }
      } catch (error) {
        console.error("Failed to fetch featured games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()

    // Auto-rotate featured games
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (games.length || 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [games.length])

  const nextGame = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length)
  }

  const prevGame = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length)
  }

  if (loading || games.length === 0) {
    return (
      <Card className="w-full h-64 bg-zinc-800 border-zinc-700 animate-pulse flex items-center justify-center">
        <p className="text-zinc-500">Loading featured games...</p>
      </Card>
    )
  }

  const currentGame = games[currentIndex]

  return (
    <Card className="w-full overflow-hidden bg-zinc-800 border-zinc-700 relative">
      <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
        <Star className="h-3.5 w-3.5" />
        Featured Game
      </div>

      <div className="relative h-64 md:h-80">
        <img
          src={currentGame.thumbnail || "/placeholder.svg"}
          alt={currentGame.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{currentGame.title}</h2>
          <p className="text-zinc-300 mb-4 line-clamp-2">{currentGame.description}</p>
          <div className="flex items-center gap-3">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push(`/games/${currentGame.id}`)}
            >
              Play Now
            </Button>
            <span className="inline-block text-xs bg-zinc-700/80 text-zinc-300 px-2 py-1 rounded-full capitalize">
              {currentGame.category}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 hover:bg-black/50 text-white"
          onClick={prevGame}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 hover:bg-black/50 text-white"
          onClick={nextGame}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
        {games.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-emerald-500" : "bg-zinc-600"}`}
            animate={{ scale: index === currentIndex ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PLAYABLE_GAMES } from "@/components/playable-games"
import { processedGames } from "@/lib/game-data"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const [isLoading, setIsLoading] = useState(true)

  // Find the game data
  const gameData = processedGames.find((g) => g.id === gameId)

  // Check if we have a built-in playable version of this game
  const PlayableGame = PLAYABLE_GAMES[gameId]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!gameData) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" className="hover:bg-zinc-800" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          <h1 className="text-xl font-bold">{gameData.title}</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
          <div className="aspect-video w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : PlayableGame ? (
              <div className="w-full h-full">
                <PlayableGame />
              </div>
            ) : (
              <iframe
                src={gameData.url}
                title={gameData.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">About {gameData.title}</h2>
          <p className="text-zinc-400 mb-4">{gameData.description}</p>
          <div className="flex gap-2">
            <span className="inline-block text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full capitalize">
              {gameData.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

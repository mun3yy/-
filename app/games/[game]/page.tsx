"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Maximize, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// This will be replaced with the actual games from the zip file
type Game = {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  category: string
  screenshots: string[]
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.game as string
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Fetch game data
    const fetchGame = async () => {
      try {
        const response = await fetch("/api/games")
        if (response.ok) {
          const games = await response.json()
          const foundGame = games.find((g: Game) => g.id === gameId)
          setGame(foundGame || null)
        }
      } catch (error) {
        console.error("Failed to fetch game:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [gameId])

  const toggleFullscreen = async () => {
    const gameContainer = document.getElementById("game-container")
    if (!isFullscreen) {
      try {
        if (gameContainer) {
          await gameContainer.requestFullscreen()
        }
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err)
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen()
        }
      } catch (err) {
        console.error("Error attempting to exit fullscreen:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="mt-2">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Game Not Found</h1>
          <p className="text-zinc-400 mb-4">The game "{gameId}" is not available.</p>
          <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-4 hover:bg-zinc-800" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
              <div id="game-container" className="aspect-video w-full relative">
                <iframe
                  src={game.url}
                  className="w-full h-full border-0"
                  title={game.title}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg" onClick={toggleFullscreen}>
                    <Maximize className="mr-2 h-4 w-4" />
                    Fullscreen
                  </Button>
                  <Button
                    className="bg-zinc-700 hover:bg-zinc-600 shadow-lg"
                    onClick={() => window.open(game.url, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    New Tab
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <h1 className="text-xl font-bold mb-2">{game.title}</h1>
              <span className="inline-block mb-3 text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full capitalize">
                {game.category}
              </span>
              <p className="text-zinc-400">{game.description}</p>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Screenshots</h2>
              <div className="grid grid-cols-2 gap-2">
                {game.screenshots.map((screenshot, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt={`${game.title} screenshot ${index + 1}`}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

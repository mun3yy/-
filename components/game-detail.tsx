"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Gamepad2, X, Maximize, Minimize } from "lucide-react"
import { PLAYABLE_GAMES } from "./playable-games"

type Game = {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  category: string
  screenshots: string[]
}

interface GameDetailProps {
  game: Game
  onClose: () => void
}

export default function GameDetail({ game, onClose }: GameDetailProps) {
  const [activeTab, setActiveTab] = useState<"play" | "screenshots">("play")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen()
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

  // Check if we have a built-in playable version of this game
  const PlayableGame = PLAYABLE_GAMES[game.id]

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-zinc-700 bg-zinc-900">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-emerald-500" />
          <h3 className="font-semibold">{game.title}</h3>
          {game.category && (
            <span className="inline-block text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full capitalize">
              {game.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-zinc-700"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-700" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "play" | "screenshots")}>
        <TabsList className="w-full justify-start p-3 bg-zinc-800 border-b border-zinc-700">
          <TabsTrigger value="play" className="data-[state=active]:bg-purple-600">
            Play Game
          </TabsTrigger>
          <TabsTrigger value="screenshots" className="data-[state=active]:bg-purple-600">
            Screenshots
          </TabsTrigger>
        </TabsList>

        <TabsContent value="play" className="p-0 m-0">
          <div className={`${isFullscreen ? "h-[calc(100vh-96px)]" : "aspect-video"} w-full relative`}>
            {PlayableGame ? (
              <div className="w-full h-full">
                <PlayableGame />
              </div>
            ) : (
              <iframe
                src={game.url}
                title={game.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="screenshots" className="p-0 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {game.screenshots && game.screenshots.length > 0 ? (
              game.screenshots.map((screenshot, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-zinc-700">
                  <img
                    src={
                      screenshot ||
                      `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(game.title) || "/placeholder.svg"} Screenshot ${index + 1}`
                    }
                    alt={`${game.title} screenshot ${index + 1}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-40 bg-zinc-700 rounded-lg">
                <p className="text-zinc-400">No screenshots available</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-zinc-700">
            <h4 className="font-medium mb-2">About this game</h4>
            <p className="text-zinc-400">{game.description}</p>
          </div>
          <div className="p-4 flex justify-center">
            <Button
              onClick={() => setActiveTab("play")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Play Now
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

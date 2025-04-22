"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { processedGames } from "@/lib/game-data"

export default function GamesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [games, setGames] = useState(processedGames)
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(games.map((game) => game.category)))].filter(Boolean)

  // Filter games by search term and category
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || game.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleGameClick = (gameId: string) => {
    router.push(`/play/${gameId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <Input
            placeholder="Search games..."
            className="pl-10 bg-zinc-800 border-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto p-1">
            {categories.slice(0, 8).map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onClick={() => handleGameClick(game.id)} />
          ))}

          {filteredGames.length === 0 && (
            <div className="col-span-full text-center py-10 text-zinc-400">
              {searchTerm
                ? `No games found matching "${searchTerm}"`
                : `No games found in the "${activeCategory}" category`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-zinc-800 border-zinc-700">
      <div className="aspect-video bg-zinc-700 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-zinc-700 rounded animate-pulse" />
        <div className="h-4 bg-zinc-700 rounded animate-pulse w-3/4" />
      </div>
    </Card>
  )
}

function GameCard({
  game,
  index,
  onClick,
}: {
  game: (typeof processedGames)[0]
  index: number
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card
        className="overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 bg-zinc-800 border-zinc-700 group"
        onClick={onClick}
      >
        <div className="aspect-video bg-zinc-700 relative overflow-hidden">
          <img
            src={game.thumbnail || "/placeholder.svg"}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 w-full">
              <span className="text-white font-medium">Play Now</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">{game.title}</h3>
          <p className="text-zinc-400 text-sm line-clamp-2">{game.description}</p>
          {game.category && (
            <span className="inline-block mt-2 text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full capitalize">
              {game.category}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, X, Brain, Calculator, Book, Pencil, Code, Bot } from "lucide-react"

// List of apps for cheating and tools
const APPS = [
  {
    id: "chatgpt",
    title: "AI Assistant",
    description: "Get homework help and answers",
    icon: <Brain className="h-8 w-8 text-emerald-500" />,
    url: "/apps/ai-assistant",
  },
  {
    id: "calculator",
    title: "Advanced Calculator",
    description: "Scientific calculator with step-by-step solutions",
    icon: <Calculator className="h-8 w-8 text-emerald-500" />,
    url: "/apps/calculator",
  },
  {
    id: "essaygenerator",
    title: "Essay Generator",
    description: "Generate essays on any topic",
    icon: <Pencil className="h-8 w-8 text-emerald-500" />,
    url: "/apps/essay-generator",
  },
  {
    id: "summarizer",
    title: "Text Summarizer",
    description: "Summarize long texts quickly",
    icon: <Book className="h-8 w-8 text-emerald-500" />,
    url: "/apps/summarizer",
  },
  {
    id: "codehelper",
    title: "Code Helper",
    description: "Get help with programming assignments",
    icon: <Code className="h-8 w-8 text-emerald-500" />,
    url: "/apps/code-helper",
  },
  {
    id: "mathsolver",
    title: "Math Problem Solver",
    description: "Solve complex math problems with steps",
    icon: <Bot className="h-8 w-8 text-emerald-500" />,
    url: "/apps/math-solver",
  },
]

export default function AppsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const filteredApps = APPS.filter(
    (app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
        <Input
          placeholder="Search apps..."
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

      {selectedApp ? (
        <AppFrame app={APPS.find((a) => a.id === selectedApp)!} onClose={() => setSelectedApp(null)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredApps.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} onClick={() => setSelectedApp(app.id)} />
          ))}

          {filteredApps.length === 0 && (
            <div className="col-span-full text-center py-10 text-zinc-400">No apps found matching "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  )
}

function AppCard({
  app,
  index,
  onClick,
}: {
  app: (typeof APPS)[0]
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
        className="overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 bg-zinc-800 border-zinc-700 p-4"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-zinc-700/50 rounded-lg">{app.icon}</div>
          <div>
            <h3 className="font-semibold text-lg">{app.title}</h3>
            <p className="text-zinc-400 text-sm">{app.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function AppFrame({
  app,
  onClose,
}: {
  app: (typeof APPS)[0]
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-700/50 rounded-lg">{app.icon}</div>
          <h3 className="font-semibold">{app.title}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-700 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[70vh] w-full">
        <iframe
          src={app.url}
          className="w-full h-full border-0"
          title={app.title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </motion.div>
  )
}

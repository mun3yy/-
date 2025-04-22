"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Settings,
  GamepadIcon as GameController,
  AppWindowIcon as Apps,
  Globe,
  Bot,
  LogOut,
  BookOpen,
  DollarSign,
} from "lucide-react"
import IntroAnimation from "@/components/intro-animation"
import GamesList from "@/components/games-list"
import AppsList from "@/components/apps-list"
import ProxyBrowser from "@/components/proxy-browser"
import FeaturedGames from "@/components/featured-games"
import ChatGPTInterface from "@/components/chatgpt-interface"
import InteractiveBackground from "@/components/interactive-background"
import ParticleBackground from "@/components/particle-background"
import dynamic from "next/dynamic"

// Dynamically import UltravioletRegister with no SSR to prevent errors
const UltravioletRegister = dynamic(() => import("@/components/ultraviolet-register"), {
  ssr: false,
})

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [activeTab, setActiveTab] = useState("games")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true)

    // Simulate loading time for intro animation
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const handleExplore = () => {
    setShowContent(true)
  }

  const handleExit = () => {
    window.location.href = "https://www.google.com"
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      {/* Register Ultraviolet service worker only on client side */}
      {isClient && <UltravioletRegister />}

      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IntroAnimation />
          </motion.div>
        ) : showContent ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 container mx-auto p-4 md:p-6 relative"
          >
            {/* Interactive background with purple hints and mouse-following particles */}
            <InteractiveBackground intensity="medium" />

            <header className="mb-6 relative z-10 flex justify-between items-center">
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-center text-emerald-500 tracking-tight my-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                $MUNNY PROXY$
              </motion.h1>

              <Button
                variant="outline"
                className="bg-purple-700 hover:bg-purple-800 text-white border-purple-500 transition-all hover:scale-105 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                onClick={handleExit}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Exit Site
              </Button>
            </header>

            <Tabs defaultValue="games" className="w-full relative z-10" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="games" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
                  <GameController className="h-4 w-4" />
                  <span className="hidden sm:inline">Games</span>
                </TabsTrigger>
                <TabsTrigger value="apps" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
                  <Apps className="h-4 w-4" />
                  <span className="hidden sm:inline">Apps</span>
                </TabsTrigger>
                <TabsTrigger value="proxy" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Proxy</span>
                </TabsTrigger>
                <TabsTrigger value="chatgpt" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">ChatGPT</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="space-y-6">
                <FeaturedGames />
                <GamesList />
              </TabsContent>

              <TabsContent value="apps" className="space-y-4">
                <AppsList />
              </TabsContent>

              <TabsContent value="proxy" className="space-y-4">
                <ProxyBrowser />
              </TabsContent>

              <TabsContent value="chatgpt" className="space-y-4">
                <ChatGPTInterface />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card className="p-6 bg-zinc-800 border-zinc-700">
                  <h2 className="text-xl font-semibold mb-4">Cloaking Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="tab-cloak" className="text-base font-medium">
                          Tab Cloaking
                        </Label>
                        <p className="text-sm text-zinc-400">Change how this site appears in your browser tab</p>
                      </div>
                      <Switch id="tab-cloak" onCheckedChange={handleTabCloak} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tab-title">Tab Title</Label>
                      <Input
                        id="tab-title"
                        placeholder="Google Classroom"
                        className="bg-zinc-700 border-zinc-600"
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tab-icon">Tab Icon URL</Label>
                      <Input
                        id="tab-icon"
                        placeholder="https://www.google.com/favicon.ico"
                        className="bg-zinc-700 border-zinc-600"
                        onChange={(e) => handleIconChange(e.target.value)}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="default"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={openInAboutBlank}
                      >
                        Open in about:blank
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ParticleBackground />

            <motion.div
              className="text-center max-w-md relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="mb-6 flex justify-center"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <DollarSign className="h-24 w-24 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-emerald-500 mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                $MUNNY PROXY$
              </motion.h1>

              <motion.p
                className="text-zinc-200 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Your ultimate unblocked games and proxy solution
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105 border-none shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  onClick={handleExplore}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore The Library
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-6 text-lg bg-purple-700 hover:bg-purple-800 text-white border-purple-500 transition-all hover:scale-105 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                  onClick={handleExit}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Exit Site
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tab cloaking functionality
function handleTabCloak(checked: boolean) {
  if (checked) {
    const savedTitle = localStorage.getItem("cloakedTitle") || "Google Classroom"
    const savedIcon = localStorage.getItem("cloakedIcon") || "https://www.google.com/favicon.ico"

    document.title = savedTitle
    setFavicon(savedIcon)
  } else {
    document.title = "$MUNNY PROXY$"
    setFavicon("/favicon.ico")
  }
}

function handleTitleChange(title: string) {
  if (title) {
    localStorage.setItem("cloakedTitle", title)
    if (document.getElementById("tab-cloak") && (document.getElementById("tab-cloak") as HTMLInputElement).checked) {
      document.title = title
    }
  }
}

function handleIconChange(iconUrl: string) {
  if (iconUrl) {
    localStorage.setItem("cloakedIcon", iconUrl)
    if (document.getElementById("tab-cloak") && (document.getElementById("tab-cloak") as HTMLInputElement).checked) {
      setFavicon(iconUrl)
    }
  }
}

function setFavicon(iconUrl: string) {
  const link = document.querySelector("link[rel*='icon']") || document.createElement("link")
  link.setAttribute("rel", "shortcut icon")
  link.setAttribute("href", iconUrl)
  document.head.appendChild(link)
}

function openInAboutBlank() {
  const newWindow = window.open("about:blank", "_blank")
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${localStorage.getItem("cloakedTitle") || "Google Classroom"}</title>
          <link rel="shortcut icon" href="${localStorage.getItem("cloakedIcon") || "https://www.google.com/favicon.ico"}">
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${window.location.href}"></iframe>
        </body>
      </html>
    `)
    newWindow.document.close()
  }
}

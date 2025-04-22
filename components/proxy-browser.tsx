"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, RefreshCw, ArrowLeft, ArrowRight, X, Home } from "lucide-react"
import { UV_CONFIG } from "@/lib/ultraviolet-config"

export default function ProxyBrowser() {
  const [url, setUrl] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    let processedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = "https://" + url
    }

    navigateTo(processedUrl)
  }

  const navigateTo = (url: string) => {
    setLoading(true)

    // Update history
    const newHistory = [...history.slice(0, historyIndex + 1), url]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    // Set current URL
    setCurrentUrl(url)
    setUrl(url)

    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentUrl(history[historyIndex - 1])
      setUrl(history[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentUrl(history[historyIndex + 1])
      setUrl(history[historyIndex + 1])
    }
  }

  const refresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const goHome = () => {
    setUrl("")
    setCurrentUrl("")
    setLoading(false)
  }

  // Process the URL through Ultraviolet
  const processedUrl = currentUrl ? UV_CONFIG.encodeUrl(currentUrl) : ""

  return (
    <Card className="bg-zinc-800 border-zinc-700 overflow-hidden">
      <div className="p-3 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={goBack}
            disabled={historyIndex <= 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={refresh}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goHome}>
            <Home className="h-4 w-4" />
          </Button>

          <form onSubmit={handleSubmit} className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Enter URL..."
              className="pl-10 pr-10 bg-zinc-700 border-zinc-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {url && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                onClick={() => setUrl("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="h-[70vh] w-full bg-white relative">
        {!currentUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400">
            <Globe className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg">Enter a URL to start browsing</p>
            <p className="text-sm mt-2">The proxy will help you access blocked websites</p>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
                  <p className="mt-2 text-zinc-800">Loading...</p>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                <iframe
                  src={processedUrl}
                  className="w-full h-full border-0"
                  title="Proxy Browser"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { UV_CONFIG } from "@/lib/ultraviolet-config"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GameProxyProps {
  url: string
  title: string
}

export default function GameProxy({ url, title }: GameProxyProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proxyUrl, setProxyUrl] = useState("")

  useEffect(() => {
    try {
      // Process the URL through Ultraviolet if it's an external URL
      if (url.startsWith("http")) {
        setProxyUrl(UV_CONFIG.encodeUrl(url))
      } else {
        setProxyUrl(url)
      }
    } catch (err) {
      console.error("Error processing URL:", err)
      setError("Failed to process game URL. Please try again later.")
      setLoading(false)
    }
  }, [url])

  const handleIframeLoad = () => {
    setLoading(false)
  }

  const handleIframeError = () => {
    setLoading(false)
    setError("Failed to load the game. Please try again later.")
  }

  const retryLoading = () => {
    setLoading(true)
    setError(null)
    // Force a refresh of the iframe
    setProxyUrl("")
    setTimeout(() => {
      if (url.startsWith("http")) {
        setProxyUrl(UV_CONFIG.encodeUrl(url))
      } else {
        setProxyUrl(url)
      }
    }, 100)
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
            <p className="mt-4 text-zinc-300">Loading {title}...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800 z-10">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-zinc-300 mb-4">{error}</p>
          <Button onClick={retryLoading} className="bg-purple-600 hover:bg-purple-700">
            Try Again
          </Button>
        </div>
      )}

      {proxyUrl && !error && (
        <iframe
          src={proxyUrl}
          title={title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  )
}

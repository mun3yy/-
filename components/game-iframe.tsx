"use client"

import { useState, useRef, useEffect } from "react"
import { Maximize, Minimize, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UV_CONFIG } from "@/lib/ultraviolet-config"

interface GameIframeProps {
  url: string
  title: string
}

export default function GameIframe({ url, title }: GameIframeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Process the URL through Ultraviolet if it's an external URL
  const processedUrl = url.startsWith("http") ? UV_CONFIG.encodeUrl(url) : url

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

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "aspect-video w-full"}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-zinc-600 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading game...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={processedUrl}
        className="w-full h-full border-0"
        title={title}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={handleIframeLoad}
      />

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <Minimize className="mr-2 h-4 w-4" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="mr-2 h-4 w-4" />
              Fullscreen
            </>
          )}
        </Button>
        <Button className="bg-zinc-700 hover:bg-zinc-600 shadow-lg" onClick={() => window.open(processedUrl, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          New Tab
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { UV_CONFIG } from "@/lib/ultraviolet-config"

// Add TypeScript declaration for the __uv global variable
declare global {
  interface Window {
    __uv?: {
      config: {
        prefix: string
        bare: string
        encodeUrl: (url: string) => string
        decodeUrl: (url: string) => string
      }
    }
  }
}

export default function UltravioletRegister() {
  useEffect(() => {
    // Register Ultraviolet service worker
    const registerUV = async () => {
      try {
        // Check if scripts already exist to prevent duplicate loading
        if (!document.querySelector('script[src="/uv/client"]')) {
          // Load the client script
          const uvClient = document.createElement("script")
          uvClient.src = "/uv/client"
          document.head.appendChild(uvClient)
        }

        if (!document.querySelector('script[src="/uv/bundle"]')) {
          // Load the bundle script
          const uvBundle = document.createElement("script")
          uvBundle.src = "/uv/bundle"
          document.head.appendChild(uvBundle)
        }

        // Wait for scripts to load
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Register the service worker only if the scripts loaded properly
        if (typeof window.__uv !== "undefined") {
          window.__uv.config = {
            prefix: UV_CONFIG.prefix,
            bare: UV_CONFIG.bare,
            encodeUrl: UV_CONFIG.encodeUrl,
            decodeUrl: UV_CONFIG.decodeUrl,
          }

          // Register service worker
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker
              .register("/uv/service-worker", {
                scope: UV_CONFIG.prefix,
              })
              .then(() => {
                console.log("Ultraviolet service worker registered")
              })
              .catch((err) => {
                console.error("Failed to register Ultraviolet service worker:", err)
              })
          }
        } else {
          console.warn("Ultraviolet client not loaded properly, will retry later")
          // Don't throw an error, just log a warning
        }
      } catch (error) {
        console.error("Error setting up Ultraviolet:", error)
        // Don't rethrow the error, just log it
      }
    }

    // Try to register UV but don't break the app if it fails
    registerUV().catch((err) => {
      console.error("Failed to register Ultraviolet:", err)
    })
  }, [])

  return null
}

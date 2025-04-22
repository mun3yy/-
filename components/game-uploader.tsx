"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Check, AlertCircle } from "lucide-react"

export default function GameUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus("idle")
      setMessage("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus("idle")
    setMessage("")

    try {
      // In a real implementation, this would:
      // 1. Upload the zip file to the server
      // 2. Extract the games and add them to the system
      // 3. Return the result

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStatus("success")
      setMessage(`Successfully added games from ${file.name}`)
    } catch (error) {
      setStatus("error")
      setMessage("Failed to upload games. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="p-6 bg-zinc-800 border-zinc-700">
      <h2 className="text-xl font-semibold mb-4">Add HTML Games</h2>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
          <Upload className="h-10 w-10 text-zinc-500 mx-auto mb-2" />
          <p className="text-zinc-400 mb-2">Drag and drop a zip file or click to browse</p>
          <Input type="file" accept=".zip" onChange={handleFileChange} className="hidden" id="game-zip-upload" />
          <Button
            variant="outline"
            className="border-zinc-700"
            onClick={() => document.getElementById("game-zip-upload")?.click()}
          >
            Select Zip File
          </Button>
          {file && (
            <p className="mt-2 text-sm text-zinc-400">
              Selected: <span className="text-emerald-500">{file.name}</span>
            </p>
          )}
        </div>

        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-3 rounded-lg">
            <Check className="h-5 w-5" />
            <p>{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{message}</p>
          </div>
        )}

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload and Add Games"}
        </Button>
      </div>
    </Card>
  )
}

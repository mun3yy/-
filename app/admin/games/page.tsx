"use client"

import { useState } from "react"
import GameUploader from "@/components/game-uploader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminGamesPage() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Game Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload Games</TabsTrigger>
          <TabsTrigger value="manage">Manage Games</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <GameUploader />

          <Card className="p-6 bg-zinc-800 border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-2 text-zinc-400">
              <p>To add games to the system:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Prepare a zip file containing your HTML games</li>
                <li>Each game should be in its own folder</li>
                <li>Include screenshots of the gameplay in each folder</li>
                <li>Upload the zip file using the form above</li>
              </ol>
              <p className="mt-4">The system will automatically extract and add the games to the library.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card className="p-6 bg-zinc-800 border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Manage Games</h2>
            <p className="text-zinc-400 mb-4">View, edit, or remove games from the library.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">View All Games</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

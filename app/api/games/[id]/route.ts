import { NextResponse } from "next/server"
import { processedGames } from "@/lib/game-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const game = processedGames.find((g) => g.id === id)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  return NextResponse.json(game)
}

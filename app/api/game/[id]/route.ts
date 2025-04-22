import { type NextRequest, NextResponse } from "next/server"
import { games } from "@/lib/game-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const gameId = params.id

  // Find the game by ID
  const game = games.find((g) => g.id === gameId)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  return NextResponse.json(game)
}

import { NextResponse } from "next/server"
import { processedGames } from "@/lib/game-data"

export async function GET() {
  return NextResponse.json(processedGames)
}

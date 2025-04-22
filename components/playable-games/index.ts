import type React from "react"
import TicTacToe from "./tic-tac-toe"
import SnakeGame from "./snake-game"
import FlappyBird from "./flappy-bird"
import Tetris from "./tetris"
import Minesweeper from "./minesweeper"
import PacMan from "./pac-man"
import MemoryGame from "./memory-game"
import ConnectFour from "./connect-four"
import Wordle from "./wordle"
import Pong from "./pong"

// Map of game IDs to their component implementations
export const PLAYABLE_GAMES: Record<string, React.ComponentType> = {
  "tic-tac-toe": TicTacToe,
  snake: SnakeGame,
  "flappy-bird": FlappyBird,
  tetris: Tetris,
  minesweeper: Minesweeper,
  pacman: PacMan,
  "memory-game": MemoryGame,
  "connect-four": ConnectFour,
  wordle: Wordle,
  pong: Pong,
}

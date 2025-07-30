import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import type { Player } from "@/app/page"

interface PlayerCardProps {
  player: Player
  isCurrentPlayer: boolean
  gameStatus: "playing" | "won" | "lost"
  guessCount: number
}

export function PlayerCard({ player, isCurrentPlayer, gameStatus, guessCount }: PlayerCardProps) {
  const statusText = gameStatus === "won" ? "Won" : gameStatus === "lost" ? "Lost" : "Playing"
  const cardLabel = `${player.name}${player.isHost ? " (Host)" : ""}${isCurrentPlayer ? " (You)" : ""}: ${guessCount} of 6 guesses used, Status: ${statusText}`

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isCurrentPlayer ? "bg-blue-600/20 border-blue-400/50" : "bg-white/5 border-white/10"
      }`}
      role="region"
      aria-label={cardLabel}
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl"
          role="img"
          aria-label={`Player avatar: ${player.emoji}`}
        >
          {player.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold">{player.name}</p>
            {player.isHost && (
              <>
                <Crown className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span className="sr-only">Host</span>
              </>
            )}
            {isCurrentPlayer && (
              <Badge variant="secondary" className="text-xs">
                You
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-400 text-sm" aria-label={`${guessCount} guesses used out of 6`}>
              Guesses: {guessCount}/6
            </p>
            {gameStatus !== "playing" && (
              <Badge
                variant={gameStatus === "won" ? "default" : "destructive"}
                className="text-xs"
                aria-label={`Game result: ${statusText}`}
              >
                {gameStatus === "won" ? "Won!" : "Lost"}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

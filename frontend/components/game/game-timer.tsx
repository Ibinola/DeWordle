"use client"

import { useEffect } from "react"
import { useDifficulty } from "@/contexts/difficulty-context"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle } from "lucide-react"

interface GameTimerProps {
  gameStatus: "playing" | "won" | "lost"
}

export function GameTimer({ gameStatus }: GameTimerProps) {
  const { state, dispatch } = useDifficulty()

  useEffect(() => {
    if (gameStatus === "playing" && state.settings.timeLimit) {
      dispatch({ type: "START_TIMER" })
    } else {
      dispatch({ type: "STOP_TIMER" })
    }
  }, [gameStatus, state.settings.timeLimit, dispatch])

  if (!state.settings.timeLimit) {
    return null
  }

  const timeRemaining = Math.max(0, state.settings.timeLimit - state.timeElapsed)
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const progressPercentage = ((state.settings.timeLimit - timeRemaining) / state.settings.timeLimit) * 100

  const isLowTime = timeRemaining <= 30 && timeRemaining > 0
  const isTimeUp = timeRemaining === 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
        <Badge
          variant={isTimeUp ? "destructive" : isLowTime ? "secondary" : "outline"}
          className={isLowTime ? "animate-pulse" : ""}
        >
          {isTimeUp ? (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Time's Up!
            </div>
          ) : (
            `${minutes}:${seconds.toString().padStart(2, "0")}`
          )}
        </Badge>
      </div>

      <Progress value={progressPercentage} className={`h-2 ${isLowTime ? "animate-pulse" : ""}`} />

      {isLowTime && !isTimeUp && (
        <div className="text-xs text-orange-600 text-center animate-pulse">⚠️ Less than 30 seconds remaining!</div>
      )}
    </div>
  )
}

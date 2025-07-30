"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Target, Trophy, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GameSession } from "@/types/stats"
import { statsStorage } from "@/lib/stats-storage"

interface GameReplayProps {
  session: GameSession
}

function GameReplay({ session }: GameReplayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const playReplay = () => {
    if (isPlaying) return

    setIsPlaying(true)
    setCurrentStep(0)

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= session.guesses.length) {
          clearInterval(interval)
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1000)
  }

  const getLetterStatus = (letter: string, position: number, word: string) => {
    if (word[position]?.toLowerCase() === letter.toLowerCase()) {
      return "correct"
    } else if (word.toLowerCase().includes(letter.toLowerCase())) {
      return "present"
    } else {
      return "absent"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-500 text-white"
      case "present":
        return "bg-yellow-500 text-white"
      case "absent":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-100 border-2 border-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Game Replay</h4>
        <Button size="sm" onClick={playReplay} disabled={isPlaying} className="flex items-center gap-1">
          <Play className="h-3 w-3" />
          {isPlaying ? "Playing..." : "Replay"}
        </Button>
      </div>

      <div className="space-y-2">
        {session.guesses.map((guess, guessIndex) => (
          <div
            key={guessIndex}
            className={`flex gap-1 justify-center transition-opacity duration-500 ${
              guessIndex < currentStep ? "opacity-100" : "opacity-30"
            }`}
          >
            {guess.split("").map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded ${
                  guessIndex < currentStep
                    ? getStatusColor(getLetterStatus(letter, letterIndex, session.word))
                    : "bg-gray-100"
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Step {currentStep} of {session.guesses.length}
      </div>
    </div>
  )
}

export function GameHistoryViewer() {
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<GameSession[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [resultFilter, setResultFilter] = useState<string>("all")
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null)

  useEffect(() => {
    if (isOpen) {
      const gameSessions = statsStorage.getGameSessions()
      setSessions(gameSessions)
      setFilteredSessions(gameSessions)
    }
  }, [isOpen])

  useEffect(() => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter((session) => session.word.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((session) => session.difficulty === difficultyFilter)
    }

    if (resultFilter !== "all") {
      const won = resultFilter === "won"
      filtered = filtered.filter((session) => session.won === won)
    }

    setFilteredSessions(filtered)
  }, [sessions, searchTerm, difficultyFilter, resultFilter])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "hard":
        return "bg-orange-100 text-orange-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Game History</DialogTitle>
          <DialogDescription>Review your past games and replay them</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 h-[70vh]">
          {/* Game List */}
          <div className="flex-1 space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <Input
                placeholder="Search by word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Game Sessions List */}
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="space-y-2">
                {filteredSessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSession?.id === session.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{session.word}</span>
                          <Badge className={getDifficultyColor(session.difficulty)}>{session.difficulty}</Badge>
                          <Badge variant={session.won ? "default" : "destructive"}>
                            {session.won ? "Won" : "Lost"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {session.attempts} attempts
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(session.timeElapsed)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {session.score.toLocaleString()} pts
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredSessions.length === 0 && (
                  <div className="text-center text-gray-500 py-8">No games found matching your filters</div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Game Details */}
          {selectedSession && (
            <>
              <Separator orientation="vertical" />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Game Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Word:</span>
                      <span className="font-bold ml-2">{selectedSession.word}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Result:</span>
                      <Badge variant={selectedSession.won ? "default" : "destructive"} className="ml-2">
                        {selectedSession.won ? "Victory" : "Defeat"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-bold ml-2">{selectedSession.attempts}/6</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="font-bold ml-2">{formatDuration(selectedSession.timeElapsed)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <span className="font-bold ml-2">{selectedSession.score.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge className={`ml-2 ${getDifficultyColor(selectedSession.difficulty)}`}>
                        {selectedSession.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <GameReplay session={selectedSession} />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

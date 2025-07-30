"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, Users, Clock, Zap } from "lucide-react"
import { PlayerCard } from "@/components/player-card"
import { WordleGrid } from "@/components/wordle-grid"
import type { Room, Player } from "@/app/page"

interface GameRoomProps {
  room: Room
  currentPlayer: Player
  onLeaveRoom: () => void
}

export function GameRoom({ room, currentPlayer, onLeaveRoom }: GameRoomProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && gameStatus === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameStatus("lost")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleGuessSubmit = (guess: string) => {
    if (guess.length === 5 && !guesses.includes(guess)) {
      const newGuesses = [...guesses, guess]
      setGuesses(newGuesses)

      if (guess === room.word) {
        setGameStatus("won")
      } else if (newGuesses.length >= 6) {
        setGameStatus("lost")
      }

      setCurrentGuess("")
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onLeaveRoom} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave Room
        </Button>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
            Room: {room.code}
          </Badge>
          {gameStarted && (
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Players Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({room.players.length}/2)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {room.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentPlayer={player.id === currentPlayer.id}
                  gameStatus={gameStatus}
                  guessCount={player.id === currentPlayer.id ? guesses.length : Math.floor(Math.random() * 4)}
                />
              ))}

              {room.players.length < 2 && (
                <div className="p-4 border-2 border-dashed border-white/20 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Waiting for player 2...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-4">
            <CardHeader>
              <CardTitle className="text-white text-sm">Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Word Length:</span>
                <span className="text-white">5 letters</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max Guesses:</span>
                <span className="text-white">6</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Blockchain:</span>
                <span className="text-white">StarkNet</span>
              </div>
              {gameStarted && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <Badge
                    variant={gameStatus === "won" ? "default" : gameStatus === "lost" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {gameStatus === "playing" ? "In Progress" : gameStatus === "won" ? "Victory!" : "Game Over"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Dewordle</CardTitle>
              <CardDescription className="text-gray-300">
                {!gameStarted
                  ? "Waiting to start..."
                  : gameStatus === "playing"
                    ? "Guess the 5-letter word!"
                    : gameStatus === "won"
                      ? `Congratulations! The word was ${room.word}`
                      : `Game Over! The word was ${room.word}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!gameStarted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-gray-300 mb-6">
                    {room.players.length < 2 ? "Waiting for another player to join..." : "Ready to start the game!"}
                  </p>
                  {currentPlayer.isHost && room.players.length >= 2 && (
                    <Button
                      onClick={handleStartGame}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      size="lg"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Start Game
                    </Button>
                  )}
                  {!currentPlayer.isHost && (
                    <p className="text-gray-400 text-sm">Waiting for host to start the game...</p>
                  )}
                </div>
              ) : (
                <WordleGrid
                  word={room.word}
                  guesses={guesses}
                  currentGuess={currentGuess}
                  onGuessChange={setCurrentGuess}
                  onGuessSubmit={handleGuessSubmit}
                  gameStatus={gameStatus}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

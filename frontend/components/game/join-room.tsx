"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn, Users, AlertCircle } from "lucide-react"
import { PlayerSetup } from "@/components/player-setup"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Room, Player } from "@/app/page"

interface JoinRoomProps {
  onBack: () => void
  onRoomJoined: (room: Room, player: Player) => void
}

export function JoinRoom({ onBack, onRoomJoined }: JoinRoomProps) {
  const [step, setStep] = useState<"code" | "setup">("code")
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateRoomCode = async (code: string) => {
    setIsLoading(true)
    setError("")

    // Simulate API call to validate room code
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation - in real app, this would check against your backend/blockchain
    if (code.length === 6 && /^[A-Z0-9]+$/.test(code)) {
      setStep("setup")
    } else {
      setError("Invalid room code. Please check and try again.")
    }

    setIsLoading(false)
  }

  const handleJoinRoom = (playerData: { name: string; emoji: string }) => {
    // Mock room data - in real app, this would come from your backend
    const mockRoom: Room = {
      id: `room-${roomCode}`,
      code: roomCode,
      word: "STARK", // This would be synced from the host
      players: [
        {
          id: "host-player",
          name: "Host Player",
          emoji: "🎮",
          isHost: true,
        },
      ],
      createdAt: new Date(),
    }

    const newPlayer: Player = {
      id: "player-2",
      name: playerData.name,
      emoji: playerData.emoji,
      isHost: false,
    }

    // Add the new player to the room
    mockRoom.players.push(newPlayer)

    onRoomJoined(mockRoom, newPlayer)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Lobby
      </Button>

      {step === "code" && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Join a Game Room</CardTitle>
            <CardDescription className="text-gray-300">Enter the room code shared by your friend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roomCode" className="text-white">
                Room Code
              </Label>
              <Input
                id="roomCode"
                placeholder="Enter 6-character room code"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase())
                  setError("")
                }}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-center text-lg font-mono tracking-wider"
                maxLength={6}
              />
            </div>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => validateRoomCode(roomCode)}
              disabled={roomCode.length !== 6 || isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Validating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Join Room
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">Room codes are 6 characters long and contain letters and numbers</p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "setup" && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Set Up Your Player</CardTitle>
            <CardDescription className="text-gray-300">Choose your name and emoji for the game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white text-sm">
                <span className="font-semibold">Joining room:</span> {roomCode}
              </p>
            </div>
            <PlayerSetup onComplete={handleJoinRoom} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

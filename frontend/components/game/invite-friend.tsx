"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Share, Users, Sparkles } from "lucide-react"
import { RoomCode } from "@/components/room-code"
import { PlayerSetup } from "@/components/player-setup"
import { useToast } from "@/hooks/use-toast"
import type { Room, Player } from "@/app/page"

interface InviteFriendProps {
  onBack: () => void
  onRoomCreated: (room: Room, player: Player) => void
}

export function InviteFriend({ onBack, onRoomCreated }: InviteFriendProps) {
  const [step, setStep] = useState<"setup" | "created">("setup")
  const [room, setRoom] = useState<Room | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const { toast } = useToast()

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const generateWord = () => {
    const words = ["STARK", "CHAIN", "BLOCK", "PROOF", "LAYER", "SCALE", "SMART", "TOKEN"]
    return words[Math.floor(Math.random() * words.length)]
  }

  const handleCreateRoom = (playerData: { name: string; emoji: string }) => {
    const roomCode = generateRoomCode()
    const word = generateWord()

    const newPlayer: Player = {
      id: "player-1",
      name: playerData.name,
      emoji: playerData.emoji,
      isHost: true,
    }

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      code: roomCode,
      word: word,
      players: [newPlayer],
      createdAt: new Date(),
    }

    setRoom(newRoom)
    setPlayer(newPlayer)
    setStep("created")
  }

  const handleStartGame = () => {
    if (room && player) {
      onRoomCreated(room, player)
    }
  }

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code)
      toast({
        title: "Room code copied!",
        description: "Share this code with your friend to join the game.",
      })
    }
  }

  const copyInviteLink = () => {
    if (room) {
      const link = `${window.location.origin}?join=${room.code}`
      navigator.clipboard.writeText(link)
      toast({
        title: "Invite link copied!",
        description: "Share this link with your friend to join directly.",
      })
    }
  }

  const shareInvite = async () => {
    if (room && navigator.share) {
      try {
        await navigator.share({
          title: "Join my Dewordle game!",
          text: `I've created a Dewordle room. Use code: ${room.code}`,
          url: `${window.location.origin}?join=${room.code}`,
        })
      } catch (err) {
        copyInviteLink()
      }
    } else {
      copyInviteLink()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Lobby
      </Button>

      {step === "setup" && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Create Your Game Room</CardTitle>
            <CardDescription className="text-gray-300">
              Set up your player profile to create a multiplayer room
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlayerSetup onComplete={handleCreateRoom} />
          </CardContent>
        </Card>
      )}

      {step === "created" && room && player && (
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Room Created!</CardTitle>
              <CardDescription className="text-gray-300">
                Share the room code or invite link with your friend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RoomCode code={room.code} />

              <div className="grid gap-3">
                <Button
                  onClick={copyRoomCode}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Room Code
                </Button>

                <Button
                  onClick={copyInviteLink}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Invite Link
                </Button>

                <Button
                  onClick={shareInvite}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Player Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl">
                  {player.emoji}
                </div>
                <div>
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-gray-400 text-sm">Host • Room: {room.code}</p>
                </div>
              </div>

              <Button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                size="lg"
              >
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

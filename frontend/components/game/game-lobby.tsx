"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, LogIn, Zap } from "lucide-react"
import { KeyboardDemo } from "@/components/keyboard-demo"

interface GameLobbyProps {
  onInviteFriend: () => void
  onJoinRoom: () => void
}

export function GameLobby({ onInviteFriend, onJoinRoom }: GameLobbyProps) {
  return (
    <main className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center"
            role="img"
            aria-label="Dewordle logo"
          >
            <Zap className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-white">Dewordle</h1>
        </div>
        <p className="text-xl text-gray-300 mb-2">Decentralized Word Guessing Game</p>
        <p className="text-sm text-gray-400">Built on StarkNet • Blockchain-Powered • Multiplayer</p>
      </header>

      {/* Game Modes */}
      <section aria-labelledby="game-modes-heading" className="mb-8">
        <h2 id="game-modes-heading" className="sr-only">
          Game Modes
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Create Game</CardTitle>
                  <CardDescription className="text-gray-300">Invite a friend to play head-to-head</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={onInviteFriend}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                aria-describedby="create-game-desc"
              >
                <Users className="w-4 h-4 mr-2" aria-hidden="true" />
                Invite a Friend
              </Button>
              <div id="create-game-desc" className="sr-only">
                Create a new multiplayer game room and invite a friend to play the same word in a head-to-head format
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <LogIn className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Join Game</CardTitle>
                  <CardDescription className="text-gray-300">Enter a room code to join a friend</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={onJoinRoom}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                aria-describedby="join-game-desc"
              >
                <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                Join Room
              </Button>
              <div id="join-game-desc" className="sr-only">
                Join an existing game room using a room code shared by a friend
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle id="features-heading" className="text-white text-center">
              Why Dewordle?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div
                  className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3"
                  aria-hidden="true"
                >
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Decentralized</h3>
                <p className="text-gray-400 text-sm">Built on StarkNet for transparency and security</p>
              </div>
              <div>
                <div
                  className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3"
                  aria-hidden="true"
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Multiplayer</h3>
                <p className="text-gray-400 text-sm">Challenge friends in real-time word battles</p>
              </div>
              <div>
                <div
                  className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3"
                  aria-hidden="true"
                >
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Provably Fair</h3>
                <p className="text-gray-400 text-sm">Blockchain ensures fair play and verifiable results</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Keyboard Demo */}
      <section aria-labelledby="keyboard-demo-heading" className="mt-8">
        <h2 id="keyboard-demo-heading" className="sr-only">
          Keyboard Demo
        </h2>
        <KeyboardDemo />
      </section>
    </main>
  )
}

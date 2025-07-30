"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMOJI_OPTIONS = ["😀", "😎", "🤖", "👾", "🎮", "🚀", "⚡", "🔥", "💎", "🌟", "🎯", "🏆"]

interface PlayerSetupProps {
  onComplete: (playerData: { name: string; emoji: string }) => void
}

export function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const [name, setName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onComplete({ name: name.trim(), emoji: selectedEmoji })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="playerName" className="text-white">
          Your Name
        </Label>
        <Input
          id="playerName"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          maxLength={20}
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-white">Choose Your Emoji</Label>
        <div className="grid grid-cols-6 gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                selectedEmoji === emoji ? "bg-blue-600 ring-2 ring-blue-400" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl">
          {selectedEmoji}
        </div>
        <div>
          <p className="text-white font-semibold">{name || "Your Name"}</p>
          <p className="text-gray-400 text-sm">This is how you'll appear to other players</p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        size="lg"
      >
        Continue
      </Button>
    </form>
  )
}

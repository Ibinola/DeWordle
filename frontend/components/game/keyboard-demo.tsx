"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OnScreenKeyboard, type LetterStatus } from "@/components/on-screen-keyboard"
import { RefreshCw } from "lucide-react"

export function KeyboardDemo() {
  const [currentGuess, setCurrentGuess] = useState("")
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({
    A: "correct",
    B: "present",
    C: "absent",
    D: "unused",
  })

  const handleKeyPress = (key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key)
    }
  }

  const handleBackspace = () => {
    setCurrentGuess((prev) => prev.slice(0, -1))
  }

  const handleEnter = () => {
    if (currentGuess.length === 5) {
      // Demo: randomly assign statuses to letters
      const newStatuses = { ...letterStatuses }
      const statuses: LetterStatus[] = ["correct", "present", "absent"]

      currentGuess.split("").forEach((letter) => {
        if (!newStatuses[letter] || newStatuses[letter] === "unused") {
          newStatuses[letter] = statuses[Math.floor(Math.random() * statuses.length)]
        }
      })

      setLetterStatuses(newStatuses)
      setCurrentGuess("")
    }
  }

  const resetDemo = () => {
    setCurrentGuess("")
    setLetterStatuses({
      A: "correct",
      B: "present",
      C: "absent",
      D: "unused",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-white">Keyboard Demo</CardTitle>
        <CardDescription className="text-gray-300">
          Try the on-screen keyboard with different themes and feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-white mb-4">
            Current Guess: <span className="font-mono font-bold">{currentGuess || "..."}</span>
          </p>
          <Button
            onClick={resetDemo}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        <OnScreenKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          letterStatuses={letterStatuses}
          currentGuess={currentGuess}
        />

        <div className="text-center text-sm text-gray-400">
          <p>Type letters to see them appear, press Enter to simulate a guess with random feedback</p>
        </div>
      </CardContent>
    </Card>
  )
}

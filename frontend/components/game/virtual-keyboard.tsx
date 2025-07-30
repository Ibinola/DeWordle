"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkipBackIcon as Backspace, CornerDownLeft } from "lucide-react"

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onEnter: () => void
  guesses: string[]
  targetWord: string
  disabled?: boolean
}

export function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onEnter,
  guesses,
  targetWord,
  disabled = false,
}: VirtualKeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

  const getKeyStatus = (key: string): "correct" | "present" | "absent" | "unused" => {
    if (key === "ENTER" || key === "BACKSPACE") return "unused"

    let status: "correct" | "present" | "absent" | "unused" = "unused"

    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (targetWord[i] === key) {
            status = "correct"
            break
          } else if (targetWord.includes(key) && status !== "correct") {
            status = "present"
          } else if (status === "unused") {
            status = "absent"
          }
        }
      }
      if (status === "correct") break
    }

    return status
  }

  const getKeyColor = (status: string, isSpecial = false) => {
    if (isSpecial) {
      return "bg-gray-400 hover:bg-gray-500 text-white"
    }

    switch (status) {
      case "correct":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "present":
        return "bg-yellow-500 hover:bg-yellow-600 text-white"
      case "absent":
        return "bg-gray-500 hover:bg-gray-600 text-white"
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-900"
    }
  }

  const handleKeyClick = (key: string) => {
    if (disabled) return

    if (key === "ENTER") {
      onEnter()
    } else if (key === "BACKSPACE") {
      onBackspace()
    } else {
      onKeyPress(key)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-4">
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => {
                const status = getKeyStatus(key)
                const isSpecial = key === "ENTER" || key === "BACKSPACE"
                const keyWidth = isSpecial ? "w-16" : "w-10"

                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className={`${keyWidth} h-12 p-0 text-sm font-semibold ${getKeyColor(status, isSpecial)} border-0`}
                    onClick={() => handleKeyClick(key)}
                    disabled={disabled}
                  >
                    {key === "BACKSPACE" ? (
                      <Backspace className="h-4 w-4" />
                    ) : key === "ENTER" ? (
                      <CornerDownLeft className="h-4 w-4" />
                    ) : (
                      key
                    )}
                  </Button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Wrong Position</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Not in Word</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

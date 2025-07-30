"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { OnScreenKeyboard, type LetterStatus } from "@/components/on-screen-keyboard"

interface WordleGridProps {
  word: string
  guesses: string[]
  currentGuess: string
  onGuessChange: (guess: string) => void
  onGuessSubmit: (guess: string) => void
  gameStatus: "playing" | "won" | "lost"
}

export function WordleGrid({ word, guesses, currentGuess, onGuessChange, onGuessSubmit, gameStatus }: WordleGridProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { announce, settings } = useAccessibility()
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({})

  useEffect(() => {
    setInputValue(currentGuess)
  }, [currentGuess])

  // Focus input when Alt+G is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "g") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Announce game state changes
  useEffect(() => {
    if (gameStatus === "won") {
      announce("Congratulations! You won the game!", "assertive")
    } else if (gameStatus === "lost") {
      announce(`Game over. The word was ${word}`, "assertive")
    }
  }, [gameStatus, word, announce])

  const getLetterStatus = (letter: string, position: number, guess: string) => {
    if (word[position] === letter) return "correct"
    if (word.includes(letter)) return "present"
    return "absent"
  }

  const getLetterStatusDescription = (status: string, letter: string, position: number) => {
    switch (status) {
      case "correct":
        return `${letter} is correct and in position ${position + 1}`
      case "present":
        return `${letter} is in the word but in wrong position`
      case "absent":
        return `${letter} is not in the word`
      default:
        return ""
    }
  }

  const updateLetterStatuses = (guess: string) => {
    const newStatuses = { ...letterStatuses }

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      const currentStatus = newStatuses[letter] || "unused"

      if (word[i] === letter) {
        newStatuses[letter] = "correct"
      } else if (word.includes(letter) && currentStatus !== "correct") {
        newStatuses[letter] = "present"
      } else if (!word.includes(letter)) {
        newStatuses[letter] = "absent"
      }
    }

    setLetterStatuses(newStatuses)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.length === 5 && gameStatus === "playing") {
      const upperGuess = inputValue.toUpperCase()
      onGuessSubmit(upperGuess)
      updateLetterStatuses(upperGuess)

      // Announce the guess
      const guessNumber = guesses.length + 1
      announce(`Guess ${guessNumber}: ${upperGuess}`, "polite")

      setInputValue("")
    }
  }

  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z]/g, "")
    if (upperValue.length <= 5) {
      setInputValue(upperValue)
      onGuessChange(upperValue)
    }
  }

  const renderRow = (guess: string, isActive = false, rowIndex: number) => {
    const letters = guess.padEnd(5, " ").split("")

    return (
      <div
        className="grid grid-cols-5 gap-2"
        role="row"
        aria-label={`Row ${rowIndex + 1} ${isActive ? "(current guess)" : guess.length === 5 ? "(completed)" : "(empty)"}`}
      >
        {letters.map((letter, index) => {
          let bgColor = "bg-white/10 border-white/20"
          let status = ""

          if (guess.length === 5 && !isActive) {
            const letterStatus = getLetterStatus(letter, index, guess)
            status = letterStatus
            if (letterStatus === "correct") bgColor = "bg-green-600 border-green-500"
            else if (letterStatus === "present") bgColor = "bg-yellow-600 border-yellow-500"
            else bgColor = "bg-gray-600 border-gray-500"
          } else if (isActive && letter !== " ") {
            bgColor = "bg-blue-600/30 border-blue-400"
          }

          const ariaLabel =
            letter !== " "
              ? `Position ${index + 1}: ${letter}${status ? `. ${getLetterStatusDescription(status, letter, index)}` : ""}`
              : `Position ${index + 1}: empty`

          return (
            <div
              key={index}
              className={`w-12 h-12 border-2 rounded flex items-center justify-center text-white font-bold text-lg transition-colors ${bgColor} ${
                settings.reducedMotion ? "" : "transition-all duration-300"
              }`}
              role="gridcell"
              aria-label={ariaLabel}
              tabIndex={-1}
            >
              {letter !== " " ? letter : ""}
            </div>
          )
        })}
      </div>
    )
  }

  const handleKeyPress = (key: string) => {
    if (currentGuess.length < 5) {
      const newGuess = currentGuess + key
      setInputValue(newGuess)
      onGuessChange(newGuess)
    }
  }

  const handleBackspace = () => {
    const newGuess = currentGuess.slice(0, -1)
    setInputValue(newGuess)
    onGuessChange(newGuess)
  }

  const handleEnter = () => {
    if (inputValue.length === 5) {
      handleSubmit(new Event("submit") as any)
    }
  }

  return (
    <main id="main-content" className="space-y-4">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Game status: {gameStatus === "playing" ? `Playing, ${6 - guesses.length} guesses remaining` : gameStatus}
      </div>

      {/* Grid */}
      <div className="space-y-2 mb-6" role="grid" aria-label="Wordle game grid" aria-describedby="grid-instructions">
        <div id="grid-instructions" className="sr-only">
          Wordle game grid with 6 rows and 5 columns. Each row represents a guess. Green tiles indicate correct letters
          in correct positions. Yellow tiles indicate correct letters in wrong positions. Gray tiles indicate letters
          not in the word.
        </div>

        {Array.from({ length: 6 }, (_, index) => {
          if (index < guesses.length) {
            return <div key={index}>{renderRow(guesses[index], false, index)}</div>
          } else if (index === guesses.length && gameStatus === "playing") {
            return <div key={index}>{renderRow(currentGuess, true, index)}</div>
          } else {
            return <div key={index}>{renderRow("", false, index)}</div>
          }
        })}
      </div>

      {/* On-Screen Keyboard */}
      {gameStatus === "playing" && (
        <OnScreenKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          letterStatuses={letterStatuses}
          disabled={gameStatus !== "playing"}
          currentGuess={currentGuess}
        />
      )}

      {/* Game Over Message */}
      {gameStatus !== "playing" && (
        <div className="text-center py-4" role="status" aria-live="assertive">
          <p className="text-white text-lg font-semibold mb-2">
            {gameStatus === "won" ? "🎉 Congratulations!" : "😔 Better luck next time!"}
          </p>
          <p className="text-gray-300">
            The word was: <span className="font-bold text-white">{word}</span>
          </p>
        </div>
      )}
    </main>
  )
}

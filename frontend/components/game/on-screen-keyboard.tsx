"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Delete, CornerDownLeft } from "lucide-react"
import { useTheme, THEME_CONFIGS } from "@/contexts/theme-context"
import { useAccessibility } from "@/contexts/accessibility-context"

export type LetterStatus = "unused" | "correct" | "present" | "absent"

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onEnter: () => void
  letterStatuses: Record<string, LetterStatus>
  disabled?: boolean
  currentGuess?: string
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
]

export function OnScreenKeyboard({
  onKeyPress,
  onBackspace,
  onEnter,
  letterStatuses,
  disabled = false,
  currentGuess = "",
}: OnScreenKeyboardProps) {
  const { settings, triggerHaptic } = useTheme()
  const { announce } = useAccessibility()
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  const themeConfig = THEME_CONFIGS[settings.keyboardTheme]

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return

      const key = event.key.toUpperCase()

      if (key === "ENTER") {
        event.preventDefault()
        handleKeyPress("ENTER")
      } else if (key === "BACKSPACE") {
        event.preventDefault()
        handleKeyPress("BACKSPACE")
      } else if (/^[A-Z]$/.test(key)) {
        event.preventDefault()
        handleKeyPress(key)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [disabled, onKeyPress, onBackspace, onEnter])

  const handleKeyPress = (key: string) => {
    if (disabled) return

    // Visual feedback
    setPressedKey(key)
    setTimeout(() => setPressedKey(null), 150)

    // Haptic feedback
    if (key === "ENTER" || key === "BACKSPACE") {
      triggerHaptic("medium")
    } else {
      triggerHaptic("light")
    }

    // Audio announcement for screen readers
    if (key === "ENTER") {
      announce("Enter pressed", "polite")
      onEnter()
    } else if (key === "BACKSPACE") {
      announce("Backspace pressed", "polite")
      onBackspace()
    } else {
      announce(`${key} pressed`, "polite")
      onKeyPress(key)
    }
  }

  const getKeyClasses = (key: string) => {
    const status = letterStatuses[key] || "unused"
    const isPressed = pressedKey === key
    const isSpecialKey = key === "ENTER" || key === "BACKSPACE"

    let baseClasses = "relative overflow-hidden font-semibold transition-all duration-200 select-none"

    // Size classes
    if (isSpecialKey) {
      baseClasses += " px-3 py-4 text-sm min-w-[60px]"
    } else {
      baseClasses += " w-10 h-12 text-lg"
    }

    // Theme-based styling
    let statusClasses = ""
    switch (status) {
      case "correct":
        statusClasses = themeConfig.keyCorrect
        break
      case "present":
        statusClasses = themeConfig.keyPresent
        break
      case "absent":
        statusClasses = themeConfig.keyAbsent
        break
      default:
        statusClasses = isSpecialKey ? themeConfig.keySpecial : themeConfig.keyDefault
    }

    // Hover and pressed states
    if (!disabled) {
      statusClasses += ` ${themeConfig.keyHover}`
    }

    if (isPressed) {
      statusClasses = statusClasses.replace(themeConfig.keyDefault, themeConfig.keyPressed)
      statusClasses = statusClasses.replace(themeConfig.keySpecial, themeConfig.keyPressed)
    }

    // Animation classes
    if (settings.keyAnimations) {
      baseClasses += " transform active:scale-95"
      if (isPressed) {
        baseClasses += " scale-95"
      }
    }

    // Disabled state
    if (disabled) {
      baseClasses += " opacity-50 cursor-not-allowed"
    }

    return `${baseClasses} ${statusClasses}`
  }

  const getKeyAriaLabel = (key: string) => {
    const status = letterStatuses[key]
    let label = key

    if (key === "ENTER") {
      label = "Enter key - Submit guess"
    } else if (key === "BACKSPACE") {
      label = "Backspace key - Delete letter"
    } else if (status) {
      const statusText = {
        correct: "correct position",
        present: "in word, wrong position",
        absent: "not in word",
        unused: "not used",
      }[status]
      label = `${key} - ${statusText}`
    }

    return label
  }

  const renderKey = (key: string) => {
    const isSpecialKey = key === "ENTER" || key === "BACKSPACE"

    return (
      <Button
        key={key}
        onClick={() => handleKeyPress(key)}
        disabled={disabled}
        className={getKeyClasses(key)}
        aria-label={getKeyAriaLabel(key)}
        aria-pressed={pressedKey === key}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        {/* Ripple effect for press animation */}
        {settings.keyAnimations && pressedKey === key && (
          <div className="absolute inset-0 bg-white/20 rounded animate-ping" />
        )}

        {/* Key content */}
        {key === "BACKSPACE" ? (
          <Delete className="w-4 h-4" aria-hidden="true" />
        ) : key === "ENTER" ? (
          <CornerDownLeft className="w-4 h-4" aria-hidden="true" />
        ) : (
          key
        )}

        {/* Status indicator for screen readers */}
        {letterStatuses[key] && (
          <span className="sr-only">
            {letterStatuses[key] === "correct"
              ? "Correct position"
              : letterStatuses[key] === "present"
                ? "In word, wrong position"
                : letterStatuses[key] === "absent"
                  ? "Not in word"
                  : ""}
          </span>
        )}
      </Button>
    )
  }

  return (
    <div
      className="w-full max-w-lg mx-auto"
      role="application"
      aria-label="On-screen keyboard"
      aria-describedby="keyboard-instructions"
    >
      <div id="keyboard-instructions" className="sr-only">
        On-screen keyboard for entering guesses. Keys change color based on your guesses: green for correct letters in
        correct positions, yellow for correct letters in wrong positions, and gray for letters not in the word. Use
        Enter to submit your guess and Backspace to delete letters.
      </div>

      {/* Current guess display */}
      {currentGuess && (
        <div className="text-center mb-4">
          <div className="inline-flex gap-1 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            {currentGuess.split("").map((letter, index) => (
              <div
                key={index}
                className="w-8 h-8 flex items-center justify-center bg-blue-600/30 border border-blue-400 rounded text-white font-bold"
              >
                {letter}
              </div>
            ))}
            {Array.from({ length: 5 - currentGuess.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 rounded"
              />
            ))}
          </div>
        </div>
      )}

      {/* Keyboard rows */}
      <div className="space-y-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-1"
            role="row"
            aria-label={`Keyboard row ${rowIndex + 1}`}
          >
            {row.map(renderKey)}
          </div>
        ))}
      </div>

      {/* Theme indicator */}
      <div className="text-center mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
          <div className={`w-3 h-3 rounded-full ${themeConfig.keyCorrect.split(" ")[0]}`} />
          <span className="text-white text-xs">{THEME_CONFIGS[settings.keyboardTheme].name} Theme</span>
        </div>
      </div>
    </div>
  )
}

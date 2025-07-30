"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility } from "lucide-react"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { useAccessibility } from "@/contexts/accessibility-context"

export function AccessibilityButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toggleHighContrast } = useAccessibility()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A to open accessibility menu
      if (event.altKey && event.key === "a") {
        event.preventDefault()
        setIsMenuOpen(true)
      }

      // Alt + H to toggle high contrast
      if (event.altKey && event.key === "h") {
        event.preventDefault()
        toggleHighContrast()
      }

      // Escape to close menu
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isMenuOpen, toggleHighContrast])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white/95"
        aria-label="Open accessibility settings (Alt+A)"
        title="Accessibility Settings"
      >
        <Accessibility className="w-4 h-4" />
        <span className="sr-only">Accessibility Settings</span>
      </Button>

      <AccessibilityMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

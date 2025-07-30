"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { KeyboardThemeSelector } from "@/components/keyboard-theme-selector"

export function KeyboardThemeButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-20 z-40 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white/95"
        aria-label="Open keyboard theme settings"
        title="Keyboard Themes"
      >
        <Palette className="w-4 h-4" />
        <span className="sr-only">Keyboard Themes</span>
      </Button>

      <KeyboardThemeSelector isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

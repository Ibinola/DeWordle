"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Volume2, Palette, Monitor, Moon, Sun, Gamepad2 } from "lucide-react"

interface GameSettings {
  // Audio Settings
  soundEnabled: boolean
  musicEnabled: boolean
  soundVolume: number
  musicVolume: number

  // Visual Settings
  theme: "light" | "dark" | "auto"
  colorBlindMode: boolean
  highContrast: boolean
  animations: boolean
  particleEffects: boolean

  // Gameplay Settings
  autoSubmit: boolean
  showTimer: boolean
  showKeyboard: boolean
  hapticFeedback: boolean
  confirmBeforeSubmit: boolean

  // Accessibility Settings
  fontSize: "small" | "medium" | "large"
  reduceMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 70,
  musicVolume: 50,
  theme: "auto",
  colorBlindMode: false,
  highContrast: false,
  animations: true,
  particleEffects: true,
  autoSubmit: false,
  showTimer: true,
  showKeyboard: true,
  hapticFeedback: true,
  confirmBeforeSubmit: false,
  fontSize: "medium",
  reduceMotion: false,
  screenReader: false,
  keyboardNavigation: false,
}

export function GameSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [isOpen, setIsOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem("dewordle_game_settings")
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        setSettings({ ...defaultSettings, ...parsedSettings })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const saveSettings = () => {
    try {
      localStorage.setItem("dewordle_game_settings", JSON.stringify(settings))
      setHasChanges(false)

      // Apply theme immediately
      applyTheme(settings.theme)

      // Apply other settings that need immediate effect
      if (settings.reduceMotion) {
        document.documentElement.style.setProperty("--animation-duration", "0s")
      } else {
        document.documentElement.style.removeProperty("--animation-duration")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const applyTheme = (theme: "light" | "dark" | "auto") => {
    if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const testSound = () => {
    if (settings.soundEnabled) {
      // Play a test sound
      const audio = new Audio("/sounds/test-beep.mp3")
      audio.volume = settings.soundVolume / 100
      audio.play().catch(() => {
        console.log("Could not play test sound")
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Game Settings
          </DialogTitle>
          <DialogDescription>Customize your Dewordle experience with these settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Volume2 className="h-4 w-4" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-gray-600">Play sound effects for game actions</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>

              {settings.soundEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Sound Volume: {settings.soundVolume}%</Label>
                    <Button variant="outline" size="sm" onClick={testSound}>
                      Test
                    </Button>
                  </div>
                  <Slider
                    value={[settings.soundVolume]}
                    onValueChange={([value]) => updateSetting("soundVolume", value)}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Background Music</Label>
                  <p className="text-sm text-gray-600">Play ambient background music</p>
                </div>
                <Switch
                  checked={settings.musicEnabled}
                  onCheckedChange={(checked) => updateSetting("musicEnabled", checked)}
                />
              </div>

              {settings.musicEnabled && (
                <div className="space-y-2">
                  <Label>Music Volume: {settings.musicVolume}%</Label>
                  <Slider
                    value={[settings.musicVolume]}
                    onValueChange={([value]) => updateSetting("musicVolume", value)}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visual Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Visual Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "light" | "dark" | "auto") => updateSetting("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Auto
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Color Blind Mode</Label>
                  <p className="text-sm text-gray-600">Enhanced colors for color blind users</p>
                </div>
                <Switch
                  checked={settings.colorBlindMode}
                  onCheckedChange={(checked) => updateSetting("colorBlindMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast</Label>
                  <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Animations</Label>
                  <p className="text-sm text-gray-600">Enable smooth animations and transitions</p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => updateSetting("animations", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Particle Effects</Label>
                  <p className="text-sm text-gray-600">Show celebration particles and effects</p>
                </div>
                <Switch
                  checked={settings.particleEffects}
                  onCheckedChange={(checked) => updateSetting("particleEffects", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gameplay Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gamepad2 className="h-4 w-4" />
                Gameplay Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Submit</Label>
                  <p className="text-sm text-gray-600">Automatically submit when word is complete</p>
                </div>
                <Switch
                  checked={settings.autoSubmit}
                  onCheckedChange={(checked) => updateSetting("autoSubmit", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Timer</Label>
                  <p className="text-sm text-gray-600">Display game timer during play</p>
                </div>
                <Switch
                  checked={settings.showTimer}
                  onCheckedChange={(checked) => updateSetting("showTimer", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Virtual Keyboard</Label>
                  <p className="text-sm text-gray-600">Show on-screen keyboard</p>
                </div>
                <Switch
                  checked={settings.showKeyboard}
                  onCheckedChange={(checked) => updateSetting("showKeyboard", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Haptic Feedback</Label>
                  <p className="text-sm text-gray-600">Vibrate on mobile devices</p>
                </div>
                <Switch
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting("hapticFeedback", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Confirm Before Submit</Label>
                  <p className="text-sm text-gray-600">Ask for confirmation before submitting guesses</p>
                </div>
                <Switch
                  checked={settings.confirmBeforeSubmit}
                  onCheckedChange={(checked) => updateSetting("confirmBeforeSubmit", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accessibility Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value: "small" | "medium" | "large") => updateSetting("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduce Motion</Label>
                  <p className="text-sm text-gray-600">Minimize animations for motion sensitivity</p>
                </div>
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen Reader Support</Label>
                  <p className="text-sm text-gray-600">Enhanced support for screen readers</p>
                </div>
                <Switch
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Keyboard Navigation</Label>
                  <p className="text-sm text-gray-600">Enable full keyboard navigation</p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveSettings} disabled={!hasChanges}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

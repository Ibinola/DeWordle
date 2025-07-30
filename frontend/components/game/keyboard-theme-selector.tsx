"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Palette, Smartphone, Zap, Check } from "lucide-react"
import { useTheme, THEME_CONFIGS, type KeyboardTheme } from "@/contexts/theme-context"

interface KeyboardThemeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardThemeSelector({ isOpen, onClose }: KeyboardThemeSelectorProps) {
  const { settings, updateKeyboardTheme, toggleHaptics, toggleKeyAnimations } = useTheme()

  if (!isOpen) return null

  const themes: { value: KeyboardTheme; preview: string[] }[] = [
    { value: "classic", preview: ["bg-gray-200", "bg-green-500", "bg-yellow-500", "bg-gray-500"] },
    { value: "dark", preview: ["bg-gray-700", "bg-green-600", "bg-yellow-600", "bg-gray-800"] },
    { value: "neon", preview: ["bg-purple-900", "bg-green-500", "bg-yellow-400", "bg-gray-900"] },
    { value: "ocean", preview: ["bg-blue-100", "bg-teal-500", "bg-amber-500", "bg-slate-500"] },
    { value: "sunset", preview: ["bg-orange-100", "bg-emerald-500", "bg-yellow-500", "bg-gray-600"] },
    { value: "forest", preview: ["bg-green-100", "bg-green-600", "bg-yellow-600", "bg-stone-600"] },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur border-2 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Keyboard Themes</CardTitle>
              <CardDescription>Customize your keyboard appearance and behavior</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close theme selector" className="h-8 w-8 p-0">
            ✕
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Theme Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Choose Theme</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const config = THEME_CONFIGS[theme.value]
                const isSelected = settings.keyboardTheme === theme.value

                return (
                  <button
                    key={theme.value}
                    onClick={() => updateKeyboardTheme(theme.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isSelected
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{config.name}</h4>
                      {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{config.description}</p>

                    {/* Theme preview */}
                    <div className="flex gap-1 mb-3">
                      {theme.preview.map((color, index) => (
                        <div key={index} className={`w-6 h-6 rounded ${color} border border-gray-300`} />
                      ))}
                    </div>

                    {/* Sample keys */}
                    <div className="flex gap-1">
                      <div className={`px-2 py-1 text-xs rounded ${config.keyDefault}`}>A</div>
                      <div className={`px-2 py-1 text-xs rounded ${config.keyCorrect}`}>B</div>
                      <div className={`px-2 py-1 text-xs rounded ${config.keyPresent}`}>C</div>
                      <div className={`px-2 py-1 text-xs rounded ${config.keyAbsent}`}>D</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Keyboard Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Keyboard Behavior</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="key-animations" className="font-medium">
                      Key Animations
                    </Label>
                    {settings.keyAnimations && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable press animations and visual feedback
                  </p>
                </div>
                <Switch id="key-animations" checked={settings.keyAnimations} onCheckedChange={toggleKeyAnimations} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <Label htmlFor="haptic-feedback" className="font-medium">
                      Haptic Feedback
                    </Label>
                    {settings.enableHaptics && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable vibration feedback on mobile devices
                  </p>
                </div>
                <Switch id="haptic-feedback" checked={settings.enableHaptics} onCheckedChange={toggleHaptics} />
              </div>
            </div>
          </div>

          {/* Keyboard Layout Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color Guide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${THEME_CONFIGS[settings.keyboardTheme].keyDefault}`} />
                <span>Unused</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${THEME_CONFIGS[settings.keyboardTheme].keyCorrect}`} />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${THEME_CONFIGS[settings.keyboardTheme].keyPresent}`} />
                <span>Wrong Position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${THEME_CONFIGS[settings.keyboardTheme].keyAbsent}`} />
                <span>Not in Word</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

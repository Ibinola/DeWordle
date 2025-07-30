"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Type, Eye, Volume2, VolumeX, Accessibility, X, Check } from "lucide-react"
import { useAccessibility, type FontSize } from "@/contexts/accessibility-context"

interface AccessibilityMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const { settings, updateFontSize, toggleHighContrast, toggleReducedMotion, toggleAnnouncements } = useAccessibility()

  if (!isOpen) return null

  const fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    { value: "small", label: "Small", description: "Compact text size" },
    { value: "medium", label: "Medium", description: "Default text size" },
    { value: "large", label: "Large", description: "Larger text for better readability" },
    { value: "extra-large", label: "Extra Large", description: "Maximum text size" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Accessibility Settings</CardTitle>
              <CardDescription>Customize your gaming experience</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close accessibility settings"
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Font Size Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Text Size</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Adjust text size for better readability</p>

            <div className="grid grid-cols-2 gap-3">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFontSize(option.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    settings.fontSize === option.value
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  aria-pressed={settings.fontSize === option.value}
                  aria-describedby={`font-size-${option.value}-desc`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{option.label}</span>
                    {settings.fontSize === option.value && (
                      <Check className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                  <p id={`font-size-${option.value}-desc`} className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                  <div
                    className={`mt-2 ${
                      option.value === "small"
                        ? "text-sm"
                        : option.value === "medium"
                          ? "text-base"
                          : option.value === "large"
                            ? "text-lg"
                            : "text-xl"
                    }`}
                  >
                    Sample text
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Visual Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="high-contrast" className="font-medium">
                      High Contrast Mode
                    </Label>
                    {settings.highContrast && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Increases contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={toggleHighContrast}
                  aria-describedby="high-contrast-desc"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <Label htmlFor="reduced-motion" className="font-medium">
                    Reduce Motion
                  </Label>
                  <p id="reduced-motion-desc" className="text-sm text-gray-600 dark:text-gray-400">
                    Minimizes animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                  aria-describedby="reduced-motion-desc"
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {settings.announcements ? (
                <Volume2 className="w-5 h-5 text-purple-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="text-lg font-semibold">Audio Settings</h3>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <Label htmlFor="announcements" className="font-medium">
                  Screen Reader Announcements
                </Label>
                <p id="announcements-desc" className="text-sm text-gray-600 dark:text-gray-400">
                  Enable audio feedback for game events
                </p>
              </div>
              <Switch
                id="announcements"
                checked={settings.announcements}
                onCheckedChange={toggleAnnouncements}
                aria-describedby="announcements-desc"
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <span>Open accessibility menu</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + A</kbd>
              </div>
              <div className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <span>Focus game input</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + G</kbd>
              </div>
              <div className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <span>Skip to main content</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + M</kbd>
              </div>
              <div className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <span>Toggle high contrast</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + H</kbd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

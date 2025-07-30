"use client"

import { useState } from "react"
import { useDifficulty } from "@/contexts/difficulty-context"
import type { DifficultyLevel } from "@/types/difficulty"
import { DIFFICULTY_PRESETS } from "@/types/difficulty"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Clock, Target, Zap, Info } from "lucide-react"

const DIFFICULTY_ICONS = {
  easy: "🟢",
  normal: "🟡",
  hard: "🟠",
  expert: "🔴",
}

const DIFFICULTY_DESCRIPTIONS = {
  easy: "Relaxed gameplay with hints and extra guesses",
  normal: "Standard Wordle rules with time pressure",
  hard: "Must use revealed letters in subsequent guesses",
  expert: "Maximum challenge with strict rules and time limits",
}

export function DifficultySettings() {
  const { state, setDifficultyLevel, updateSettings } = useDifficulty()
  const [isOpen, setIsOpen] = useState(false)

  const handlePresetChange = (level: DifficultyLevel) => {
    setDifficultyLevel(level)
  }

  const handleCustomSettingChange = (key: keyof typeof state.settings, value: any) => {
    updateSettings({ [key]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Difficulty
          <Badge variant="outline" className="ml-1">
            {DIFFICULTY_ICONS[state.settings.level]} {state.settings.level}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Game Difficulty Settings</DialogTitle>
          <DialogDescription>
            Customize your Dewordle experience with different difficulty levels and rules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Difficulty Presets */}
          <div>
            <Label className="text-base font-semibold">Difficulty Presets</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {Object.entries(DIFFICULTY_PRESETS).map(([level, preset]) => (
                <Card
                  key={level}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    state.settings.level === level ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => handlePresetChange(level as DifficultyLevel)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{DIFFICULTY_ICONS[level as DifficultyLevel]}</span>
                      <span className="font-semibold capitalize">{level}</span>
                      {state.settings.level === level && (
                        <Badge variant="default" className="ml-auto">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{DIFFICULTY_DESCRIPTIONS[level as DifficultyLevel]}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {preset.maxGuesses} max guesses
                      </div>
                      {preset.timeLimit && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(preset.timeLimit / 60)}:{(preset.timeLimit % 60).toString().padStart(2, "0")} time
                          limit
                        </div>
                      )}
                      {preset.hardModeEnabled && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Hard mode rules
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Settings */}
          <div>
            <Label className="text-base font-semibold">Custom Settings</Label>
            <div className="space-y-4 mt-3">
              {/* Hard Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Hard Mode</Label>
                  <p className="text-sm text-gray-600">Must use revealed letters in subsequent guesses</p>
                </div>
                <Switch
                  checked={state.settings.hardModeEnabled}
                  onCheckedChange={(checked) => handleCustomSettingChange("hardModeEnabled", checked)}
                />
              </div>

              {/* Max Guesses */}
              <div className="space-y-2">
                <Label>Maximum Guesses: {state.settings.maxGuesses}</Label>
                <Slider
                  value={[state.settings.maxGuesses]}
                  onValueChange={([value]) => handleCustomSettingChange("maxGuesses", value)}
                  min={4}
                  max={8}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Time Limit</Label>
                  <Switch
                    checked={state.settings.timeLimit !== null}
                    onCheckedChange={(checked) => handleCustomSettingChange("timeLimit", checked ? 300 : null)}
                  />
                </div>
                {state.settings.timeLimit && (
                  <div className="space-y-2">
                    <Label>
                      Duration: {Math.floor(state.settings.timeLimit / 60)}:
                      {(state.settings.timeLimit % 60).toString().padStart(2, "0")}
                    </Label>
                    <Slider
                      value={[state.settings.timeLimit]}
                      onValueChange={([value]) => handleCustomSettingChange("timeLimit", value)}
                      min={60}
                      max={600}
                      step={30}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Repeated Letters</Label>
                    <p className="text-sm text-gray-600">Allow using the same letter multiple times</p>
                  </div>
                  <Switch
                    checked={state.settings.allowRepeatedLetters}
                    onCheckedChange={(checked) => handleCustomSettingChange("allowRepeatedLetters", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Hints</Label>
                    <p className="text-sm text-gray-600">Display helpful hints during gameplay</p>
                  </div>
                  <Switch
                    checked={state.settings.showHints}
                    onCheckedChange={(checked) => handleCustomSettingChange("showHints", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Penalize Invalid Guesses</Label>
                    <p className="text-sm text-gray-600">Reduce score for rule violations</p>
                  </div>
                  <Switch
                    checked={state.settings.penalizeInvalidGuesses}
                    onCheckedChange={(checked) => handleCustomSettingChange("penalizeInvalidGuesses", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Settings Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4" />
              <Label className="font-semibold">Current Configuration</Label>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                Difficulty: <Badge variant="outline">{state.settings.level}</Badge>
              </div>
              <div>Max Guesses: {state.settings.maxGuesses}</div>
              <div>Hard Mode: {state.settings.hardModeEnabled ? "✅" : "❌"}</div>
              <div>
                Time Limit:{" "}
                {state.settings.timeLimit
                  ? `${Math.floor(state.settings.timeLimit / 60)}:${(state.settings.timeLimit % 60).toString().padStart(2, "0")}`
                  : "None"}
              </div>
              <div>Hints: {state.settings.showHints ? "✅" : "❌"}</div>
              <div>Repeated Letters: {state.settings.allowRepeatedLetters ? "✅" : "❌"}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

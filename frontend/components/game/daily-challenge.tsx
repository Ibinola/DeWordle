"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Trophy, Star, Gift, Flame } from "lucide-react"

interface DailyChallenge {
  id: string
  date: string
  word: string
  theme: string
  difficulty: "easy" | "normal" | "hard" | "expert"
  specialRules: string[]
  rewards: {
    points: number
    badge?: string
    title?: string
  }
  timeLimit: number
  maxAttempts: number
  completed: boolean
  attempts?: number
  score?: number
  completedAt?: string
}

interface ChallengeProgress {
  currentStreak: number
  longestStreak: number
  totalCompleted: number
  weeklyCompleted: number
  monthlyCompleted: number
}

export function DailyChallenge() {
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null)
  const [progress, setProgress] = useState<ChallengeProgress | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (isOpen) {
      loadDailyChallenge()
      loadProgress()
    }
  }, [isOpen])

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const loadDailyChallenge = () => {
    // Generate today's challenge based on date
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`daily_challenge_${today}`)

    if (stored) {
      setTodayChallenge(JSON.parse(stored))
    } else {
      const challenge = generateDailyChallenge(today)
      setTodayChallenge(challenge)
      localStorage.setItem(`daily_challenge_${today}`, JSON.stringify(challenge))
    }

    // Calculate time remaining until next challenge
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    setTimeRemaining(Math.floor((tomorrow.getTime() - now.getTime()) / 1000))
  }

  const loadProgress = () => {
    const stored = localStorage.getItem("daily_challenge_progress")
    if (stored) {
      setProgress(JSON.parse(stored))
    } else {
      const defaultProgress: ChallengeProgress = {
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        weeklyCompleted: 0,
        monthlyCompleted: 0,
      }
      setProgress(defaultProgress)
    }
  }

  const generateDailyChallenge = (date: string): DailyChallenge => {
    const themes = ["Technology", "Nature", "Science", "Art", "Music", "Sports", "Food", "Travel"]
    const words = ["PIXEL", "CLOUD", "BYTES", "LOGIC", "FRAME", "SOUND", "LIGHT", "SPACE"]
    const specialRules = [
      "No repeated letters allowed",
      "Must use vowels in order",
      "First letter must be consonant",
      "Word must contain exactly 2 vowels",
      "No common letters (E, T, A, O, I, N)",
    ]

    const dateHash = date.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    const themeIndex = Math.abs(dateHash) % themes.length
    const wordIndex = Math.abs(dateHash) % words.length
    const ruleIndex = Math.abs(dateHash) % specialRules.length
    const difficulty = ["easy", "normal", "hard", "expert"][Math.abs(dateHash) % 4] as any

    return {
      id: `daily_${date}`,
      date,
      word: words[wordIndex],
      theme: themes[themeIndex],
      difficulty,
      specialRules: [specialRules[ruleIndex]],
      rewards: {
        points: difficulty === "expert" ? 500 : difficulty === "hard" ? 300 : 200,
        badge: difficulty === "expert" ? "Daily Master" : undefined,
        title: difficulty === "expert" ? "Challenge Champion" : undefined,
      },
      timeLimit: 300, // 5 minutes
      maxAttempts: difficulty === "expert" ? 4 : 6,
      completed: false,
    }
  }

  const startChallenge = () => {
    // This would integrate with your main game logic
    console.log("Starting daily challenge:", todayChallenge)
    setIsOpen(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "hard":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "expert":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Daily Challenge
          {todayChallenge && !todayChallenge.completed && (
            <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Daily Challenge
          </DialogTitle>
          <DialogDescription>Complete today's special challenge for exclusive rewards!</DialogDescription>
        </DialogHeader>

        {todayChallenge && progress && (
          <div className="space-y-6">
            {/* Challenge Info */}
            <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-yellow-600" />
                    Today's Challenge
                  </CardTitle>
                  <Badge className={getDifficultyColor(todayChallenge.difficulty)}>
                    {todayChallenge.difficulty.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Theme:</span>
                    <div className="font-semibold">{todayChallenge.theme}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Max Attempts:</span>
                    <div className="font-semibold">{todayChallenge.maxAttempts}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Time Limit:</span>
                    <div className="font-semibold">{Math.floor(todayChallenge.timeLimit / 60)} minutes</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Reward:</span>
                    <div className="font-semibold text-yellow-600">{todayChallenge.rewards.points} points</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="text-sm text-gray-600 block mb-2">Special Rules:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {todayChallenge.specialRules.map((rule, index) => (
                      <li key={index} className="text-sm text-orange-700 bg-orange-100 p-2 rounded">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {todayChallenge.rewards.badge && (
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-800">
                        Exclusive Badge: {todayChallenge.rewards.badge}
                      </span>
                    </div>
                  </div>
                )}

                {todayChallenge.completed ? (
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-green-800 font-semibold mb-2">✅ Challenge Completed!</div>
                    <div className="text-sm text-green-700">
                      Completed in {todayChallenge.attempts} attempts
                      {todayChallenge.score && ` • Score: ${todayChallenge.score.toLocaleString()}`}
                    </div>
                  </div>
                ) : (
                  <Button onClick={startChallenge} className="w-full" size="lg">
                    Start Challenge
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold">{progress.currentStreak}</div>
                  <div className="text-xs text-gray-600">Current Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold">{progress.longestStreak}</div>
                  <div className="text-xs text-gray-600">Best Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{progress.weeklyCompleted}</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">{progress.totalCompleted}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </CardContent>
              </Card>
            </div>

            {/* Next Challenge Countdown */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Next challenge in:</span>
                  </div>
                  <div className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</div>
                </div>
                <Progress value={((86400 - timeRemaining) / 86400) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

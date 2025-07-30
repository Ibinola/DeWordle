"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Trophy, Sparkles } from "lucide-react"
import type { Milestone } from "@/types/stats"

interface AchievementNotificationProps {
  achievement: Milestone
  onDismiss: () => void
}

function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="text-2xl animate-bounce">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="font-bold text-yellow-800">Achievement Unlocked!</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-700 mb-2">{achievement.description}</p>
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {achievement.category}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AchievementNotificationsProps {
  achievements: Milestone[]
  onAchievementDismissed: (achievementId: string) => void
}

export function AchievementNotifications({ achievements, onAchievementDismissed }: AchievementNotificationsProps) {
  const [visibleAchievements, setVisibleAchievements] = useState<Milestone[]>([])

  useEffect(() => {
    // Show new achievements one by one
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        setVisibleAchievements((prev) => [...prev, achievement])
      }, index * 500)
    })
  }, [achievements])

  const handleDismiss = (achievementId: string) => {
    setVisibleAchievements((prev) => prev.filter((a) => a.id !== achievementId))
    onAchievementDismissed(achievementId)
  }

  return (
    <>
      {visibleAchievements.map((achievement, index) => (
        <div key={achievement.id} style={{ top: `${1 + index * 5}rem` }} className="fixed right-4 z-50">
          <AchievementNotification achievement={achievement} onDismiss={() => handleDismiss(achievement.id)} />
        </div>
      ))}
    </>
  )
}

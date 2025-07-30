"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HelpCircle, ArrowRight, ArrowLeft, CheckCircle, Target, Keyboard, Trophy, Lightbulb, Zap } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  content: React.ReactNode
  interactive?: boolean
  completionCriteria?: string
}

export function GameTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem("dewordle_tutorial_completed")
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      setIsOpen(true)
    }
  }, [])

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to Dewordle!",
      description: "Learn how to play the decentralized word-guessing game",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold">Welcome to Dewordle!</h3>
          <p className="text-gray-600">
            Dewordle is a decentralized word-guessing game built on the StarkNet blockchain. Let's learn how to play!
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Goal:</strong> Guess the 5-letter word in 6 attempts or less
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "gameplay",
      title: "How to Play",
      description: "Understanding the basic gameplay mechanics",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Basic Gameplay</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Make a Guess</h4>
                <p className="text-sm text-gray-600">Type a 5-letter word and press Enter</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Get Feedback</h4>
                <p className="text-sm text-gray-600">Letters will change color to show how close you are</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">Win the Game</h4>
                <p className="text-sm text-gray-600">Guess the word correctly to win!</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "colors",
      title: "Understanding Colors",
      description: "Learn what each color means",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Color Meanings</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <h4 className="font-semibold text-green-700">Green - Correct!</h4>
                <p className="text-sm text-gray-600">The letter is in the word and in the right position</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white font-bold">
                B
              </div>
              <div>
                <h4 className="font-semibold text-yellow-700">Yellow - Wrong Position</h4>
                <p className="text-sm text-gray-600">The letter is in the word but in the wrong position</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white font-bold">C</div>
              <div>
                <h4 className="font-semibold text-gray-700">Gray - Not in Word</h4>
                <p className="text-sm text-gray-600">The letter is not in the word at all</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-2">Example:</h4>
            <div className="flex gap-1 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
                K
              </div>
            </div>
            <p className="text-sm text-yellow-800">
              S and K are correct, T is in the word but wrong position, A and R are not in the word.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "difficulty",
      title: "Difficulty Levels",
      description: "Choose your challenge level",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Difficulty Levels</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🟢</span>
                <h4 className="font-semibold text-green-800">Easy</h4>
              </div>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• 7 attempts</li>
                <li>• Hints available</li>
                <li>• No time limit</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🟡</span>
                <h4 className="font-semibold text-blue-800">Normal</h4>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 6 attempts</li>
                <li>• 5-minute timer</li>
                <li>• Standard rules</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🟠</span>
                <h4 className="font-semibold text-orange-800">Hard</h4>
              </div>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• 6 attempts</li>
                <li>• Must use revealed letters</li>
                <li>• 4-minute timer</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔴</span>
                <h4 className="font-semibold text-red-800">Expert</h4>
              </div>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• 5 attempts</li>
                <li>• No repeated letters</li>
                <li>• 3-minute timer</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "features",
      title: "Special Features",
      description: "Discover what makes Dewordle unique",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Special Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">Offline Mode</h4>
                <p className="text-sm text-gray-600">Play even without internet connection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Trophy className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Stats & Achievements</h4>
                <p className="text-sm text-gray-600">Track your progress and unlock milestones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Lightbulb className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Daily Challenges</h4>
                <p className="text-sm text-gray-600">Special puzzles with unique rewards</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Keyboard className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold">Virtual Keyboard</h4>
                <p className="text-sm text-gray-600">On-screen keyboard with color feedback</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tips",
      title: "Pro Tips",
      description: "Strategies to improve your game",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Pro Tips</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">💡 Start with vowels</h4>
              <p className="text-sm text-blue-700">Words like AUDIO or RAISE help identify vowel positions early</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">🎯 Use common letters</h4>
              <p className="text-sm text-green-700">Letters like E, T, A, O, I, N, S, H, R appear frequently</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-1">🔄 Avoid repeated letters early</h4>
              <p className="text-sm text-purple-700">
                Use different letters in your first few guesses to gather more information
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-1">⏰ Manage your time</h4>
              <p className="text-sm text-orange-700">Don't rush, but don't overthink. Trust your instincts!</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "complete",
      title: "Ready to Play!",
      description: "You're all set to start your Dewordle journey",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold">You're Ready!</h3>
          <p className="text-gray-600">
            You now know everything you need to start playing Dewordle. Good luck and have fun!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Remember:</strong> You can always access this tutorial again from the help menu.
            </p>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setCompletedSteps((prev) => new Set([...prev, tutorialSteps[currentStep].id]))
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTutorial = () => {
    localStorage.setItem("dewordle_tutorial_completed", "true")
    setIsOpen(false)
    setShowTutorial(false)
  }

  const skipTutorial = () => {
    localStorage.setItem("dewordle_tutorial_completed", "true")
    setIsOpen(false)
    setShowTutorial(false)
  }

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  return (
    <>
      {/* Tutorial Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-transparent"
      >
        <HelpCircle className="h-4 w-4" />
        Tutorial
      </Button>

      {/* Tutorial Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Game Tutorial
              </DialogTitle>
              <Badge variant="outline">
                Step {currentStep + 1} of {tutorialSteps.length}
              </Badge>
            </div>
            <DialogDescription>{tutorialSteps[currentStep].description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Tutorial Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{tutorialSteps[currentStep].title}</CardTitle>
              </CardHeader>
              <CardContent>{tutorialSteps[currentStep].content}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {showTutorial && (
                  <Button variant="ghost" onClick={skipTutorial}>
                    Skip Tutorial
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Previous
                </Button>

                {currentStep === tutorialSteps.length - 1 ? (
                  <Button onClick={completeTutorial} className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Start Playing!
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="flex items-center gap-1">
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

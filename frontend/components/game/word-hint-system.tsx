"use client"

import { useState, useEffect } from "react"
import { useDifficulty } from "@/contexts/difficulty-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, Eye, EyeOff, Sparkles, Target } from "lucide-react"

interface WordHint {
  id: string
  type: "category" | "length" | "starts_with" | "contains" | "definition" | "rhyme"
  content: string
  cost: number
  revealed: boolean
}

interface WordHintSystemProps {
  currentWord: string
  guesses: string[]
  gameStatus: "playing" | "won" | "lost"
  onHintUsed: (cost: number) => void
}

export function WordHintSystem({ currentWord, guesses, gameStatus, onHintUsed }: WordHintSystemProps) {
  const { state: difficultyState } = useDifficulty()
  const [availableHints, setAvailableHints] = useState<WordHint[]>([])
  const [hintPoints, setHintPoints] = useState(100)
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    if (currentWord && difficultyState.settings.showHints) {
      generateHints(currentWord)
    }
  }, [currentWord, difficultyState.settings.showHints])

  const generateHints = (word: string) => {
    const hints: WordHint[] = [
      {
        id: "category",
        type: "category",
        content: getCategoryHint(word),
        cost: 10,
        revealed: false,
      },
      {
        id: "length",
        type: "length",
        content: `This word has ${word.length} letters`,
        cost: 5,
        revealed: false,
      },
      {
        id: "starts_with",
        type: "starts_with",
        content: `Starts with "${word[0]}"`,
        cost: 15,
        revealed: false,
      },
      {
        id: "contains",
        type: "contains",
        content: getContainsHint(word),
        cost: 20,
        revealed: false,
      },
      {
        id: "definition",
        type: "definition",
        content: getDefinitionHint(word),
        cost: 25,
        revealed: false,
      },
    ]

    setAvailableHints(hints)
  }

  const getCategoryHint = (word: string): string => {
    const categories = {
      REACT: "Technology/Programming",
      STARK: "Blockchain/Network",
      CHAIN: "Blockchain/Crypto",
      BLOCK: "Blockchain/Building",
      TOKEN: "Cryptocurrency",
      SMART: "Intelligence/Contracts",
      PROOF: "Verification/Evidence",
      LAYER: "Architecture/Level",
      NODES: "Network/Computing",
      BYTES: "Data/Computing",
    }
    return categories[word as keyof typeof categories] || "Common word"
  }

  const getContainsHint = (word: string): string => {
    const vowels = word.split("").filter((letter) => "AEIOU".includes(letter))
    const consonants = word.split("").filter((letter) => !"AEIOU".includes(letter))

    if (vowels.length > consonants.length) {
      return "Contains more vowels than consonants"
    } else if (consonants.length > vowels.length) {
      return "Contains more consonants than vowels"
    }
    return "Has equal vowels and consonants"
  }

  const getDefinitionHint = (word: string): string => {
    const definitions = {
      REACT: "A JavaScript library for building user interfaces",
      STARK: "A layer-2 scaling solution for Ethereum",
      CHAIN: "A series of connected blocks in blockchain",
      BLOCK: "A container of transaction data in blockchain",
      TOKEN: "A digital asset on a blockchain",
      SMART: "Automated contracts that execute themselves",
      PROOF: "Evidence that validates blockchain transactions",
      LAYER: "A level in blockchain architecture",
      NODES: "Computers that maintain the blockchain network",
      BYTES: "Units of digital information",
    }
    return definitions[word as keyof typeof definitions] || "A common English word"
  }

  const revealHint = (hintId: string) => {
    const hint = availableHints.find((h) => h.id === hintId)
    if (!hint || hint.revealed || hintPoints < hint.cost) return

    setHintPoints((prev) => prev - hint.cost)
    setAvailableHints((prev) => prev.map((h) => (h.id === hintId ? { ...h, revealed: true } : h)))
    onHintUsed(hint.cost)
  }

  if (!difficultyState.settings.showHints || gameStatus !== "playing") {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4" />
            Hints Available
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {hintPoints} points
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)} className="h-6 w-6 p-0">
              {showHints ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {showHints && (
        <CardContent className="space-y-3">
          {availableHints.map((hint) => (
            <div key={hint.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                {hint.revealed ? (
                  <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    <Target className="h-3 w-3 inline mr-1" />
                    {hint.content}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    {hint.type.replace("_", " ").toUpperCase()} hint available
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {hint.cost} pts
                </Badge>
                {!hint.revealed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => revealHint(hint.id)}
                    disabled={hintPoints < hint.cost}
                    className="h-6 text-xs"
                  >
                    Reveal
                  </Button>
                )}
              </div>
            </div>
          ))}

          {hintPoints < Math.min(...availableHints.filter((h) => !h.revealed).map((h) => h.cost)) && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-800 text-xs">
                Not enough points for remaining hints. Earn more by playing games!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      )}
    </Card>
  )
}

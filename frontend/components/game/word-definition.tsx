"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Volume2, ExternalLink, Star, Clock } from "lucide-react"

interface WordDefinition {
  word: string
  phonetic: string
  pronunciationAudio?: string
  partOfSpeech: string
  definition: string
  example?: string
  synonyms: string[]
  antonyms: string[]
  etymology?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  frequency: "common" | "uncommon" | "rare"
}

interface WordDefinitionProps {
  word: string
  gameCompleted: boolean
  won: boolean
}

export function WordDefinition({ word, gameCompleted, won }: WordDefinitionProps) {
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDefinition, setShowDefinition] = useState(false)

  useEffect(() => {
    if (gameCompleted && word) {
      fetchDefinition(word)
    }
  }, [gameCompleted, word])

  const fetchDefinition = async (searchWord: string) => {
    setIsLoading(true)
    try {
      // In a real app, you'd call a dictionary API like Merriam-Webster or Oxford
      // For demo, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockDefinition = generateMockDefinition(searchWord)
      setDefinition(mockDefinition)
      setShowDefinition(true)
    } catch (error) {
      console.error("Failed to fetch definition:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockDefinition = (word: string): WordDefinition => {
    const definitions: Record<string, Partial<WordDefinition>> = {
      REACT: {
        phonetic: "/riˈækt/",
        partOfSpeech: "verb",
        definition: "To respond or behave in a particular way as a result of or in response to something.",
        example: "She reacted angrily to the news.",
        synonyms: ["respond", "reply", "answer", "reciprocate"],
        antonyms: ["ignore", "disregard"],
        etymology: "From Latin 're-' (back) + 'agere' (to do, drive)",
        difficulty: "intermediate",
        frequency: "common",
      },
      STARK: {
        phonetic: "/stɑːrk/",
        partOfSpeech: "adjective",
        definition: "Severe or bare in appearance or outline; unpleasantly or sharply clear.",
        example: "The stark reality of the situation became clear.",
        synonyms: ["bare", "plain", "simple", "austere", "harsh"],
        antonyms: ["ornate", "decorated", "embellished"],
        etymology: "From Old English 'stearc' meaning stiff, strong",
        difficulty: "intermediate",
        frequency: "common",
      },
      CHAIN: {
        phonetic: "/tʃeɪn/",
        partOfSpeech: "noun",
        definition: "A series of connected metal links used for fastening or securing something, or for pulling loads.",
        example: "The dog was secured with a chain.",
        synonyms: ["link", "bond", "connection", "series"],
        antonyms: ["break", "separation"],
        etymology: "From Old French 'chaeine', from Latin 'catena'",
        difficulty: "beginner",
        frequency: "common",
      },
      BLOCK: {
        phonetic: "/blɒk/",
        partOfSpeech: "noun",
        definition: "A large solid piece of hard material, especially rock, stone, or wood.",
        example: "A block of wood was used as a doorstop.",
        synonyms: ["chunk", "piece", "lump", "mass"],
        antonyms: ["fragment", "particle"],
        etymology: "From Old French 'bloc', possibly from Middle Dutch 'blok'",
        difficulty: "beginner",
        frequency: "common",
      },
      TOKEN: {
        phonetic: "/ˈtoʊkən/",
        partOfSpeech: "noun",
        definition: "A thing serving as a visible or tangible representation of a fact, quality, feeling, etc.",
        example: "He gave her a token of his appreciation.",
        synonyms: ["symbol", "sign", "representation", "indicator"],
        antonyms: ["reality", "substance"],
        etymology: "From Old English 'tacen', meaning sign or symbol",
        difficulty: "intermediate",
        frequency: "common",
      },
    }

    const baseDefinition = definitions[word] || {
      phonetic: "/wɜːrd/",
      partOfSpeech: "noun",
      definition: "A single distinct meaningful element of speech or writing.",
      example: "This is an example sentence.",
      synonyms: ["term", "expression"],
      antonyms: [],
      etymology: "Etymology not available",
      difficulty: "intermediate" as const,
      frequency: "common" as const,
    }

    return {
      word,
      ...baseDefinition,
      synonyms: baseDefinition.synonyms || [],
      antonyms: baseDefinition.antonyms || [],
    } as WordDefinition
  }

  const playPronunciation = () => {
    if (definition?.pronunciationAudio) {
      const audio = new Audio(definition.pronunciationAudio)
      audio.play().catch(() => {
        console.log("Could not play pronunciation audio")
      })
    } else {
      // Fallback: use speech synthesis
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "common":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "uncommon":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "rare":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!gameCompleted) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Word Definition
          </CardTitle>
          {!showDefinition && (
            <Button variant="outline" size="sm" onClick={() => setShowDefinition(true)} disabled={isLoading}>
              {isLoading ? "Loading..." : "Show Definition"}
            </Button>
          )}
        </div>
      </CardHeader>

      {showDefinition && definition && (
        <CardContent className="space-y-4">
          {/* Word Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold">{definition.word}</h3>
              <Button variant="ghost" size="sm" onClick={playPronunciation} className="h-8 w-8 p-0">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(definition.difficulty)}>{definition.difficulty}</Badge>
              <Badge className={getFrequencyColor(definition.frequency)}>{definition.frequency}</Badge>
            </div>
          </div>

          {/* Pronunciation */}
          <div className="text-lg text-gray-600 font-mono">{definition.phonetic}</div>

          <Separator />

          {/* Main Definition */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{definition.partOfSpeech}</Badge>
            </div>
            <p className="text-gray-900 leading-relaxed">{definition.definition}</p>
            {definition.example && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 italic">"{definition.example}"</p>
              </div>
            )}
          </div>

          {/* Synonyms and Antonyms */}
          {(definition.synonyms.length > 0 || definition.antonyms.length > 0) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {definition.synonyms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Synonyms</h4>
                    <div className="flex flex-wrap gap-1">
                      {definition.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {definition.antonyms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Antonyms</h4>
                    <div className="flex flex-wrap gap-1">
                      {definition.antonyms.map((antonym, index) => (
                        <Badge key={index} variant="outline" className="text-red-700 border-red-300">
                          {antonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Etymology */}
          {definition.etymology && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Etymology
                </h4>
                <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded-lg">{definition.etymology}</p>
              </div>
            </>
          )}

          {/* External Links */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Want to learn more about this word?</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`https://www.merriam-webster.com/dictionary/${word.toLowerCase()}`, "_blank")
                }
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Dictionary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://www.etymonline.com/search?q=${word.toLowerCase()}`, "_blank")}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Etymology
              </Button>
            </div>
          </div>

          {/* Game Result Context */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800">{won ? "Congratulations!" : "Better luck next time!"}</span>
            </div>
            <p className="text-sm text-blue-700">
              {won
                ? `You successfully guessed "${word}"! Understanding word meanings can help improve your future guesses.`
                : `The word was "${word}". Learning its definition will help you recognize similar patterns in future games.`}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

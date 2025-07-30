"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trophy, Crown, Medal, Clock, Target, Flame, Users } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar?: string
  score: number
  gamesPlayed: number
  winRate: number
  currentStreak: number
  bestStreak: number
  averageTime: number
  averageAttempts: number
  lastActive: string
  isCurrentUser?: boolean
}

interface Tournament {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  participants: number
  prize: string
  status: "upcoming" | "active" | "completed"
  category: "overall" | "speed" | "streak" | "difficulty"
}

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<{
    overall: LeaderboardEntry[]
    weekly: LeaderboardEntry[]
    monthly: LeaderboardEntry[]
    allTime: LeaderboardEntry[]
  } | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboardData()
      fetchTournaments()
    }
  }, [isOpen])

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData = generateMockLeaderboard()
      setLeaderboardData(mockData)
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTournaments = async () => {
    const mockTournaments: Tournament[] = [
      {
        id: "weekly_speed",
        name: "Speed Challenge",
        description: "Fastest completion times win!",
        startDate: "2024-01-15",
        endDate: "2024-01-22",
        participants: 1247,
        prize: "Exclusive Speed Demon Badge",
        status: "active",
        category: "speed",
      },
      {
        id: "monthly_streak",
        name: "Streak Master",
        description: "Longest win streak competition",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        participants: 3421,
        prize: "1000 Bonus Points + Crown Badge",
        status: "active",
        category: "streak",
      },
      {
        id: "expert_challenge",
        name: "Expert Only Tournament",
        description: "Expert difficulty only - prove your skills!",
        startDate: "2024-02-01",
        endDate: "2024-02-07",
        participants: 0,
        prize: "Master Player Title",
        status: "upcoming",
        category: "difficulty",
      },
    ]
    setTournaments(mockTournaments)
  }

  const generateMockLeaderboard = () => {
    const generateEntries = (count: number): LeaderboardEntry[] => {
      return Array.from({ length: count }, (_, i) => ({
        rank: i + 1,
        userId: `user_${i + 1}`,
        username: `Player${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
        score: Math.floor(Math.random() * 50000) + 10000,
        gamesPlayed: Math.floor(Math.random() * 500) + 50,
        winRate: Math.floor(Math.random() * 40) + 60,
        currentStreak: Math.floor(Math.random() * 20),
        bestStreak: Math.floor(Math.random() * 50) + 10,
        averageTime: Math.floor(Math.random() * 180) + 60,
        averageAttempts: Math.random() * 2 + 3,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrentUser: i === 15, // Mock current user at rank 16
      }))
    }

    return {
      overall: generateEntries(50),
      weekly: generateEntries(50),
      monthly: generateEntries(50),
      allTime: generateEntries(100),
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-100 text-yellow-800 border-yellow-300",
        2: "bg-gray-100 text-gray-800 border-gray-300",
        3: "bg-amber-100 text-amber-800 border-amber-300",
      }
      return <Badge className={colors[rank as keyof typeof colors]}>Top {rank}</Badge>
    } else if (rank <= 10) {
      return <Badge variant="outline">Top 10</Badge>
    } else if (rank <= 100) {
      return <Badge variant="secondary">Top 100</Badge>
    }
    return null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTournamentStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Loading Leaderboard...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Trophy className="h-4 w-4" />
          Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Global Leaderboard
          </DialogTitle>
          <DialogDescription>Compete with players worldwide and climb the rankings!</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overall" className="w-full h-[70vh]">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>

          {leaderboardData && (
            <>
              <TabsContent value="overall" className="h-full">
                <LeaderboardTable entries={leaderboardData.overall} />
              </TabsContent>
              <TabsContent value="weekly" className="h-full">
                <LeaderboardTable entries={leaderboardData.weekly} />
              </TabsContent>
              <TabsContent value="monthly" className="h-full">
                <LeaderboardTable entries={leaderboardData.monthly} />
              </TabsContent>
              <TabsContent value="alltime" className="h-full">
                <LeaderboardTable entries={leaderboardData.allTime} />
              </TabsContent>
            </>
          )}

          <TabsContent value="tournaments" className="h-full">
            <div className="space-y-4 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Tournaments</h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {tournaments.reduce((sum, t) => sum + t.participants, 0)} participants
                </Badge>
              </div>

              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="space-y-4">
                  {tournaments.map((tournament) => (
                    <Card key={tournament.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{tournament.name}</CardTitle>
                          <Badge className={getTournamentStatusColor(tournament.status)}>{tournament.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{tournament.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Participants:</span>
                            <div className="font-semibold">{tournament.participants.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Prize:</span>
                            <div className="font-semibold text-yellow-600">{tournament.prize}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Start Date:</span>
                            <div className="font-semibold">{new Date(tournament.startDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">End Date:</span>
                            <div className="font-semibold">{new Date(tournament.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {tournament.category === "speed" && <Clock className="h-4 w-4 text-blue-500" />}
                            {tournament.category === "streak" && <Flame className="h-4 w-4 text-orange-500" />}
                            {tournament.category === "difficulty" && <Target className="h-4 w-4 text-red-500" />}
                            <span className="text-sm capitalize">{tournament.category} Challenge</span>
                          </div>

                          <Button
                            size="sm"
                            disabled={tournament.status === "completed"}
                            variant={tournament.status === "active" ? "default" : "outline"}
                          >
                            {tournament.status === "active"
                              ? "Join Now"
                              : tournament.status === "upcoming"
                                ? "Register"
                                : "View Results"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )

  function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
    return (
      <ScrollArea className="h-full">
        <div className="space-y-2">
          {entries.map((entry) => (
            <Card
              key={entry.userId}
              className={`transition-all hover:shadow-md ${
                entry.isCurrentUser ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {getRankIcon(entry.rank)}
                      {getRankBadge(entry.rank)}
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.username} />
                        <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {entry.username}
                          {entry.isCurrentUser && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Last active: {new Date(entry.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{entry.score.toLocaleString()}</div>
                      <div className="text-gray-600">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{entry.winRate}%</div>
                      <div className="text-gray-600">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {entry.currentStreak}
                      </div>
                      <div className="text-gray-600">Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{formatTime(entry.averageTime)}</div>
                      <div className="text-gray-600">Avg Time</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    )
  }
}

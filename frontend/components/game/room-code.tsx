import { Card, CardContent } from "@/components/ui/card"

interface RoomCodeProps {
  code: string
}

export function RoomCode({ code }: RoomCodeProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30">
      <CardContent className="p-6 text-center">
        <p className="text-gray-300 text-sm mb-2">Room Code</p>
        <p className="text-4xl font-bold text-white font-mono tracking-wider">{code}</p>
        <p className="text-gray-400 text-xs mt-2">Share this code with your friend</p>
      </CardContent>
    </Card>
  )
}

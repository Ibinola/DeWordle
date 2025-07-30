"use client"

import { useEffect, useState } from "react"
import { useOfflineStatus } from "@/hooks/use-offline-status"
import { offlineStorage, type GameResult } from "@/lib/offline-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface SyncManagerProps {
  onSyncComplete?: (syncedCount: number) => void
}

export function SyncManager({ onSyncComplete }: SyncManagerProps) {
  const { isOnline, wasOffline } = useOfflineStatus()
  const [unsyncedResults, setUnsyncedResults] = useState<GameResult[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    updateUnsyncedResults()
  }, [])

  useEffect(() => {
    if (isOnline && wasOffline && unsyncedResults.length > 0) {
      // Auto-sync when coming back online
      handleSync()
    }
  }, [isOnline, wasOffline])

  const updateUnsyncedResults = () => {
    const results = offlineStorage.getUnsyncedResults()
    setUnsyncedResults(results)
  }

  const handleSync = async () => {
    if (!isOnline || unsyncedResults.length === 0) return

    setIsSyncing(true)
    setSyncError(null)
    setSyncProgress(0)

    try {
      // Simulate API calls to sync results
      const totalResults = unsyncedResults.length
      const syncedIds: string[] = []

      for (let i = 0; i < unsyncedResults.length; i++) {
        const result = unsyncedResults[i]

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate API call to sync result
        const success = await syncResultToBackend(result)

        if (success) {
          syncedIds.push(result.id)
        }

        setSyncProgress(((i + 1) / totalResults) * 100)
      }

      // Mark results as synced in local storage
      if (syncedIds.length > 0) {
        offlineStorage.markResultsSynced(syncedIds)
        updateUnsyncedResults()
        onSyncComplete?.(syncedIds.length)
      }

      if (syncedIds.length < unsyncedResults.length) {
        setSyncError(`Synced ${syncedIds.length}/${unsyncedResults.length} results. Some failed to sync.`)
      }
    } catch (error) {
      setSyncError("Failed to sync results. Please try again.")
      console.error("Sync error:", error)
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  // Simulate backend API call
  const syncResultToBackend = async (result: GameResult): Promise<boolean> => {
    // This would be your actual API call to StarkNet or your backend
    // For demo purposes, we'll simulate success/failure

    try {
      // Simulate API call
      const response = await fetch("/api/sync-game-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      })

      return response.ok
    } catch (error) {
      // Simulate occasional failures
      return Math.random() > 0.1 // 90% success rate
    }
  }

  if (!wasOffline && unsyncedResults.length === 0) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Upload className="h-4 w-4" />
          Sync Manager
          {unsyncedResults.length > 0 && <Badge variant="outline">{unsyncedResults.length} pending</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {unsyncedResults.length > 0 ? (
          <>
            <div className="text-sm text-gray-600">
              You have {unsyncedResults.length} offline game result{unsyncedResults.length !== 1 ? "s" : ""} waiting to
              sync.
            </div>

            {isSyncing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing results...
                </div>
                <Progress value={syncProgress} className="w-full" />
              </div>
            )}

            {syncError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-3 w-3" />
                {syncError}
              </div>
            )}

            <Button onClick={handleSync} disabled={!isOnline || isSyncing} className="w-full" size="sm">
              {isSyncing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3 mr-2" />
                  Sync to Blockchain
                </>
              )}
            </Button>

            {!isOnline && <div className="text-xs text-gray-500 text-center">Connect to internet to sync results</div>}
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-3 w-3" />
            All results synced
          </div>
        )}
      </CardContent>
    </Card>
  )
}

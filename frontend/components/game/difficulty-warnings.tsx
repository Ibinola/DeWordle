"use client"

import { useDifficulty } from "@/contexts/difficulty-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, XCircle, Info } from "lucide-react"

export function DifficultyWarnings() {
  const { state } = useDifficulty()

  if (state.currentViolations.length === 0) {
    return null
  }

  const errors = state.currentViolations.filter((v) => v.severity === "error")
  const warnings = state.currentViolations.filter((v) => v.severity === "warning")

  return (
    <div className="space-y-2">
      {/* Error violations */}
      {errors.map((violation) => (
        <Alert key={violation.id} className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{violation.description}</span>
              <Badge variant="destructive" className="ml-2">
                Rule Violation
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {/* Warning violations */}
      {warnings.map((violation) => (
        <Alert key={violation.id} className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <span>{violation.description}</span>
              <Badge variant="outline" className="ml-2 border-yellow-300 text-yellow-700">
                Suggestion
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {/* Hard mode info */}
      {state.settings.hardModeEnabled && state.currentViolations.length === 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>Hard mode is active - you must use all revealed letters</span>
              <Badge variant="outline" className="ml-2 border-blue-300 text-blue-700">
                Hard Mode
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

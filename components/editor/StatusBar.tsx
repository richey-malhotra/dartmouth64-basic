'use client'

import { AlertCircle, CheckCircle, Play, Square } from 'lucide-react'

interface StatusBarProps {
  isRunning: boolean
  currentLine: number | null
  cursorPosition?: { line: number; column: number }
  language?: string
  executionState?: 'ready' | 'running' | 'paused' | 'error'
  errors?: number
}

export function StatusBar({ 
  isRunning, 
  currentLine, 
  cursorPosition = { line: 1, column: 1 },
  language = 'Dartmouth BASIC',
  executionState = 'ready',
  errors = 0
}: StatusBarProps) {
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-xs font-medium">
      {/* Left side - Execution status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {isRunning ? (
            <>
              <Square size={12} />
              <span>Running</span>
            </>
          ) : (
            <>
              <Play size={12} />
              <span>Ready</span>
            </>
          )}
        </div>
        
        {currentLine && (
          <div className="flex items-center gap-1">
            <span>Line: {currentLine}</span>
          </div>
        )}

        {errors > 0 && (
          <div className="flex items-center gap-1 text-[#f48771]">
            <AlertCircle size={12} />
            <span>{errors} Error{errors !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Right side - Editor info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span>{language}</span>
        </div>

        <div className="flex items-center gap-1">
          <CheckCircle size={12} />
          <span>RBASIC-D64</span>
        </div>
      </div>
    </div>
  )
}
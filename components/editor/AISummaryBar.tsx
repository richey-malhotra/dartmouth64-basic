'use client'

import { RefreshCw, Bot } from 'lucide-react'
import { Button } from '../ui/button'

interface AISummaryBarProps {
  summary?: string
}

export function AISummaryBar({
  summary = 'The program greets the learner, captures NAME$ and AGE, then branches at lines 60 and 70 to surface conditional thinking. Step through once to emphasise how a single INPUT shapes every downstream decision.'
}: AISummaryBarProps) {
  return (
  <div className="glass-panel-strong border border-surface-divider/70 rounded-2xl bg-gradient-to-b from-[#101727]/85 via-[#0e1524]/88 to-[#0b111d]/92 flex flex-col p-4 gap-3 min-h-[220px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[radial-gradient(circle_at_30%_30%,rgba(75,192,255,0.55),rgba(16,22,34,0.85))] flex items-center justify-center shadow-[0_12px_28px_-20px_rgba(75,192,255,0.8)]">
            <Bot className="w-4 h-4 text-accentCyan-foreground" />
          </div>
          <div>
            <div className="ai-chip">
              <span>AI Mentor</span>
            </div>
            <p className="text-base font-semibold text-foreground/90 mt-2">Coach notes for this run</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg text-accentCyan hover:bg-accentCyan/10"
          title="Regenerate insight"
          aria-label="Regenerate AI insight"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Summary Content - Scrollable */}
      <div className="flex-1 overflow-auto min-h-0 glass-panel rounded-xl border border-surface-divider/60 p-4">
        <div className="text-sm text-foreground/80 leading-relaxed tracking-wide pr-2">
          {summary}
        </div>
      </div>
    </div>
  )
}
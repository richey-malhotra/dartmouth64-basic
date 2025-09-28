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
  <div className="ai-mentor-card glass-panel-strong card-surface border border-[rgba(120,137,255,0.22)] ring-1 ring-[rgba(123,134,255,0.32)] ring-offset-2 ring-offset-[rgba(11,18,33,0.75)] bg-gradient-to-b from-[#101727]/88 via-[#0e1524]/84 to-[#0b111d]/94 flex flex-col p-4 gap-4 min-h-[220px] flex-shrink-0 shadow-[0_24px_48px_-36px_rgba(26,35,70,0.85)]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between flex-shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.58),rgba(16,22,34,0.85))] flex items-center justify-center shadow-[0_16px_32px_-22px_rgba(99,102,241,0.75)] ring-1 ring-[rgba(123,134,255,0.5)]">
            <Bot className="w-4 h-4 text-accentCyan-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold tracking-[0.32em] uppercase text-white/75">
              AI Mentor Channel
            </label>
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/55">
              Contextual guidance updates in real time
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg text-accentCyan border border-[rgba(123,134,255,0.28)]/50 hover:bg-accentCyan/10"
          title="Regenerate insight"
          aria-label="Regenerate AI insight"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Summary Content - Scrollable */}
  <div className="flex-1 overflow-auto min-h-0 glass-panel card-surface border border-[rgba(123,134,255,0.22)] p-4">
        <div className="text-sm text-foreground/80 leading-relaxed tracking-wide pr-2">
          {summary}
        </div>
      </div>
    </div>
  )
}
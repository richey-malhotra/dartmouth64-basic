'use client'

interface StatusBarProps {
  line: number
  column: number
  status: 'READY' | 'RUNNING'
  user: string
  totalLines: number
  minimumSteps: number | null
  executionLabel: string
  deterministic: boolean
}

export function StatusBar({ line, column, status, user, totalLines, minimumSteps, executionLabel, deterministic }: StatusBarProps) {
  const isRunning = status === 'RUNNING'
  const minStepsLabel = minimumSteps !== null ? `${minimumSteps}` : 'Depends on input'
  const modeAccent = 'text-emerald-300 border-emerald-400/40 bg-emerald-500/6'
  
  return (
    <div className="h-12 px-4 lg:px-6 flex items-center justify-between glass-panel card-surface border border-surface-divider/70 text-sm text-foreground/80 backdrop-blur-xl shadow-[0_12px_32px_-26px_rgba(20,28,45,0.75)]">
      {/* Left side: Status badges */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isRunning ? 'bg-accentCyan animate-pulse' : 'bg-emerald-400'
            } shadow-[0_0_12px_rgba(75,192,255,0.6)]`}
          />
          <span className="uppercase tracking-wider text-xs font-semibold">
            {status}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground/80">
          <span className="px-2 py-0.5 rounded-md border border-surface-divider/70 bg-white/5">
            @{user}
          </span>
        </div>
      </div>

      {/* Middle: Program metrics */}
      <div className="flex-1 flex items-center justify-center">
        <div className="hidden md:flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg border border-surface-divider/60 bg-white/5 font-mono text-xs tracking-wide text-foreground/85">
            Lines {totalLines}
          </div>
          <div className="px-2.5 py-1 rounded-lg border border-surface-divider/60 bg-white/5 font-mono text-xs tracking-wide text-foreground/85">
            Steps {minStepsLabel}
          </div>
          {deterministic && (
            <div className={`px-2.5 py-1 rounded-lg border ${modeAccent} text-xs uppercase tracking-[0.18em]`}>
              {executionLabel}
            </div>
          )}
        </div>
        <div className="md:hidden flex items-center gap-3 text-[10px] text-muted-foreground/70 uppercase tracking-[0.18em]">
          <span>Lines {totalLines}</span>
          <span>Steps {minStepsLabel}</span>
        </div>
      </div>

      {/* Right side: Cursor Position */}
      <div className="flex items-center gap-2 text-xs flex-shrink-0">
        <span className="hidden md:inline text-muted-foreground/70 uppercase tracking-widest">Cursor</span>
        <div className="px-3 py-1 rounded-lg border border-surface-divider/70 bg-white/5 font-mono text-foreground/90">
          Ln {line} · Col {column}
        </div>
      </div>
    </div>
  )
}
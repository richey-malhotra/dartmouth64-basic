'use client'

interface StatusBarProps {
  line: number
  column: number
  status: 'READY' | 'RUNNING'
  version: string
  user: string
}

export function StatusBar({ line, column, status, version, user }: StatusBarProps) {
  const isRunning = status === 'RUNNING'
  
  return (
    <div className="h-10 px-4 lg:px-6 flex items-center justify-between glass-panel border-t border-surface-divider/70 text-sm text-foreground/80 backdrop-blur-xl">
      {/* Left side: Status badges */}
      <div className="flex items-center gap-4">
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
            Build {version}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-surface-divider/70 bg-white/5">
            @{user}
          </span>
        </div>
      </div>

      {/* Right side: Cursor Position */}
      <div className="flex items-center gap-2 text-xs">
        <span className="hidden md:inline text-muted-foreground/70 uppercase tracking-widest">Cursor</span>
        <div className="px-3 py-1 rounded-lg border border-surface-divider/70 bg-white/5 font-mono text-foreground/90">
          Ln {line} · Col {column}
        </div>
      </div>
    </div>
  )
}
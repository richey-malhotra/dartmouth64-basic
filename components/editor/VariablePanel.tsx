'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { VariableState } from './types'

interface VariablePanelProps {
  variables: Map<string, VariableState>
  currentLine?: number | null
}

export function VariablePanel({ variables, currentLine }: VariablePanelProps) {
  const [highlightedVars, setHighlightedVars] = useState<Set<string>>(new Set())

  // Track recently changed variables for highlighting
  useEffect(() => {
    const newHighlighted = new Set<string>()
    variables.forEach((variable, name) => {
      if (variable.lastChanged === currentLine || variable.changed) {
        newHighlighted.add(name)
      }
    })
    setHighlightedVars(newHighlighted)

    // Clear highlights after animation
    if (newHighlighted.size > 0) {
      const timer = setTimeout(() => {
        setHighlightedVars(new Set())
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [variables, currentLine])

  const variableArray = Array.from(variables.entries()).sort(([a], [b]) => a.localeCompare(b))

  if (variableArray.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground/70">
        <div className="glass-panel border border-surface-divider/70 rounded-2xl px-6 py-5 text-center shadow-[0_18px_38px_-28px_rgba(16,24,46,0.85)]">
          <div className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/60">Variables</div>
          <div className="text-base text-foreground/85 mt-2">No variables yet</div>
          <div className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wider">Use <span className="text-accentCyan">LET</span> to declare</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="h-full overflow-y-auto pr-3 space-y-3">
        {variableArray.map(([name, variable]) => (
          <div
            key={name}
            className={cn(
              'relative px-4 py-3 rounded-2xl glass-panel-strong border border-surface-divider/70 transition-all duration-300 shadow-[0_18px_46px_-34px_rgba(15,21,38,0.85)]',
              highlightedVars.has(name) && 'border-[rgba(75,192,255,0.6)] shadow-[0_22px_52px_-32px_rgba(75,192,255,0.65)]'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground/90 tracking-wide">{name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground/60">{variable.type}</div>
              </div>
              <div
                className={cn(
                  'font-mono text-base px-3 py-1 rounded-xl border border-transparent bg-[rgba(14,20,34,0.72)]',
                  highlightedVars.has(name) && 'animate-variable-highlight-border'
                )}
              >
                {variable.type === 'string' ? (
                  <span className="text-accentMagenta">&ldquo;{variable.value}&rdquo;</span>
                ) : (
                  <span className="text-accentEmerald">{variable.value}</span>
                )}
              </div>
            </div>
            {(variable.lastChanged || variable.changed) && (
              <div className="mt-2 text-[0.65rem] text-accentCyan/75 uppercase tracking-[0.25em]">
                {variable.lastChanged ? `Updated on line ${variable.lastChanged}` : 'Recently updated'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
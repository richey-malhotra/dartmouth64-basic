'use client'

import { cn } from '@/lib/utils'
import type { ArrayState, ScalarValue } from './types'

interface ArrayVisualizationProps {
  arrays: Map<string, ArrayState>
}

export function ArrayVisualization({ arrays }: ArrayVisualizationProps) {
  const arrayEntries = Array.from(arrays.entries())

  if (arrayEntries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground/70">
        <div className="glass-panel border border-surface-divider/70 rounded-2xl px-6 py-5 text-center shadow-[0_18px_38px_-28px_rgba(16,24,46,0.85)]">
          <div className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/60">Arrays</div>
          <div className="text-base text-foreground/85 mt-2">No arrays yet</div>
          <div className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wider">Use <span className="text-accentMagenta">DIM</span> to allocate</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Array Visualization */}
      <div className="flex-1 overflow-auto p-4 space-y-4 pr-3">
        {arrayEntries.map(([name, array]) => (
          <ArrayGrid key={name} array={array} />
        ))}
      </div>
    </div>
  )
}

function ArrayGrid({ array }: { array: ArrayState }) {
  const { name, dimensions, values, recentlyAccessed, bounds, type } = array

  // Handle 1D arrays
  if (dimensions.length === 1) {
    const [start, end] = bounds[0]
    const size = end - start + 1
    
    return (
      <div className="glass-panel-strong border border-surface-divider/70 rounded-2xl px-4 py-4 shadow-[0_20px_48px_-32px_rgba(16,24,46,0.9)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-foreground/90 tracking-wide">{name}</div>
            <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground/60">1D · {dimensions[0]} elements</div>
          </div>
          <div className="text-[0.65rem] uppercase tracking-[0.25em] text-accentMagenta/70">Bounds {start}-{end}</div>
        </div>
        
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${Math.min(size, 10)}, minmax(78px, 1fr))` }}
        >
          {Array.from({ length: size }, (_, i) => {
            const index = start + i
            const key = `${index}`
            const fallbackValue: ScalarValue = type === 'string' ? '' : 0
            const value = values.get(key) ?? fallbackValue
            const isAccessed = recentlyAccessed.has(key)
            const isChanged = array.recentlyChanged?.has(key)
            
            return (
              <div
                key={index}
                className={cn(
                  'array-cell h-[72px] flex flex-col items-center justify-center rounded-xl border border-surface-divider/70 bg-[rgba(11,16,27,0.85)] transition-all duration-300 shadow-[0_8px_18px_-14px_rgba(12,20,34,0.85)]',
                  isAccessed && 'animate-variable-highlight-border border-[rgba(75,192,255,0.65)] shadow-[0_16px_32px_-20px_rgba(75,192,255,0.6)]',
                  isChanged && 'border-[rgba(201,93,245,0.65)] shadow-[0_16px_32px_-18px_rgba(201,93,245,0.6)]'
                )}
              >
                <div>
                  <div className="text-muted-foreground/60 text-[0.65rem] uppercase tracking-[0.3em]">
                    [{index}]
                  </div>
                  <div className={type === 'string' ? 'text-accentMagenta text-sm font-mono' : 'text-accentEmerald text-sm font-mono'}>
                    {type === 'string' ? `"${value}"` : value}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {size > 10 && (
          <div className="text-[0.7rem] text-muted-foreground/70 mt-3 uppercase tracking-[0.25em]">
            Showing first 10 elements of {size} total
          </div>
        )}
      </div>
    )
  }

  // Handle 2D arrays
  if (dimensions.length === 2) {
    const [rowStart, rowEnd] = bounds[0]
    const [colStart, colEnd] = bounds[1]
    const rows = rowEnd - rowStart + 1
    const cols = colEnd - colStart + 1
    
    return (
      <div className="glass-panel-strong border border-surface-divider/70 rounded-2xl px-4 py-4 shadow-[0_20px_48px_-32px_rgba(16,24,46,0.9)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-foreground/90 tracking-wide">{name}</div>
            <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground/60">2D · {dimensions[0]} × {dimensions[1]}</div>
          </div>
          <div className="text-[0.65rem] uppercase tracking-[0.25em] text-accentMagenta/70">
            Rows {rowStart}-{rowEnd} · Cols {colStart}-{colEnd}
          </div>
        </div>
        
        <div className="overflow-auto">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${Math.min(cols, 8)}, minmax(80px, 1fr))` }}
          >
            {Array.from({ length: Math.min(rows, 8) }, (_, i) =>
              Array.from({ length: Math.min(cols, 8) }, (_, j) => {
                const rowIndex = rowStart + i
                const colIndex = colStart + j
                const key = `${rowIndex},${colIndex}`
                const fallbackValue: ScalarValue = type === 'string' ? '' : 0
                const value = values.get(key) ?? fallbackValue
                const isAccessed = recentlyAccessed.has(key)
                const isChanged = array.recentlyChanged?.has(key)
                
                return (
                  <div
                    key={key}
                    className={cn(
                      'array-cell h-[74px] flex flex-col items-center justify-center rounded-xl border border-surface-divider/70 bg-[rgba(11,16,27,0.85)] transition-all duration-300 shadow-[0_8px_18px_-14px_rgba(12,20,34,0.85)]',
                      isAccessed && 'animate-variable-highlight-border border-[rgba(75,192,255,0.65)] shadow-[0_16px_32px_-20px_rgba(75,192,255,0.6)]',
                      isChanged && 'border-[rgba(201,93,245,0.65)] shadow-[0_16px_32px_-18px_rgba(201,93,245,0.6)]'
                    )}
                  >
                    <div>
                      <div className="text-muted-foreground/60 text-[0.6rem] uppercase tracking-[0.3em]">
                        [{rowIndex},{colIndex}]
                      </div>
                      <div className={type === 'string' ? 'text-accentMagenta text-sm font-mono' : 'text-accentEmerald text-sm font-mono'}>
                        {type === 'string' ? `"${value}"` : value}
                      </div>
                    </div>
                  </div>
                )
              })
            ).flat()}
          </div>
          
          {(rows > 8 || cols > 8) && (
            <div className="text-[0.7rem] text-muted-foreground/70 mt-3 uppercase tracking-[0.25em]">
              Showing {Math.min(rows, 8)}×{Math.min(cols, 8)} of {rows}×{cols} total
            </div>
          )}
        </div>
      </div>
    )
  }

  // Handle higher dimensions (rare in BASIC)
  return (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <div className="text-sm font-semibold mb-2">{name}</div>
      <div className="text-xs">
        {dimensions.length}D Array ({dimensions.join('×')})
      </div>
      <div className="text-xs mt-2">
        Higher-dimensional arrays not fully visualized
      </div>
    </div>
  )
}
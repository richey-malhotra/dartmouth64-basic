'use client'

import { useEffect, useState } from 'react'

interface ArrayState {
  name: string
  dimensions: number[]
  values: Map<string, any>
  recentlyAccessed: Set<string>
  bounds: [number, number][]
  type: 'number' | 'string'
}

interface ArrayVisualizationProps {
  arrays: Map<string, ArrayState>
  currentLine?: number | null
}

export function ArrayVisualization({ arrays, currentLine }: ArrayVisualizationProps) {
  const arrayEntries = Array.from(arrays.entries())

  if (arrayEntries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">No arrays yet</div>
          <div className="text-xs mt-1">Use DIM to create arrays</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Array Visualization */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
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
      <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {name}({dimensions[0]}) - 1D Array
        </div>
        
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(size, 10)}, 1fr)` }}>
          {Array.from({ length: size }, (_, i) => {
            const index = start + i
            const key = `${index}`
            const value = values.get(key) ?? (type === 'string' ? '' : 0)
            const isAccessed = recentlyAccessed.has(key)
            
            return (
              <div
                key={index}
                className={`array-cell p-2 text-center text-xs font-mono min-h-[40px] flex items-center justify-center rounded-lg border-2 transition-colors duration-300 ${
                  isAccessed 
                    ? 'animate-variable-highlight-border' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-[10px]">
                    [{index}]
                  </div>
                  <div className={type === 'string' ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}>
                    {type === 'string' ? `"${value}"` : value}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {size > 10 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
      <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {name}({dimensions[0]},{dimensions[1]}) - 2D Array
        </div>
        
        <div className="overflow-auto">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 8)}, 1fr)` }}>
            {Array.from({ length: Math.min(rows, 8) }, (_, i) => 
              Array.from({ length: Math.min(cols, 8) }, (_, j) => {
                const rowIndex = rowStart + i
                const colIndex = colStart + j
                const key = `${rowIndex},${colIndex}`
                const value = values.get(key) ?? (type === 'string' ? '' : 0)
                const isAccessed = recentlyAccessed.has(key)
                
                return (
                  <div
                    key={key}
                    className={`array-cell p-1 text-center text-xs font-mono min-h-[40px] flex items-center justify-center rounded-lg border-2 transition-colors duration-300 ${
                      isAccessed 
                        ? 'animate-variable-highlight-border' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-[9px]">
                        [{rowIndex},{colIndex}]
                      </div>
                      <div className={type === 'string' ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}>
                        {type === 'string' ? `"${value}"` : value}
                      </div>
                    </div>
                  </div>
                )
              })
            ).flat()}
          </div>
          
          {(rows > 8 || cols > 8) && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
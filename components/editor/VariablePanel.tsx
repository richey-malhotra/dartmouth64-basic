'use client'

import { useEffect, useState } from 'react'

interface Variable {
  name: string
  value: any
  type: 'number' | 'string'
  lastChanged?: number
}

interface VariablePanelProps {
  variables: Map<string, Variable>
  currentLine?: number | null
}

export function VariablePanel({ variables, currentLine }: VariablePanelProps) {
  const [highlightedVars, setHighlightedVars] = useState<Set<string>>(new Set())

  // Track recently changed variables for highlighting
  useEffect(() => {
    const newHighlighted = new Set<string>()
    variables.forEach((variable, name) => {
      if (variable.lastChanged === currentLine) {
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
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">No variables yet</div>
          <div className="text-xs mt-1">Use LET to create variables</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-2">
        {variableArray.map(([name, variable]) => (
          <div
            key={name}
            className={`p-3 rounded-lg border transition-all duration-500 ${
              highlightedVars.has(name)
                ? 'bg-variable-highlight border-variable animate-variable-highlight'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-variable">
                  {name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                  {variable.type}
                </span>
              </div>
              <div className="font-mono text-sm">
                {variable.type === 'string' ? (
                  <span className="text-red-600 dark:text-red-400">
                    "{variable.value}"
                  </span>
                ) : (
                  <span className="text-purple-600 dark:text-purple-400">
                    {variable.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variable Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Total Variables: {variableArray.length}</div>
          <div>
            Numbers: {variableArray.filter(([, v]) => v.type === 'number').length} | 
            Strings: {variableArray.filter(([, v]) => v.type === 'string').length}
          </div>
        </div>
      </div>
    </div>
  )
}
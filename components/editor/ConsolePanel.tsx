'use client'

import { useEffect, useRef } from 'react'

interface ConsolePanelProps {
  output: string[]
}

export function ConsolePanel({ output }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className="h-full flex flex-col bg-console text-console-text">
      {/* Console Header */}
      <div className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border-b border-gray-600 dark:border-gray-600 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-mono">DARTMOUTH BASIC CONSOLE</span>
          <span className="text-gray-400">OUTPUT</span>
        </div>
      </div>

      {/* Console Output */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed"
      >
        {output.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 italic">
            Console output will appear here when you run your program...
          </div>
        ) : (
          <div className="space-y-1">
            {output.map((line, index) => (
              <div 
                key={index}
                className="whitespace-pre-wrap"
                style={{ wordBreak: 'break-word' }}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Footer with Stats */}
      <div className="px-4 py-2 bg-gray-700 dark:bg-gray-600 border-t border-gray-600 text-xs text-gray-300">
        <div className="flex items-center justify-between">
          <span>{output.length} lines of output</span>
          <span className="text-gray-400">OUTPUT</span>
        </div>
      </div>
    </div>
  )
}
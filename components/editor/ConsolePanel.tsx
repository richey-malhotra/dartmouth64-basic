'use client'

import { useEffect, useRef, useState } from 'react'

interface ConsolePanelProps {
  output: string[]
  isActive: boolean
}

export function ConsolePanel({ output, isActive }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [latestLineIndex, setLatestLineIndex] = useState<number | null>(null);
  const prevOutputLength = useRef(output.length);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHighlight = () => {
    if (output.length > 0) {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      const newLineIndex = output.length - 1;
      setLatestLineIndex(newLineIndex);
      
      animationTimeoutRef.current = setTimeout(() => {
        setLatestLineIndex(null);
        animationTimeoutRef.current = null;
      }, 800); // Must match the animation duration
    }
  };

  // Effect for new lines
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }

    if (output.length > prevOutputLength.current) {
      if (isActive) {
        triggerHighlight();
      }
    }
    prevOutputLength.current = output.length;
  }, [output, isActive]);

  // Effect for tab visibility
  useEffect(() => {
    if (isActive) {
      triggerHighlight();
    }
    // Cleanup timeout on component unmount or when isActive changes
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isActive]);

  return (
    <div className="h-full flex flex-col">
      {/* Console Output */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4"
      >
        {output.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-2">🖥️</div>
              <div className="text-sm">No console output yet</div>
              <div className="text-xs mt-1">Use PRINT to display text</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {output.map((line, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-2 transition-colors duration-300 font-mono text-sm ${
                  index === latestLineIndex
                    ? 'animate-variable-highlight-border'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                <span className="text-gray-700 dark:text-gray-300">{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
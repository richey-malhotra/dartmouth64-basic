'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface ConsolePanelProps {
  output: string[]
  isActive: boolean
}

export function ConsolePanel({ output, isActive }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [latestLineIndex, setLatestLineIndex] = useState<number | null>(null);
  const prevOutputLength = useRef(output.length);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHighlight = useCallback(() => {
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
  }, [output]);

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
  }, [output, isActive, triggerHighlight]);

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
  }, [isActive, triggerHighlight]);

  return (
  <div className="h-full flex flex-col glass-panel-strong card-surface border border-surface-divider/70 shadow-[0_20px_48px_-32px_rgba(16,24,46,0.9)]">
      {/* Console Output */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 pr-3"
      >
        {output.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground/70">
            <div className="glass-panel card-surface border border-surface-divider/70 px-6 py-5 text-center">
              <div className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/60">Console</div>
              <div className="text-base text-foreground/85 mt-2">No output yet</div>
              <div className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-[0.25em]">Use <span className="text-accentEmerald">PRINT</span> to speak</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {output.map((line, index) => (
              <div 
                key={index}
                className={`px-4 py-3 rounded-xl border transition-all duration-300 font-mono text-sm bg-[rgba(11,16,27,0.82)] border-surface-divider/60 shadow-[0_10px_24px_-24px_rgba(12,20,34,0.9)] ${
                  index === latestLineIndex
                    ? 'animate-variable-highlight-border border-[rgba(75,192,255,0.6)] shadow-[0_18px_42px_-26px_rgba(75,192,255,0.65)]'
                    : ''
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                <span className="text-foreground/85">{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Terminal } from 'lucide-react'

interface InputPanelProps {
  prompt: string
  isAwaitingInput: boolean
  onSubmit: (value: string) => void
}

export function InputPanel({ prompt, isAwaitingInput, onSubmit }: InputPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAwaitingInput) {
      textareaRef.current?.focus()
    } else {
      setInputValue('')
    }
  }, [isAwaitingInput])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAwaitingInput) {
      onSubmit(inputValue)
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-full flex flex-col glass-panel border border-surface-divider/70 bg-gradient-to-r from-white/6 via-white/4 to-transparent p-4 gap-3">
      <div className="flex items-start flex-shrink-0 gap-3">
        <div className="h-8 w-8 rounded-lg bg-[radial-gradient(circle_at_30%_30%,rgba(75,192,255,0.55),rgba(16,22,34,0.85))] flex items-center justify-center shadow-[0_12px_28px_-20px_rgba(75,192,255,0.8)]">
          <Terminal className="w-4 h-4 text-accentCyan-foreground" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="basic-input" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">
            {isAwaitingInput
              ? (prompt && prompt.trim() && prompt !== '?' ? prompt : 'Awaiting Input')
              : 'Input Channel Idle'}
          </label>
          <span className="text-[0.6rem] tracking-[0.28em] uppercase text-muted-foreground/60">
            Press Enter to confirm instantly
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 flex items-start gap-3 min-h-0">
        <Textarea
          id="basic-input"
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isAwaitingInput}
          className="h-full flex-1 font-mono text-sm glass-panel-strong border border-surface-divider/60 bg-[color:rgba(10,16,26,0.82)] text-foreground/90 focus:ring-2 focus:ring-accentCyan/60 focus:border-accentCyan/50 rounded-xl resize-none"
          placeholder={isAwaitingInput ? 'Type a value and press Enter to submit.' : 'Runtime input will appear here.'}
        />
        <Button
          type="submit"
          disabled={!isAwaitingInput}
          title="Submit input"
          className="h-full min-w-[92px] rounded-xl bg-accentCyan text-accentCyan-foreground hover:bg-accentCyan/90 disabled:bg-muted disabled:text-muted-foreground transition-colors duration-200"
        >
          Send
        </Button>
      </form>
    </div>
  )
}

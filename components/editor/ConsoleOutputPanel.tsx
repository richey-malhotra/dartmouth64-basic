'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface ConsoleOutputPanelProps {
  consoleOutput: string[]
  currentLine?: number | null
  isRunning: boolean
  onInputSubmit?: (input: string) => void
  waitingForInput?: boolean
}

export function ConsoleOutputPanel({ 
  consoleOutput, 
  currentLine, 
  isRunning,
  onInputSubmit,
  waitingForInput = false
}: ConsoleOutputPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [consoleOutput])

  // Focus input when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [waitingForInput])

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && onInputSubmit) {
      onInputSubmit(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="h-full bg-[#252526] p-4 flex flex-col border-t border-[#464647]">
      <div className="text-base font-medium text-[#e1e1e1] mb-3 border-b border-[#464647] pb-2">
        Console Output
      </div>

      {/* Console Output */}
      <div 
        ref={outputRef}
        className="flex-1 bg-[#1e1e1e] border-2 border-[#464647] rounded p-4 font-mono text-base overflow-auto mb-4"
        style={{ minHeight: '200px' }}
      >
        {consoleOutput.map((line, index) => (
          <div key={index} className="text-[#e1e1e1] whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        
        {/* Current execution indicator */}
        {isRunning && currentLine && (
          <div className="text-[#4ec9b0] mt-2 font-semibold">
            Line: {currentLine} | Executing...
          </div>
        )}
        
        {/* Input prompt when waiting */}
        {waitingForInput && (
          <div className="text-[#ffd700] mt-2 font-semibold">
            ? <span className="animate-pulse">_</span>
          </div>
        )}
      </div>

      {/* Input Field Section */}
      <div className="bg-[#3c3c3c] p-3 rounded border-2 border-[#6e6e6e]">
        <div className="text-sm text-[#e1e1e1] mb-2 font-medium">
          Input field for INPUT statements
        </div>
        
        <form onSubmit={handleInputSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value and press Enter..."
            className={`flex-1 h-10 px-3 rounded border-2 text-base font-medium transition-all ${
              waitingForInput 
                ? 'bg-[#1e1e1e] border-[#007acc] text-[#e1e1e1] focus:border-[#1177bb] focus:ring-2 focus:ring-[#007acc]/50' 
                : 'bg-[#2d2d30] border-[#464647] text-[#969696] cursor-not-allowed'
            }`}
            disabled={!waitingForInput}
          />
          <button
            type="submit"
            className={`h-10 px-4 rounded text-base font-medium transition-all ${
              waitingForInput && inputValue.trim()
                ? 'bg-[#0e639c] hover:bg-[#1177bb] text-white border-2 border-[#0e639c]'
                : 'bg-[#464647] text-[#969696] cursor-not-allowed border-2 border-[#464647]'
            }`}
            disabled={!waitingForInput || !inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
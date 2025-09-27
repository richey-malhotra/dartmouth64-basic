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
    <div className="h-full flex flex-col bg-[#252526] p-4 gap-2">
      <div className="flex items-center h-6 flex-shrink-0">
        <Terminal className="w-4 h-4 mr-2 text-gray-400" />
        <label htmlFor="basic-input" className="text-sm font-medium text-gray-300">
          {isAwaitingInput ? (prompt === '?' ? 'Input' : prompt) : 'Program Input'}
        </label>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 flex items-start gap-2 min-h-0">
        <Textarea
          id="basic-input"
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isAwaitingInput}
          className="h-full flex-1 font-mono text-sm bg-[#1e1e1e] border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md resize-none"
          placeholder={isAwaitingInput ? 'Enter value and press Enter' : 'Input appears here...'}
        />
        <Button type="submit" disabled={!isAwaitingInput} className="h-full">
          Submit
        </Button>
      </form>
    </div>
  )
}

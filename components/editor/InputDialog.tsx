'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface InputDialogProps {
  isOpen: boolean
  prompt: string
  onSubmit: (value: string) => void
  onCancel: () => void
}

export function InputDialog({ isOpen, prompt, onSubmit, onCancel }: InputDialogProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setInputValue('')
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputValue)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-xl w-96 max-w-[90vw]">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h3 className="text-sm font-medium text-[#cccccc]">BASIC Input Required</h3>
        </div>

        {/* Dialog Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm text-[#cccccc] mb-2">
              {prompt}
            </label>
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] focus:border-[#007acc]"
              placeholder="Enter value..."
            />
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="bg-transparent border-[#3e3e42] text-[#cccccc] hover:bg-[#3e3e42]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
            >
              OK
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
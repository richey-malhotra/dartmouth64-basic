'use client'

import { Sparkles, RefreshCw, Bot } from 'lucide-react'
import { Button } from '../ui/button'

interface AISummaryBarProps {
  summary?: string
}

export function AISummaryBar({ 
  summary = "This program demonstrates array usage in BASIC, showing how to declare arrays with DIM and access elements with subscripts. Arrays are fundamental data structures that allow you to store multiple values under a single variable name. In Dartmouth BASIC, arrays are 1-indexed, meaning the first element is at position 1, not 0. The DIM statement reserves memory for array elements, and you must declare the maximum size when creating the array. This educational example helps students understand the relationship between array indices and memory allocation.",
}: AISummaryBarProps) {
  return (
    <div className="h-full bg-[#2d2d30] flex flex-col p-4 gap-2">
      {/* Header */}
      <div className="flex items-center gap-2 h-6 flex-shrink-0">
        <Sparkles className="w-5 h-5 text-[#ffd700]" />
        <span className="text-sm font-medium text-[#cccccc]">AI Summary</span>
      </div>

      {/* AI Summary Content - Scrollable */}
      <div className="flex-1 overflow-auto min-h-0 bg-[#1e1e1e] p-2 rounded">
        <div className="text-sm text-[#cccccc] leading-relaxed pr-2">
          {summary}
        </div>
      </div>
    </div>
  )
}
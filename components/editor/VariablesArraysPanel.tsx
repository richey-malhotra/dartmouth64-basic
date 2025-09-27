'use client'

import { useRef } from 'react'
import type { VariableState, ArrayState } from './types'

interface VariablesArraysPanelProps {
  variables: Map<string, VariableState>
  arrays: Map<string, ArrayState>
  currentLine?: number | null
}

export function VariablesArraysPanel({ variables, arrays, currentLine }: VariablesArraysPanelProps) {
  const variablesScrollRef = useRef<HTMLDivElement>(null)
  const arraysScrollRef = useRef<HTMLDivElement>(null)
  
  const variableList = Array.from(variables.values())
  const arrayList = Array.from(arrays.values())

  return (
    <div className="h-full flex flex-col bg-console text-console-text">
      {/* Variables Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Variables Header - Match Console Style */}
        <div className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border-b border-gray-600 dark:border-gray-600 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono">VARIABLES</span>
            <span className="text-gray-400">{variableList.length} active</span>
          </div>
        </div>

        {/* Variables Content with Visible Scrolling */}
        <div 
          ref={variablesScrollRef}
          className="flex-1 overflow-y-scroll bg-[#1e1e1e] scrollbar-visible"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#464647 #2d2d30' }}
        >
          {variableList.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 italic p-4 text-sm">
              Variables will appear here when declared...
            </div>
          ) : (
            <div className="space-y-1">
              {/* Table Headers - Sticky */}
              <div className="grid grid-cols-4 gap-3 p-3 text-xs font-semibold text-[#e1e1e1] border-b-2 border-[#464647] bg-gray-800 dark:bg-gray-700 sticky top-0 z-10">
                <div>Name</div>
                <div>Type</div>
                <div>Value</div>
                <div>Status</div>
              </div>
              
              {/* Table Rows with Hover Effects */}
              {variableList.map((variable) => (
                <div 
                  key={variable.name} 
                  className={`grid grid-cols-4 gap-3 p-3 text-sm border-b border-[#464647] hover:bg-[#2d2d30]/70 transition-colors ${
                    variable.changed ? 'bg-[#4ec9b0]/10' : ''
                  }`}
                >
                  <div className="text-[#e1e1e1] font-mono font-medium">{variable.name}</div>
                  <div className="text-[#569cd6] font-medium text-xs">{variable.type === 'number' ? 'num' : 'str'}</div>
                  <div className="text-[#b5cea8] font-mono text-xs">
                    {variable.type === 'string' ? <span>&ldquo;{variable.value}&rdquo;</span> : variable.value}
                  </div>
                  <div className="text-[#4ec9b0] font-medium text-xs">
                    {variable.changed ? '✓ changed' : ''}
                  </div>
                </div>
              ))}
              
              {/* Show more indicator if content is long */}
              {variableList.length > 10 && (
                <div className="text-center text-gray-500 text-xs py-2 bg-[#2d2d30]/30">
                  ↑ Scroll to see all {variableList.length} variables ↑
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variables Footer - Match Console Style */}
        <div className="px-4 py-2 bg-gray-700 dark:bg-gray-600 border-t border-gray-600 text-xs text-gray-300">
          <div className="flex items-center justify-between">
            <span>{variableList.length} variables declared</span>  
            <span className="text-gray-400">VARS</span>
          </div>
        </div>
      </div>

      {/* Arrays Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Arrays Header - Match Console Style */}
        <div className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border-t border-b border-gray-600 dark:border-gray-600 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono">ARRAYS</span>
            <span className="text-gray-400">{arrayList.length} declared</span>
          </div>
        </div>

        {/* Arrays Content with Visible Scrolling */}
        <div 
          ref={arraysScrollRef}
          className="flex-1 overflow-y-scroll bg-[#1e1e1e] scrollbar-visible"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#464647 #2d2d30' }}
        >
          {arrayList.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 italic p-4 text-sm">
              Arrays will appear here when declared...
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {arrayList.map((array) => (
                <div key={array.name} className="bg-[#2d2d30] border border-[#464647] rounded-lg overflow-hidden">
                  {/* Array Header */}
                  <div className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border-b border-gray-600 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#e1e1e1] font-medium">
                        {array.name}: DIM {array.name}({array.bounds.map(([, max]) => max).join(',')})
                      </span>
                      <span className="text-gray-400">{array.bounds[0][1]} elements</span>
                    </div>
                  </div>
                  
                  {/* Array Grid with Horizontal Scrolling */}
                  <div className="p-4">
                    <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#464647 #2d2d30' }}>
                      <div className="flex gap-2 pb-2" style={{ minWidth: 'fit-content' }}>
                        {Array.from({ length: array.bounds[0][1] }, (_, i) => {
                          const index = i + 1
                          const value = array.values.get(index.toString())
                          const isAccessed = array.recentlyAccessed.has(index.toString())
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-shrink-0">
                              <div className="text-xs text-[#e1e1e1] mb-1 font-medium">[{index}]</div>
                              <div className={`w-12 h-12 border-2 rounded-lg text-xs flex items-center justify-center font-mono font-semibold transition-all ${
                                isAccessed 
                                  ? 'border-[#ffd700] bg-[#ffd700]/20 text-[#ffd700] shadow-lg shadow-[#ffd700]/30' 
                                  : value !== undefined 
                                    ? 'border-[#569cd6] bg-[#569cd6]/20 text-[#e1e1e1] hover:border-[#007acc]' 
                                    : 'border-[#464647] text-[#969696] bg-[#1e1e1e]'
                              }`}>
                                {value !== undefined ? value : '□'}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {/* Horizontal scroll indicator */}
                      {array.bounds[0][1] > 8 && (
                        <div className="text-center text-gray-500 text-xs py-1">
                          ← Scroll horizontally to see all {array.bounds[0][1]} elements →
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Loop Progress (if applicable) */}
                  {currentLine && (
                    <div className="px-4 py-2 bg-gray-700 dark:bg-gray-600 border-t border-gray-600">
                      <div className="text-xs text-[#e1e1e1] mb-2 font-medium">Loop Progress: I: 3/7</div>
                      <div className="w-full bg-[#464647] rounded-full h-2 border border-[#6e6e6e]">
                        <div className="bg-gradient-to-r from-[#0e639c] to-[#1177bb] h-2 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
                      </div>
                      <div className="text-xs text-[#e1e1e1] mt-1 font-medium">60%</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arrays Footer - Match Console Style */}
        <div className="px-4 py-2 bg-gray-700 dark:bg-gray-600 border-t border-gray-600 text-xs text-gray-300">
          <div className="flex items-center justify-between">
            <span>{arrayList.length} arrays with {arrayList.reduce((sum, arr) => sum + arr.bounds[0][1], 0)} total elements</span>
            <span className="text-gray-400">ARRAYS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { VariablePanel } from './VariablePanel'
import { ArrayVisualization } from './ArrayVisualization'
import { ConsolePanel } from './ConsolePanel'

interface EducationalPanelProps {
  variables: Map<string, any>
  arrays: Map<string, any>
  consoleOutput: string[]
  currentLine?: number | null
  isRunning: boolean
}

export function EducationalPanel({ 
  variables, 
  arrays, 
  consoleOutput, 
  currentLine, 
  isRunning 
}: EducationalPanelProps) {
  const [activeTab, setActiveTab] = useState<'variables' | 'arrays' | 'console'>('variables')

  const tabs = [
    { id: 'variables', label: 'Variables', count: variables.size },
    { id: 'arrays', label: 'Arrays', count: arrays.size },
    { id: 'console', label: 'Console', count: consoleOutput.length },
  ] as const

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Panel Header */}
      <div className="h-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Educational Panel
        </h2>
        <div className={`ml-auto w-2 h-2 rounded-full ${
          isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'variables' && (
          <VariablePanel variables={variables} currentLine={currentLine} />
        )}
        {activeTab === 'arrays' && (
          <ArrayVisualization arrays={arrays} currentLine={currentLine} />
        )}
        {activeTab === 'console' && (
          <ConsolePanel output={consoleOutput} />
        )}
      </div>

      {/* Educational Tip */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
        <div className="text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>Educational Tip:</strong> {
            activeTab === 'variables' ? 'Watch how variables change as your program executes. Each assignment creates a visual update.' :
            activeTab === 'arrays' ? 'Arrays are displayed as grids. Recently accessed elements are highlighted in gold.' :
            'All PRINT statements appear here. Watch the console fill up as your program runs!'
          }
        </div>
      </div>
    </div>
  )
}
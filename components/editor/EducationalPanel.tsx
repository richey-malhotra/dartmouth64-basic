'use client'

import { useState } from 'react'
import { VariablePanel } from './VariablePanel'
import { ArrayVisualization } from './ArrayVisualization'
import { ConsolePanel } from './ConsolePanel'
import { InputPanel } from './InputPanel'

interface EducationalPanelProps {
  variables: Map<string, any>
  arrays: Map<string, any>
  consoleOutput: string[]
  isRunning: boolean
  inputPrompt: string
  isAwaitingInput: boolean
  onInputSubmit: (value: string) => void
}

export function EducationalPanel({ 
  variables, 
  arrays, 
  consoleOutput, 
  isRunning,
  inputPrompt,
  isAwaitingInput,
  onInputSubmit,
}: EducationalPanelProps) {
  const [activeTab, setActiveTab] = useState<'variables' | 'arrays' | 'console'>('variables')

  const tabs = [
    { id: 'variables', label: 'Variables', count: variables.size },
    { id: 'arrays', label: 'Arrays', count: arrays.size },
    { id: 'console', label: 'Console', count: consoleOutput.length },
  ] as const

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Tab Navigation */}
        <div className="h-14 flex items-center border-b border-[#2d2d30] px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-full flex-1 px-4 text-sm font-medium transition-colors flex items-center justify-center rounded-md ${
                activeTab === tab.id
                  ? 'text-white bg-gray-700/50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'variables' && (
            <VariablePanel variables={variables} />
          )}
          {activeTab === 'arrays' && (
            <ArrayVisualization arrays={arrays} />
          )}
          {activeTab === 'console' && (
            <ConsolePanel output={consoleOutput} />
          )}
        </div>
      </div>

      {/* Input Panel */}
      <div className="h-[20%] border-t border-[#3e3e42]">
        <InputPanel 
          prompt={inputPrompt}
          isAwaitingInput={isAwaitingInput}
          onSubmit={onInputSubmit}
        />
      </div>
    </div>
  )
}
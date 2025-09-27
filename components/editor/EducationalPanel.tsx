'use client'

import { useState } from 'react'
import { VariablePanel } from './VariablePanel'
import { ArrayVisualization } from './ArrayVisualization'
import { ConsolePanel } from './ConsolePanel'
import type { VariableState, ArrayState } from './types'

interface EducationalPanelProps {
  variables: Map<string, VariableState>
  arrays: Map<string, ArrayState>
  consoleOutput: string[]
}

export function EducationalPanel({ 
  variables, 
  arrays, 
  consoleOutput,
}: EducationalPanelProps) {
  const [activeTab, setActiveTab] = useState<'variables' | 'arrays' | 'console'>('variables')

  const tabs = [
    { id: 'variables', label: 'Variables', count: variables.size },
    { id: 'arrays', label: 'Arrays', count: arrays.size },
    { id: 'console', label: 'Console', count: consoleOutput.length },
  ] as const

  const tabTone: Record<typeof tabs[number]['id'], string> = {
    variables: 'from-[rgba(75,192,255,0.18)] to-transparent text-accentCyan',
    arrays: 'from-[rgba(201,93,245,0.18)] to-transparent text-accentMagenta',
    console: 'from-[rgba(56,132,255,0.18)] to-transparent text-[#7ea7ff]',
  }

  return (
    <div className="h-full flex flex-col glass-panel-strong border border-surface-divider/80 rounded-l-2xl bg-gradient-to-b from-[#12182A]/90 via-[#101625]/80 to-[#0e1420]/88">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Tab Navigation */}
        <div className="h-16 flex items-center border-b border-surface-divider/70 px-3 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-12 flex-1 px-5 text-sm font-semibold tracking-wide uppercase transition-all duration-300 flex items-center justify-between rounded-xl border border-transparent bg-gradient-to-r ${
                activeTab === tab.id
                  ? `${tabTone[tab.id]} border-accentCyan/30 shadow-[0_14px_36px_-20px_rgba(75,192,255,0.75)]`
                  : 'text-muted-foreground/80 hover:text-foreground/90 hover:border-surface-divider/70 hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full border ${
                  activeTab === tab.id
                    ? 'border-white/30 text-white/90 bg-white/10'
                    : 'border-surface-divider text-muted-foreground/70'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden px-3 pb-3">
          <div className="h-full glass-panel rounded-2xl border border-surface-divider/60 p-0.5">
            <div className="h-full rounded-[1rem] bg-gradient-to-b from-white/2 via-white/3 to-white/1.5 dark:from-white/3 dark:via-white/2 dark:to-transparent">
          {activeTab === 'variables' && (
            <VariablePanel variables={variables} />
          )}
          {activeTab === 'arrays' && (
            <ArrayVisualization arrays={arrays} />
          )}
          {activeTab === 'console' && (
            <ConsolePanel output={consoleOutput} isActive={activeTab === 'console'} />
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
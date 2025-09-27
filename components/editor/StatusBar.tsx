'use client'

interface StatusBarProps {
  line: number
  column: number
  status: 'READY' | 'RUNNING'
  version: string
  user: string
}

export function StatusBar({ line, column, status, version, user }: StatusBarProps) {
  const isRunning = status === 'RUNNING'
  
  return (
    <div className="h-7 flex items-center justify-between px-4 bg-[#333333] border-t border-[#2d2d30] text-sm text-gray-300">
      {/* Left side: Status, Version, User */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="font-mono">{status}</span>
        </div>
        <span className="font-mono">{version}</span>
        <span className="font-mono">@{user}</span>
      </div>
      
      {/* Right side: Cursor Position */}
      <div className="flex items-center space-x-4">
        <div className="bg-[#252526] px-3 py-0.5 rounded-md border border-[#3e3e42]">
          <span>Ln {line}, Col {column}</span>
        </div>
      </div>
    </div>
  )
}
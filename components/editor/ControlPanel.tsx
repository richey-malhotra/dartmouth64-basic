'use client'

import { 
  Play, 
  Square, 
  SkipForward, 
  RotateCcw,
  FileText,
  Save,
  FolderOpen,
  List,
  Hash,
  CheckCircle
} from 'lucide-react'

interface ControlPanelProps {
  isRunning: boolean
  onRun: () => void
  onStop: () => void
  onStep: () => void
  onReset?: () => void
  onNew?: () => void
  onSave?: () => void
  onLoad?: () => void
  onList?: () => void
  onRenumber?: () => void
  onLint?: () => void
  speed?: number
  onSpeedChange?: (speed: number) => void
}

export function ControlPanel(props: ControlPanelProps) {
  const {
    isRunning,
    onRun,
    onStop,
    onStep,
    onReset,
    onNew,
    onSave,
    onLoad,
    onList,
    onRenumber,
    onLint,
    speed = 1000,
    onSpeedChange
  } = props

  return (
    <div className="bg-[#2d2d30] border-b border-[#464647]">
      <div className="h-14 flex items-center px-6 gap-6 border-b border-[#464647]">
        <span className="text-lg text-[#e1e1e1] font-medium">Controls</span>
        
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={onRun}
              className="btn-primary btn-icon-only"
              title="Run Program (F5)"
            >
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onStop}
              className="btn-danger btn-icon-only"
              title="Stop Execution"
            >
              <Square className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={onStep}
            disabled={isRunning}
            className="btn-secondary btn-icon-only"
            title="Step Through"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={onReset}
            className="btn-secondary btn-icon-only"
            title="Reset Program"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 ml-4 bg-[#3c3c3c] px-4 py-2 rounded border border-[#6e6e6e]">
          <span className="text-sm text-[#e1e1e1] font-medium">Speed</span>
          <div className="flex flex-col items-center">
            <div className="relative w-32">
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => onSpeedChange?.(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-[#4ec9b0] via-[#ffd700] to-[#d73a49] rounded-lg appearance-none cursor-pointer speed-slider"
                title="Execution Speed: Left = Fast, Right = Slow"
              />
              <div className="absolute -bottom-3 left-0 right-0 flex justify-between text-xs text-[#969696] pointer-events-none">
                <span className="text-[#4ec9b0]">Fast</span>
                <span className="text-[#ffd700]">Med</span>
                <span className="text-[#d73a49]">Slow</span>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 flex justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="w-px h-2 bg-[#6e6e6e]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={onRenumber}
            className="btn-secondary btn-icon-only"
            title="Renumber Lines"
          >
            <Hash className="w-5 h-5" />
          </button>

          <button
            onClick={onLint}
            className="btn-secondary btn-icon-only"
            title="Check Code"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-[#4ec9b0] animate-pulse' : 'bg-[#969696]'}`}></div>
          <span className="text-lg text-[#e1e1e1] font-medium">
            {isRunning ? 'Running' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="h-12 flex items-center px-6 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNew} 
            className="btn-secondary btn-small btn-icon-only"
            title="New Program"
          >
            <FileText className="w-5 h-5" />
          </button>
          <button 
            onClick={onSave} 
            className="btn-secondary btn-small btn-icon-only"
            title="Save Program"
          >
            <Save className="w-5 h-5" />
          </button>
          <button 
            onClick={onLoad} 
            className="btn-secondary btn-small btn-icon-only"
            title="Load Program"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button 
            onClick={onList} 
            className="btn-secondary btn-small btn-icon-only"
            title="List Lines"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-[#e1e1e1] bg-[#3c3c3c] px-4 py-2 rounded font-medium ml-auto border border-[#6e6e6e]">
          BASIC-64
        </div>
      </div>
    </div>
  )
}

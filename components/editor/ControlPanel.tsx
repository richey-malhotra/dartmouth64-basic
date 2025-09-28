'use client'

import { 
  Play, 
  Square, 
  StepForward,
  RotateCcw,
  FileText,
  Save,
  FolderOpen,
  List,
  Hash,
  CheckCircle,
  Wand2,
  ArrowRightLeft,
  ZoomIn,
  ZoomOut,
  Pause,
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface ControlPanelProps {
  isRunning: boolean
  isPaused?: boolean
  onRun: () => void
  onPause?: () => void
  onStop: () => void
  onStep: () => void
  onReset?: () => void
  onNew?: () => void
  onSave?: () => void
  onLoad?: () => void
  onList?: () => void
  onRenumber?: () => void
  onLint?: () => void
  onConvert?: () => void
  onAIAssist?: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

const controlGroupBase =
  'control-panel-group relative flex h-16 items-center gap-2 px-4 rounded-2xl border border-surface-divider/60 backdrop-blur-xl overflow-hidden transition-all duration-300 shadow-[0_16px_34px_-28px_rgba(18,24,40,0.7)]'

const subduedActionButton =
  'rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.82)] transition-all duration-200 disabled:opacity-60'

export function ControlPanel(props: ControlPanelProps) {
  const {
    isRunning,
    isPaused,
    onRun,
    onPause,
    onStop,
    onStep,
    onReset,
    onNew,
    onSave,
    onLoad,
    onList,
    onRenumber,
    onLint,
    onConvert,
    onAIAssist,
    onZoomIn,
    onZoomOut,
  } = props

  const paused = Boolean(isPaused)

  return (
  <div className="relative z-20 w-full px-[3px] py-2 flex flex-wrap lg:flex-nowrap items-center gap-2.5 lg:gap-3.5 lg:justify-between glass-panel-strong card-surface accent-glow bg-gradient-to-r from-[#101322]/92 via-[#111727]/78 to-transparent border border-white/10 shadow-[0_25px_45px_-30px_rgba(15,23,42,0.9)] transition-shadow duration-500 overflow-hidden">
      {/* Execution Controls */}
      <div
        className={cn(
          controlGroupBase,
          'bg-[color:rgba(45,186,142,0.18)] shadow-[0_12px_28px_-20px_rgba(45,186,142,0.6)] hover:shadow-[0_18px_38px_-18px_rgba(45,186,142,0.7)]'
        )}
      >
        {!isRunning ? (
          <Button
            onClick={onRun}
            size="lg"
            title="Run Program (F5)"
              className="h-12 rounded-xl bg-accentEmerald text-accentEmerald-foreground shadow-[0_22px_44px_-20px_rgba(45,186,142,0.78)] hover:bg-accentEmerald/90 transition-all duration-200 flex items-center gap-2 px-5"
          >
              <Play className="w-5 h-5" />
            Run
          </Button>
        ) : (
          <Button
            onClick={onStop}
            size="lg"
            variant="destructive"
            title="Stop Execution"
              className="h-12 rounded-xl shadow-[0_18px_32px_-18px_rgba(255,100,100,0.8)] transition-all duration-200 flex items-center gap-2 px-5"
          >
              <Square className="w-5 h-5" />
            Stop
          </Button>
        )}
        
        {isRunning && !paused && onPause && (
          <Button
            onClick={onPause}
            size="lg"
            variant="secondary"
            title="Pause Execution"
              className="h-12 rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.8)] transition-all duration-200 flex items-center gap-2 px-5"
          >
              <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}

        {isRunning && paused && (
          <Button
            onClick={onRun}
            size="lg"
            title="Resume Program (F5)"
              className="h-12 rounded-xl bg-accentCyan text-accentCyan-foreground shadow-[0_18px_38px_-18px_rgba(75,192,255,0.8)] hover:bg-accentCyan/90 transition-all duration-200 flex items-center gap-2 px-5"
          >
              <Play className="w-5 h-5" />
            Resume
          </Button>
        )}

        <Button
          onClick={onStep}
          disabled={isRunning && !paused}
          variant="secondary"
          size="lg"
          title="Step Through"
          className={cn(subduedActionButton, 'flex h-12 items-center gap-2 px-5')}
        >
          <StepForward className="w-5 h-5" />
          Step
        </Button>
        <Button
          onClick={onReset}
          variant="secondary"
          size="icon"
          title="Reset Program"
          className={cn(subduedActionButton, 'h-12 w-12')}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Code Utilities */}
      <div
        className={cn(
          controlGroupBase,
          'bg-[color:rgba(133,144,255,0.16)] hover:shadow-[0_16px_32px_-20px_rgba(133,144,255,0.6)]'
        )}
      >
        <Button
          onClick={onRenumber}
          variant="ghost"
          size="icon"
          title="Renumber Lines"
          className="h-12 w-12 text-[#9aa5ff] hover:text-[#dbe0ff] hover:bg-[rgba(133,144,255,0.16)] transition-colors duration-200"
        >
          <Hash className="w-5 h-5" />
        </Button>
        <Button
          onClick={onLint}
          variant="ghost"
          size="icon"
          title="AI Lint"
          className="ai-button h-12 w-12 hover:bg-transparent transition-transform duration-200 hover:-translate-y-[1px]"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* File Operations */}
      <div
        className={cn(
          controlGroupBase,
          'bg-[color:rgba(255,183,90,0.18)] hover:shadow-[0_16px_32px_-20px_rgba(255,183,90,0.6)]'
        )}
      >
        <Button
          onClick={onNew}
          variant="ghost"
          size="icon"
          title="New Program"
          className="h-12 w-12 text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10 transition-colors duration-200"
        >
          <FileText className="w-5 h-5" />
        </Button>
        <Button
          onClick={onSave}
          variant="ghost"
          size="icon"
          title="Save Program"
          className="h-12 w-12 text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10 transition-colors duration-200"
        >
          <Save className="w-5 h-5" />
        </Button>
        <Button
          onClick={onLoad}
          variant="ghost"
          size="icon"
          title="Load Program"
          className="h-12 w-12 text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10 transition-colors duration-200"
        >
          <FolderOpen className="w-5 h-5" />
        </Button>
        <Button
          onClick={onList}
          variant="ghost"
          size="icon"
          title="List Lines"
          className="h-12 w-12 text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10 transition-colors duration-200"
        >
          <List className="w-5 h-5" />
        </Button>
      </div>

      {/* AI Tools */}
      <div
        className={cn(
          controlGroupBase,
          'bg-[color:rgba(152,95,255,0.2)] hover:shadow-[0_16px_32px_-20px_rgba(152,95,255,0.6)]'
        )}
      >
        <Button
          onClick={onConvert}
          variant="ghost"
          size="icon"
          title="RBASIC <-> PYTHON"
          className="ai-button h-12 w-12 transition-transform duration-200 hover:-translate-y-[1px]"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </Button>
        <Button
          onClick={onAIAssist}
          variant="ghost"
          size="icon"
          title="AI Assistant"
          className="ai-button h-12 w-12 transition-transform duration-200 hover:-translate-y-[1px]"
        >
          <Wand2 className="w-5 h-5" />
        </Button>
      </div>
      {/* Font Size Controls */}
      <div
        className={cn(
          controlGroupBase,
          'bg-[color:rgba(32,40,64,0.5)] hover:shadow-[0_16px_32px_-20px_rgba(32,40,64,0.65)]'
        )}
      >
        <Button
          onClick={onZoomOut}
          variant="secondary"
          size="icon"
          title="Decrease Font Size"
          className={cn(subduedActionButton, 'h-12 w-12')}
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          onClick={onZoomIn}
          variant="secondary"
          size="icon"
          title="Increase Font Size"
          className={cn(subduedActionButton, 'h-12 w-12')}
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

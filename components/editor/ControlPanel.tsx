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
    <div className="h-20 px-4 lg:px-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 rounded-b-2xl glass-panel-strong accent-glow bg-gradient-to-r from-[#101322]/90 via-[#111727]/70 to-transparent">
      {/* Execution Controls */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-divider/60 bg-[color:rgba(45,186,142,0.18)] shadow-[0_12px_28px_-20px_rgba(45,186,142,0.6)]">
        {!isRunning ? (
          <Button
            onClick={onRun}
            size="lg"
            title="Run Program (F5)"
            className="rounded-xl bg-accentEmerald text-accentEmerald-foreground shadow-[0_22px_44px_-20px_rgba(45,186,142,0.78)] hover:bg-accentEmerald/90"
          >
            <Play className="w-5 h-5 mr-2" />
            Run
          </Button>
        ) : (
          <Button
            onClick={onStop}
            size="lg"
            variant="destructive"
            title="Stop Execution"
            className="rounded-xl shadow-[0_18px_32px_-18px_rgba(255,100,100,0.8)]"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </Button>
        )}
        
        {isRunning && !paused && onPause && (
          <Button
            onClick={onPause}
            size="lg"
            variant="secondary"
            title="Pause Execution"
            className="rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.8)]"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}

  {isRunning && paused && (
           <Button
            onClick={onRun}
            size="lg"
            title="Resume Program (F5)"
            className="rounded-xl bg-accentCyan text-accentCyan-foreground shadow-[0_18px_38px_-18px_rgba(75,192,255,0.8)] hover:bg-accentCyan/90"
          >
            <Play className="w-5 h-5 mr-2" />
            Resume
          </Button>
        )}

        <Button
          onClick={onStep}
          disabled={isRunning && !paused}
          variant="secondary"
          size="lg"
          title="Step Through"
          className="rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.82)]"
        >
          <StepForward className="w-5 h-5 mr-2" />
          Step
        </Button>
        <Button
          onClick={onReset}
          variant="secondary"
          size="icon"
          title="Reset Program"
          className="rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.82)]"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Code Utilities */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-divider/60 bg-[color:rgba(133,144,255,0.16)]">
        <Button
          onClick={onRenumber}
          variant="ghost"
          size="icon"
          title="Renumber Lines"
          className="text-[#9aa5ff] hover:text-[#dbe0ff] hover:bg-[rgba(133,144,255,0.16)]"
        >
          <Hash className="w-5 h-5" />
        </Button>
        <Button
          onClick={onLint}
          variant="ghost"
          size="icon"
          title="AI Lint"
          className="ai-button h-12 w-12 hover:bg-transparent"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* File Operations */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-divider/60 bg-[color:rgba(255,183,90,0.18)]">
        <Button
          onClick={onNew}
          variant="ghost"
          size="icon"
          title="New Program"
          className="text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10"
        >
          <FileText className="w-5 h-5" />
        </Button>
        <Button
          onClick={onSave}
          variant="ghost"
          size="icon"
          title="Save Program"
          className="text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10"
        >
          <Save className="w-5 h-5" />
        </Button>
        <Button
          onClick={onLoad}
          variant="ghost"
          size="icon"
          title="Load Program"
          className="text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10"
        >
          <FolderOpen className="w-5 h-5" />
        </Button>
        <Button
          onClick={onList}
          variant="ghost"
          size="icon"
          title="List Lines"
          className="text-accentAmber hover:text-accentAmber-foreground hover:bg-accentAmber/10"
        >
          <List className="w-5 h-5" />
        </Button>
      </div>

      {/* AI Tools */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-divider/60 bg-[color:rgba(152,95,255,0.2)]">
        <Button
          onClick={onConvert}
          variant="ghost"
          size="icon"
          title="Convert to Modern Language"
          className="ai-button"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </Button>
        <Button
          onClick={onAIAssist}
          variant="ghost"
          size="icon"
          title="AI Assistant"
          className="ai-button"
        >
          <Wand2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="hidden lg:flex flex-1" />

      {/* Font Size Controls */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-divider/60 bg-[color:rgba(32,40,64,0.5)]">
        <Button
          onClick={onZoomOut}
          variant="secondary"
          size="icon"
          title="Decrease Font Size"
          className="rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.82)]"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          onClick={onZoomIn}
          variant="secondary"
          size="icon"
          title="Increase Font Size"
          className="rounded-xl bg-[color:rgba(16,22,32,0.65)] border border-surface-divider text-foreground hover:bg-[color:rgba(16,22,32,0.82)]"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

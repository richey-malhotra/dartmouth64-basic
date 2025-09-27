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
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface ControlPanelProps {
  isRunning: boolean
  isPaused: boolean
  onRun: () => void
  onPause: () => void
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

  const Divider = () => <div className="w-px h-6 bg-border mx-2" />;

  return (
    <div className="h-16 flex items-center justify-start px-4 gap-2 bg-card border-b">
      {/* Execution Controls */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <Button onClick={onRun} size="lg" title="Run Program (F5)" className="bg-action text-action-foreground hover:bg-action/90 shadow-lg">
            <Play className="w-5 h-5 mr-2" />
            Run
          </Button>
        ) : (
          <Button onClick={onStop} size="lg" variant="destructive" title="Stop Execution" className="shadow-lg">
            <Square className="w-5 h-5 mr-2" />
            Stop
          </Button>
        )}
        
        {isRunning && !isPaused && (
          <Button onClick={onPause} size="lg" variant="secondary" title="Pause Execution">
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}

        {isRunning && isPaused && (
           <Button onClick={onRun} size="lg" title="Resume Program (F5)" className="bg-action text-action-foreground hover:bg-action/90 shadow-lg">
            <Play className="w-5 h-5 mr-2" />
            Resume
          </Button>
        )}

        <Button onClick={onStep} disabled={isRunning && !isPaused} variant="secondary" size="lg" title="Step Through">
          <StepForward className="w-5 h-5 mr-2" />
          Step
        </Button>
        <Button onClick={onReset} variant="secondary" size="icon" title="Reset Program">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <Divider />

      {/* Code Utilities */}
      <div className="flex items-center gap-1">
        <Button onClick={onRenumber} variant="ghost" size="icon" title="Renumber Lines">
          <Hash className="w-5 h-5" />
        </Button>
        <Button onClick={onLint} variant="ghost" size="icon" title="Check Code">
          <CheckCircle className="w-5 h-5" />
        </Button>
      </div>

      <Divider />

      {/* File Operations */}
      <div className="flex items-center gap-1">
        <Button onClick={onNew} variant="ghost" size="icon" title="New Program">
          <FileText className="w-5 h-5" />
        </Button>
        <Button onClick={onSave} variant="ghost" size="icon" title="Save Program">
          <Save className="w-5 h-5" />
        </Button>
        <Button onClick={onLoad} variant="ghost" size="icon" title="Load Program">
          <FolderOpen className="w-5 h-5" />
        </Button>
        <Button onClick={onList} variant="ghost" size="icon" title="List Lines">
          <List className="w-5 h-5" />
        </Button>
      </div>

      <Divider />

      {/* AI Tools */}
      <div className="flex items-center gap-1">
        <Button onClick={onConvert} variant="ghost" size="icon" title="Convert to Modern Language">
          <ArrowRightLeft className="w-5 h-5" />
        </Button>
        <Button onClick={onAIAssist} variant="ghost" size="icon" title="AI Assistant">
          <Wand2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-grow" />

      {/* Font Size Controls */}
      <div className="flex items-center gap-2">
        <Button onClick={onZoomOut} variant="secondary" size="icon" title="Decrease Font Size">
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button onClick={onZoomIn} variant="secondary" size="icon" title="Increase Font Size">
          <ZoomIn className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

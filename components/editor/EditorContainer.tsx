'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { MonacoBasicEditor } from './MonacoBasicEditor'
import { ControlPanel } from './ControlPanel'
import { EducationalPanel } from './EducationalPanel'
import { AISummaryBar } from './AISummaryBar'
import { StatusBar } from './StatusBar'
import { InputPanel } from './InputPanel'
import type {
  ArrayState,
  InterpreterLike,
  VariableState
} from './types'

type VariablesMap = Map<string, VariableState>
type ArraysMap = Map<string, ArrayState>

const MIN_FONT_SIZE = 10
const MAX_FONT_SIZE = 24
const DEFAULT_FONT_SIZE = Math.round((MIN_FONT_SIZE + MAX_FONT_SIZE) / 2)

export function EditorContainer({
  setStatus,
  status,
  user,
}: {
  setStatus?: (status: string) => void
  status?: 'READY' | 'RUNNING'
  user?: string
}) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const increaseFontSize = () => setFontSize(size => Math.min(size + 1, MAX_FONT_SIZE))
  const decreaseFontSize = () => setFontSize(size => Math.max(size - 1, MIN_FONT_SIZE))

  const [code, setCode] = useState(`10 PRINT "WHAT IS YOUR NAME?"
20 INPUT N$
30 PRINT "HELLO, "; N$
40 PRINT "HOW OLD ARE YOU?"
50 INPUT AGE
60 IF AGE < 18 THEN PRINT "YOU ARE A MINOR."
70 IF AGE >= 18 THEN PRINT "YOU ARE AN ADULT."
80 END`)

  const [isRunning, setIsRunning] = useState(false)
  const [currentLine, setCurrentLine] = useState<number | null>(null)
  
  useEffect(() => {
    if (setStatus) {
      setStatus(isRunning ? 'RUNNING' : 'READY');
    }
  }, [isRunning, setStatus]);
  
  const [variables, setVariables] = useState<VariablesMap>(() => {
    // Demo variables for UI testing - lots to test scrolling
    const vars: VariablesMap = new Map()
    vars.set('A', { name: 'A', value: 5, type: 'number', changed: true })
    vars.set('B', { name: 'B', value: 10, type: 'number' })
    vars.set('C', { name: 'C', value: 15, type: 'number' })
    vars.set('D', { name: 'D', value: 20, type: 'number' })
    vars.set('E', { name: 'E', value: 25, type: 'number', changed: true })
    vars.set('F', { name: 'F', value: 30, type: 'number' })
    vars.set('G', { name: 'G', value: 35, type: 'number' })
    vars.set('H', { name: 'H', value: 40, type: 'number' })
    vars.set('I', { name: 'I', value: 3, type: 'number', changed: true })
    vars.set('J', { name: 'J', value: 50, type: 'number' })
    vars.set('K', { name: 'K', value: 55, type: 'number' })
    vars.set('L', { name: 'L', value: 60, type: 'number' })
    vars.set('M', { name: 'M', value: 65, type: 'number' })
    vars.set('N', { name: 'N', value: 70, type: 'number', changed: true })
    vars.set('O', { name: 'O', value: 75, type: 'number' })
    vars.set('P', { name: 'P', value: 80, type: 'number' })
    vars.set('Q', { name: 'Q', value: 85, type: 'number' })
    vars.set('R', { name: 'R', value: 90, type: 'number' })
    vars.set('S', { name: 'S', value: 95, type: 'number' })
    vars.set('T', { name: 'T', value: 100, type: 'number' })
    vars.set('U', { name: 'U', value: 105, type: 'number' })
    vars.set('V', { name: 'V', value: 110, type: 'number' })
    vars.set('W', { name: 'W', value: 115, type: 'number' })
    vars.set('X1', { name: 'X1', value: 'Hello', type: 'string', changed: true })
    vars.set('Y1', { name: 'Y1', value: 'World', type: 'string' })
    vars.set('Z1', { name: 'Z1', value: 'BASIC', type: 'string' })
    vars.set('NAME$', { name: 'NAME$', value: 'HELLO', type: 'string' })
    return vars
  })
  const [arrays, setArrays] = useState<ArraysMap>(() => {
    // Demo arrays for UI testing - multiple arrays to test scrolling
    const arrs: ArraysMap = new Map()
    
    // Small array
    const arrayX = {
      name: 'X',
      dimensions: [5],
      values: new Map([
        ['1', 2], ['2', 4], ['3', 6], ['4', 8], ['5', 10]
      ]),
      recentlyAccessed: new Set(['3']),
      recentlyChanged: new Set(['3']),
      bounds: [[1, 5]] as [number, number][],
  type: 'number' as const
    }
    arrs.set('X', arrayX)
    
    // Large array to test horizontal scrolling
    const arrayY = {
      name: 'Y',
      dimensions: [15],
      values: new Map([
        ['1', 5], ['2', 10], ['3', 15], ['4', 20], ['5', 25],
        ['6', 30], ['7', 35], ['8', 40], ['9', 45], ['10', 50],
        ['11', 55], ['12', 60], ['13', 65], ['14', 70], ['15', 75]
      ]),
      recentlyAccessed: new Set(['7', '8']),
      recentlyChanged: new Set(['7', '8']),
      bounds: [[1, 15]] as [number, number][],
  type: 'number' as const
    }
    arrs.set('Y', arrayY)
    
    // String array
    const arrayN = {
      name: 'N$',
      dimensions: [8],
      values: new Map([
        ['1', 'APPLE'], ['2', 'BANANA'], ['3', 'CHERRY'], ['4', 'DATE'],
        ['5', 'ELDERBERRY'], ['6', 'FIG'], ['7', 'GRAPE'], ['8', 'KIWI']
      ]),
      recentlyAccessed: new Set(['2', '5']),
      recentlyChanged: new Set(['2', '5']),
      bounds: [[1, 8]] as [number, number][],
  type: 'string' as const
    }
    arrs.set('N$', arrayN)
    
    // Very large array for extreme horizontal scrolling test
    const arrayZ = {
      name: 'SCORES',
      dimensions: [25],
      values: new Map([
        ['1', 85], ['2', 92], ['3', 78], ['4', 96], ['5', 88],
        ['6', 75], ['7', 89], ['8', 94], ['9', 82], ['10', 91],
        ['11', 87], ['12', 93], ['13', 76], ['14', 98], ['15', 84],
        ['16', 90], ['17', 86], ['18', 95], ['19', 77], ['20', 99],
        ['21', 83], ['22', 88], ['23', 92], ['24', 80], ['25', 97]
      ]),
      recentlyAccessed: new Set(['12', '13', '14']),
      recentlyChanged: new Set(['12', '13', '14']),
      bounds: [[1, 25]] as [number, number][],
  type: 'number' as const
    }
    arrs.set('SCORES', arrayZ)
    
    return arrs
  })
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'HELLO, WORLD!',
    'A = 5',
    'B = 10',
    'C = 15',
    'X(1) = 2',
    'X(2) = 4',
    'X(3) = 6'
  ])
  const [isAwaitingInput, setIsAwaitingInput] = useState(false)
  const [inputPrompt, setInputPrompt] = useState('')
  const inputPromiseResolveRef = useRef<((value: string) => void) | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [stopPoints, setStopPoints] = useState<number[]>([])
  
  const interpreterRef = useRef<InterpreterLike | null>(null)

  const { totalLines, minimumSteps, executionLabel, deterministic } = useMemo(() => {
    const lines = code.split('\n').filter(line => line.trim().length > 0)
    const upperSource = code.toUpperCase()
    const hasInput = /\bINPUT\b/.test(upperSource)
    const hasRandom = /\bRND\b/.test(upperSource)
    const deterministic = !hasInput && !hasRandom

    let executionLabel = 'Adaptive'
    if (deterministic) {
      executionLabel = 'Deterministic'
    } else if (hasInput && !hasRandom) {
      executionLabel = 'Input-Driven'
    } else if (!hasInput && hasRandom) {
      executionLabel = 'Randomized'
    }

    return {
      totalLines: lines.length,
      minimumSteps: deterministic ? lines.length : null,
      executionLabel,
      deterministic,
    }
  }, [code])

  // Handle execution state updates
  // Handle input requests (for INPUT statements)
  const handleInputRequest = useCallback(async (prompt: string): Promise<string> => {
    setInputPrompt(prompt)
    setIsAwaitingInput(true)
    return new Promise((resolve) => {
      inputPromiseResolveRef.current = resolve
    })
  }, [])

  const handleInputSubmit = useCallback((value: string) => {
    if (inputPromiseResolveRef.current) {
      inputPromiseResolveRef.current(value)
    }
    setIsAwaitingInput(false)
    setInputPrompt('')
    inputPromiseResolveRef.current = null
  }, [])

  const handleToggleStopPoint = useCallback((line: number) => {
    setStopPoints(prev => {
      const exists = prev.includes(line)
      if (exists) {
        return prev.filter(item => item !== line)
      }
      return [...prev, line].sort((a, b) => a - b)
    })
  }, [])

  // Create and configure interpreter with dynamic imports
  const createInterpreter = useCallback(async () => {
    try {
      // For now, return null until parser is fully working
      console.log('Parser integration coming soon...')
      setConsoleOutput(['Parser integration in progress...'])
      return null
    } catch (error) {
      console.error('Parse error:', error)
      setConsoleOutput([`SYNTAX ERROR: ${error}`])
      return null
    }
  }, [])

  // Control handlers
  const handleRun = useCallback(async () => {
    const interpreter = await createInterpreter()
    if (!interpreter) {
      // Demo execution for now
      setIsRunning(true)
      setConsoleOutput([])
      setCurrentLine(10)
      setConsoleOutput(prev => [...prev, 'WHAT IS YOUR NAME?'])
      
      // Simulate asking for input
      setTimeout(async () => {
        setCurrentLine(20)
        const name = await handleInputRequest('?')
        setConsoleOutput(prev => [...prev, `> ${name}`])
        // Update variables
        setVariables(prev => {
          const next = new Map(prev)
          next.set('N$', { name: 'N$', value: name, type: 'string', changed: true })
          return next
        })

        setTimeout(async () => {
          setCurrentLine(30)
          setConsoleOutput(prev => [...prev, `HELLO, ${name}`])

          setTimeout(async () => {
            setCurrentLine(40)
            setConsoleOutput(prev => [...prev, 'HOW OLD ARE YOU?'])
            
            setTimeout(async () => {
              setCurrentLine(50)
              const age = await handleInputRequest('?')
              setConsoleOutput(prev => [...prev, `> ${age}`])
              setVariables(prev => {
                const next = new Map(prev)
                next.set('AGE', { name: 'AGE', value: Number(age), type: 'number', changed: true })
                return next
              })

              setTimeout(() => {
                const ageNum = Number(age)
                if (ageNum < 18) {
                  setCurrentLine(60)
                  setConsoleOutput(prev => [...prev, 'YOU ARE A MINOR.'])
                } else {
                  setCurrentLine(70)
                  setConsoleOutput(prev => [...prev, 'YOU ARE AN ADULT.'])
                }

                setTimeout(() => {
                  setCurrentLine(80)
                  setTimeout(() => {
                    setCurrentLine(null)
                    setIsRunning(false)
                  }, 500)
                }, 1000)
              }, 1000)
            }, 1000)
          }, 1000)
        }, 500)
      }, 1000)
      return
    }
    
    interpreterRef.current = interpreter
    setIsRunning(true)
    setCurrentLine(null)
    
    try {
      // TODO: await interpreter.run() when parser is ready
    } catch (error) {
      console.error('Runtime error:', error)
      setConsoleOutput(prev => [...prev, `ERROR: ${error}`])
    }
  }, [createInterpreter, handleInputRequest])

  const handleStep = useCallback(async () => {
    if (!interpreterRef.current) {
      // Demo step execution for now
      const lines = [10, 20, 30, 40, 50, 60, 70, 80]
      const current = currentLine
      const currentIndex = current ? lines.indexOf(current) : -1
      const nextLine = currentIndex >= 0 && currentIndex < lines.length - 1 
        ? lines[currentIndex + 1] 
        : lines[0]
      setCurrentLine(nextLine)
      return
    }
    
    try {
      // TODO: await interpreterRef.current.step() when parser is ready
    } catch (error) {
      console.error('Runtime error:', error)
      setConsoleOutput(prev => [...prev, `ERROR: ${error}`])
    }
  }, [currentLine])

  const handleStop = useCallback(() => {
    if (interpreterRef.current) {
      interpreterRef.current.stop()
    }
    setIsRunning(false)
    setCurrentLine(null)
    interpreterRef.current = null
  }, [])

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-[#090d16] via-[#0d111c] to-[#0f1524] overflow-hidden">
      <div className="editor-aurora" />

      <div className="flex-1 grid grid-cols-[3fr,2fr] min-h-0 gap-4 lg:gap-5 px-3 lg:px-5 pb-5 relative z-10">
        {/* Main Editor Area - 60% width */}
        <div className="col-span-1 flex flex-col min-w-0 min-h-0 gap-3.5 lg:gap-4 pt-3">
          {/* Control Panel */}
          <ControlPanel
            isRunning={isRunning}
            onRun={handleRun}
            onStop={handleStop}
            onStep={handleStep}
            onReset={() => {
              setCurrentLine(null)
              setIsRunning(false)
              setConsoleOutput([])
              setVariables(new Map<string, VariableState>())
              setArrays(new Map<string, ArrayState>())
              setStopPoints([])
            }}
            onNew={() => {
              setCode('')
              setCurrentLine(null)
              setIsRunning(false)
              setConsoleOutput([])
              setVariables(new Map<string, VariableState>())
              setArrays(new Map<string, ArrayState>())
              setStopPoints([])
            }}
            onSave={() => {
              // TODO: Implement save functionality
              console.log('Save program')
            }}
            onLoad={() => {
              // TODO: Implement load functionality
              console.log('Load program')
            }}
            onList={() => {
              // TODO: Implement list functionality
              setConsoleOutput(prev => [...prev, ...code.split('\n')])
            }}
            onRenumber={() => {
              // TODO: Implement renumber functionality
              console.log('Renumber lines')
            }}
            onLint={() => {
              // TODO: Implement syntax checking
              setConsoleOutput(prev => [...prev, 'Syntax check: OK'])
            }}
            onConvert={() => {
              console.log('RBASIC ↔ PYTHON')
            }}
            onAIAssist={() => {
              console.log('AI Assistant')
            }}
            onZoomIn={increaseFontSize}
            onZoomOut={decreaseFontSize}
          />
          
          {/* Execution Strip */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.45em] text-white/40 font-semibold">Runway</span>
              <div className="relative flex-1 h-2.5 overflow-hidden rounded-full border border-white/10 bg-black/40">
                <div
                  className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#34d399] via-[#60a5fa] to-transparent ${
                    isRunning ? 'animate-[execution-glow_1.6s_ease-in-out_infinite]' : 'translate-x-0 opacity-60'
                  }`}
                />
                {!isRunning && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                )}
              </div>
              <span className="text-xs font-medium text-white/70 min-w-[70px] text-right">
                {isRunning ? `Line ${currentLine ?? '--'}` : 'Idle'}
              </span>
            </div>
          </div>

          {/* Monaco Editor - Fills remaining space */}
          <div className="relative flex-1 min-h-0">
            <div className="absolute inset-0 -translate-y-6 rounded-[36px] bg-gradient-to-br from-[#38bdf8]/25 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none" />
            <div className="relative h-full glass-panel card-surface border border-surface-divider/70 shadow-[0_22px_50px_-35px_rgba(12,18,32,0.8)] overflow-hidden">
              <div className="editor-spotlight" />
              <div className="retro-scanlines" />
              <MonacoBasicEditor
                value={code}
                onChange={setCode}
                currentLine={currentLine}
                onCursorPositionChange={setCursorPosition}
                fontSize={fontSize}
                stopPoints={stopPoints}
                onToggleStopPoint={handleToggleStopPoint}
              />
            </div>
          </div>

          <StatusBar
            line={cursorPosition.line}
            column={cursorPosition.column}
            status={status || 'READY'}
            user={user || 'user'}
            totalLines={totalLines}
            minimumSteps={minimumSteps}
            executionLabel={executionLabel}
            deterministic={deterministic}
          />
        </div>

        {/* Educational Panel - 40% width */}
        <div className="col-span-1 flex flex-col pt-3 min-h-0 min-w-0 gap-3">
          <EducationalPanel
            variables={variables}
            arrays={arrays}
            consoleOutput={consoleOutput}
          />
        </div>
      </div>

      <div className="px-3 lg:px-5 pb-5 grid grid-cols-[3fr,2fr] gap-4 lg:gap-5 relative z-10">
        <div className="col-span-1 min-w-0">
          <AISummaryBar
            summary="This program asks for the user's name and age, then provides a response based on their age."
          />
        </div>
        <div className="col-span-1 min-w-0">
          <InputPanel
            prompt={inputPrompt}
            isAwaitingInput={isAwaitingInput}
            onSubmit={handleInputSubmit}
          />
        </div>
      </div>
    </div>
  )
}
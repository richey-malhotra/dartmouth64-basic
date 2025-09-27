'use client'

import { useState, useRef, useCallback } from 'react'
import { MonacoBasicEditor } from './MonacoBasicEditor'
import { ControlPanel } from './ControlPanel'
import { VariablesArraysPanel } from './VariablesArraysPanel'
import { ConsoleOutputPanel } from './ConsoleOutputPanel'
import { InputDialog } from './InputDialog'
import { AISummaryBar } from './AISummaryBar'
// Temporary type definitions until parser is fully integrated
interface ExecutionState {
  currentLine: number | null
  isRunning: boolean
  variables: Map<string, any>
  arrays: Map<string, any>
  consoleOutput: string[]
}

export function EditorContainer() {
  const [code, setCode] = useState(`10 PRINT "HELLO, WORLD!"
20 LET A = 5
30 LET B = 10
40 LET C = A + B
50 PRINT "A = "; A
60 PRINT "B = "; B  
70 PRINT "C = "; C
80 DIM X(5)
90 FOR I = 1 TO 5
100 LET X(I) = I * 2
110 PRINT "X("; I; ") = "; X(I)
120 NEXT I
130 END`)

  const [isRunning, setIsRunning] = useState(false)
  const [currentLine, setCurrentLine] = useState<number | null>(null)
  const [variables, setVariables] = useState(() => {
    // Demo variables for UI testing - lots to test scrolling
    const vars = new Map()
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
  const [arrays, setArrays] = useState(() => {
    // Demo arrays for UI testing - multiple arrays to test scrolling
    const arrs = new Map()
    
    // Small array
    const arrayX = {
      name: 'X',
      dimensions: [5],
      values: new Map([
        ['1', 2], ['2', 4], ['3', 6], ['4', 8], ['5', 10]
      ]),
      recentlyAccessed: new Set(['3']),
      bounds: [[1, 5]],
      type: 'number'
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
      bounds: [[1, 15]],
      type: 'number'
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
      bounds: [[1, 8]],
      type: 'string'
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
      bounds: [[1, 25]],
      type: 'number'
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
  const [speed, setSpeed] = useState(1000)
  const [inputDialog, setInputDialog] = useState<{
    isOpen: boolean
    prompt: string
    resolve?: (value: string) => void
  }>({ isOpen: false, prompt: '' })
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  
  const interpreterRef = useRef<any>(null)

  // Handle execution state updates
  const handleStateUpdate = useCallback((state: ExecutionState) => {
    setCurrentLine(state.currentLine)
    setVariables(new Map(state.variables))
    setArrays(new Map(state.arrays))
    setConsoleOutput([...state.consoleOutput])
    setIsRunning(state.isRunning)
  }, [])

  // Handle input requests (for INPUT statements)
  const handleInputRequest = useCallback(async (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      setInputDialog({
        isOpen: true,
        prompt,
        resolve
      })
    })
  }, [])

  const handleInputSubmit = useCallback((value: string) => {
    if (inputDialog.resolve) {
      inputDialog.resolve(value)
    }
    setInputDialog({ isOpen: false, prompt: '' })
  }, [inputDialog])

  const handleInputCancel = useCallback(() => {
    if (inputDialog.resolve) {
      inputDialog.resolve('')
    }
    setInputDialog({ isOpen: false, prompt: '' })
  }, [inputDialog])

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
  }, [code, speed, handleStateUpdate, handleInputRequest])

  // Control handlers
  const handleRun = useCallback(async () => {
    const interpreter = await createInterpreter()
    if (!interpreter) {
      // Demo execution for now
      setIsRunning(true)
      setCurrentLine(10)
      setTimeout(() => {
        setCurrentLine(20)
      }, 1000)
      setTimeout(() => {
        setCurrentLine(null)
        setIsRunning(false)
      }, 3000)
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
  }, [createInterpreter])

  const handleStep = useCallback(async () => {
    if (!interpreterRef.current) {
      // Demo step execution for now
      const lines = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130]
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
  }, [createInterpreter, currentLine])

  const handleStop = useCallback(() => {
    if (interpreterRef.current) {
      interpreterRef.current.stop()
    }
    setIsRunning(false)
    setCurrentLine(null)
    interpreterRef.current = null
  }, [])

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed)
    if (interpreterRef.current) {
      interpreterRef.current.setSpeed(newSpeed)
    }
  }, [])

  return (
    <div className="h-full flex bg-[#1e1e1e]">
      {/* Main Editor Area - 60% width */}
      <div className="w-[60%] flex flex-col min-w-0">
        {/* Control Panel */}
        <ControlPanel 
          isRunning={isRunning}
          onRun={handleRun}
          onStop={handleStop}
          onStep={handleStep}
          onReset={() => {
            setCurrentLine(null)
            setIsRunning(false)
            setConsoleOutput(['READY'])
          }}
          onNew={() => {
            setCode('')
            setCurrentLine(null)
            setIsRunning(false)
            setConsoleOutput(['READY'])
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
          speed={speed}
          onSpeedChange={handleSpeedChange}
        />
        
        {/* Monaco Editor - 80% of remaining height */}
        <div className="h-[80%]">
          <MonacoBasicEditor
            value={code}
            onChange={setCode}
            currentLine={currentLine}
            onCursorPositionChange={setCursorPosition}
          />
        </div>

        {/* AI Summary Bar - 20% of remaining height */}
        <div className="h-[20%] border-t border-[#3e3e42]">
          <AISummaryBar
            summary="This program demonstrates array usage in BASIC, showing how to declare arrays with DIM and access elements with subscripts."
            onConvert={() => {
              console.log('Convert to modern language')
            }}
            onAIAssist={() => {
              console.log('AI Assistant')
            }}
          />
        </div>
      </div>

      {/* Educational Panel - 40% width */}
      <div className="w-[40%] border-l border-[#2d2d30] bg-[#252526] flex flex-col">
        {/* Variables & Arrays Panel - Top half */}
        <div className="h-1/2 border-b border-[#3e3e42]">
          <VariablesArraysPanel
            variables={variables}
            arrays={arrays}
            currentLine={currentLine}
          />
        </div>
        
        {/* Console Output Panel - Bottom half */}
        <div className="h-1/2">
          <ConsoleOutputPanel
            consoleOutput={consoleOutput}
            currentLine={currentLine}
            isRunning={isRunning}
            onInputSubmit={(input) => {
              setConsoleOutput(prev => [...prev, `? ${input}`])
            }}
            waitingForInput={false}
          />
        </div>
      </div>

      {/* Input Dialog */}
      <InputDialog
        isOpen={inputDialog.isOpen}
        prompt={inputDialog.prompt}
        onSubmit={handleInputSubmit}
        onCancel={handleInputCancel}
      />
    </div>
  )
}
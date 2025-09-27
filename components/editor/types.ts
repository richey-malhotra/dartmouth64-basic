export type ScalarValue = number | string

export interface VariableState {
  name: string
  value: ScalarValue
  type: 'number' | 'string'
  lastChanged?: number
  changed?: boolean
}

export interface ArrayState {
  name: string
  dimensions: number[]
  values: Map<string, ScalarValue>
  recentlyAccessed: Set<string>
  recentlyChanged?: Set<string>
  bounds: [number, number][]
  type: 'number' | 'string'
}

export interface ExecutionStateSnapshot {
  currentLine: number | null
  isRunning: boolean
  variables: Map<string, VariableState>
  arrays: Map<string, ArrayState>
  consoleOutput: string[]
}

export interface InterpreterLike {
  run?: () => Promise<void>
  step?: () => Promise<void>
  stop: () => void
}

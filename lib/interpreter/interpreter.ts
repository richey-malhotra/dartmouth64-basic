import { 
  ProgramNode, LineNode, StatementNode, ExpressionNode,
  LetNode, PrintNode, InputNode, ForNode, NextNode, IfNode,
  GotoNode, GosubNode, ReturnNode, DimNode, ReadNode, DataNode,
  RemNode, EndNode, StopNode, BinaryOpNode, UnaryOpNode,
  VariableRefNode, ArrayRefNode, NumberNode, StringNode,
  FunctionCallNode
} from '../parser/ast'

// Execution state for educational visualization
export interface ExecutionState {
  // Program state
  currentLine: number | null
  programCounter: number
  isRunning: boolean
  isPaused: boolean
  isFinished: boolean
  
  // Variable state for educational display
  variables: Map<string, Variable>
  arrays: Map<string, ArrayState>
  
  // Control flow
  forLoops: Map<string, ForLoopState>
  callStack: number[]
  
  // I/O
  consoleOutput: string[]
  dataPointer: number
  dataValues: (number | string)[]
  
  // Educational features
  recentlyChangedVars: Set<string>
  recentlyAccessedArrays: Map<string, Set<string>>
}

export interface Variable {
  name: string
  value: any
  type: 'number' | 'string' 
  lastChanged?: number
}

export interface ArrayState {
  name: string
  dimensions: number[]
  values: Map<string, any>
  recentlyAccessed: Set<string>
  bounds: [number, number][]
  type: 'number' | 'string'
}

export interface ForLoopState {
  variable: string
  current: number
  end: number
  step: number
  returnLine: number
}

// Main interpreter class
export class BasicInterpreter {
  private program: ProgramNode
  private state: ExecutionState
  private lineMap: Map<number, LineNode>
  private speed: number = 1000 // ms between steps
  private stepCallback?: (state: ExecutionState) => void
  private inputCallback?: (prompt: string) => Promise<string>

  constructor(program: ProgramNode) {
    this.program = program
    this.lineMap = new Map()
    
    // Build line number map for GOTO/GOSUB
    program.lines.forEach(line => {
      this.lineMap.set(line.lineNumber, line)
    })
    
    this.state = this.createInitialState()
  }

  private createInitialState(): ExecutionState {
    return {
      currentLine: null,
      programCounter: 0,
      isRunning: false,
      isPaused: false,
      isFinished: false,
      variables: new Map(),
      arrays: new Map(),
      forLoops: new Map(),
      callStack: [],
      consoleOutput: [],
      dataPointer: 0,
      dataValues: [],
      recentlyChangedVars: new Set(),
      recentlyAccessedArrays: new Map()
    }
  }

  // Set callbacks for UI integration
  setStepCallback(callback: (state: ExecutionState) => void) {
    this.stepCallback = callback
  }

  setInputCallback(callback: (prompt: string) => Promise<string>) {
    this.inputCallback = callback
  }

  setSpeed(speed: number) {
    this.speed = Math.max(100, Math.min(3000, speed))
  }

  // Main execution methods
  async run(): Promise<void> {
    this.state.isRunning = true
    this.state.isPaused = false
    
    while (this.state.isRunning && !this.state.isFinished && !this.state.isPaused) {
      await this.step()
      if (this.speed > 0) {
        await this.sleep(this.speed)
      }
    }
  }

  async step(): Promise<void> {
    if (this.state.isFinished) return
    
    // Clear recent changes from previous step
    this.state.recentlyChangedVars.clear()
    this.state.recentlyAccessedArrays.clear()
    
    const currentLine = this.getCurrentLine()
    if (!currentLine) {
      this.state.isFinished = true
      this.state.isRunning = false
      return
    }

    this.state.currentLine = currentLine.lineNumber
    
    try {
      await this.executeStatement(currentLine.statement)
    } catch (error) {
      this.state.consoleOutput.push(`ERROR at line ${currentLine.lineNumber}: ${error}`)
      this.state.isRunning = false
      this.state.isFinished = true
    }
    
    // Notify UI of state change
    if (this.stepCallback) {
      this.stepCallback({ ...this.state })
    }
  }

  stop(): void {
    this.state.isRunning = false
    this.state.isPaused = false
  }

  pause(): void {
    this.state.isPaused = true
  }

  resume(): void {
    this.state.isPaused = false
    if (!this.state.isFinished) {
      this.run()
    }
  }

  reset(): void {
    this.state = this.createInitialState()
  }

  getState(): ExecutionState {
    return { ...this.state }
  }

  // Execution helpers
  private getCurrentLine(): LineNode | null {
    if (this.state.programCounter >= this.program.lines.length) {
      return null
    }
    return this.program.lines[this.state.programCounter]
  }

  private async executeStatement(statement: StatementNode): Promise<void> {
    switch (statement.type) {
      case 'Let':
        await this.executeLet(statement)
        this.state.programCounter++
        break
      case 'Print':
        await this.executePrint(statement)
        this.state.programCounter++
        break
      case 'Input':
        await this.executeInput(statement)
        this.state.programCounter++
        break
      case 'For':
        await this.executeFor(statement)
        this.state.programCounter++
        break
      case 'Next':
        await this.executeNext(statement)
        break
      case 'If':
        await this.executeIf(statement)
        break
      case 'Goto':
        this.executeGoto(statement)
        break
      case 'Gosub':
        this.executeGosub(statement)
        break
      case 'Return':
        this.executeReturn()
        break
      case 'Dim':
        this.executeDim(statement)
        this.state.programCounter++
        break
      case 'End':
      case 'Stop':
        this.state.isFinished = true
        this.state.isRunning = false
        break
      case 'Rem':
        // Comments do nothing
        this.state.programCounter++
        break
      default:
        throw new Error(`Unimplemented statement: ${(statement as any).type}`)
    }
  }

  private async executeLet(statement: LetNode): Promise<void> {
    const value = await this.evaluateExpression(statement.expression)
    
    if (statement.arrayIndices) {
      // Array assignment
      const indices = []
      for (const indexExpr of statement.arrayIndices) {
        const index = await this.evaluateExpression(indexExpr)
        if (typeof index !== 'number') {
          throw new Error('Array index must be a number')
        }
        indices.push(Math.floor(index))
      }
      
      this.setArrayValue(statement.variable, indices, value)
    } else {
      // Variable assignment
      this.setVariable(statement.variable, value)
    }
  }

  private async executePrint(statement: PrintNode): Promise<void> {
    let output = ''
    
    for (let i = 0; i < statement.items.length; i++) {
      const item = statement.items[i]
      const value = await this.evaluateExpression(item.expression)
      
      output += this.valueToString(value)
      
      if (item.separator === 'comma') {
        output += '\t' // Tab for comma
      } else if (item.separator === 'semicolon') {
        // No space for semicolon
      } else if (i < statement.items.length - 1) {
        output += ' ' // Default space
      }
    }
    
    this.state.consoleOutput.push(output)
  }

  private async executeInput(statement: InputNode): Promise<void> {
    for (const varRef of statement.variables) {
      const prompt = `? `
      let input: string
      
      if (this.inputCallback) {
        input = await this.inputCallback(prompt)
      } else {
        throw new Error('No input callback provided')
      }
      
      // Parse input based on variable type
      const isString = varRef.name.endsWith('$')
      const value = isString ? input : parseFloat(input) || 0
      
      if (varRef.type === 'ArrayRef') {
        const indices = []
        for (const indexExpr of varRef.indices) {
          const index = await this.evaluateExpression(indexExpr)
          indices.push(Math.floor(index as number))
        }
        this.setArrayValue(varRef.name, indices, value)
      } else {
        this.setVariable(varRef.name, value)
      }
    }
  }

  private async executeFor(statement: ForNode): Promise<void> {
    const start = await this.evaluateExpression(statement.start)
    const end = await this.evaluateExpression(statement.end)
    const step = statement.step ? await this.evaluateExpression(statement.step) : 1
    
    if (typeof start !== 'number' || typeof end !== 'number' || typeof step !== 'number') {
      throw new Error('FOR loop bounds must be numbers')
    }
    
    // Initialize loop variable
    this.setVariable(statement.variable, start)
    
    // Store loop state
    this.state.forLoops.set(statement.variable, {
      variable: statement.variable,
      current: start,
      end: end,
      step: step,
      returnLine: this.state.programCounter
    })
  }

  private async executeNext(statement: NextNode): Promise<void> {
    const loop = this.state.forLoops.get(statement.variable)
    if (!loop) {
      throw new Error(`NEXT without FOR: ${statement.variable}`)
    }
    
    // Increment loop variable
    loop.current += loop.step
    this.setVariable(loop.variable, loop.current)
    
    // Check if loop should continue
    const shouldContinue = loop.step > 0 ? 
      loop.current <= loop.end : 
      loop.current >= loop.end
    
    if (shouldContinue) {
      // Jump back to after FOR statement
      this.state.programCounter = loop.returnLine + 1
    } else {
      // Exit loop
      this.state.forLoops.delete(statement.variable)
      this.state.programCounter++
    }
  }

  private async executeIf(statement: IfNode): Promise<void> {
    const condition = await this.evaluateExpression(statement.condition)
    const isTrue = this.isTruthy(condition)
    
    if (isTrue) {
      if (statement.thenAction.type === 'Goto') {
        this.executeGoto(statement.thenAction)
      } else {
        await this.executeStatement(statement.thenAction)
      }
    } else {
      this.state.programCounter++
    }
  }

  private executeGoto(statement: GotoNode): void {
    const targetLine = this.findLineIndex(statement.lineNumber)
    if (targetLine === -1) {
      throw new Error(`Line ${statement.lineNumber} not found`)
    }
    this.state.programCounter = targetLine
  }

  private executeGosub(statement: GosubNode): void {
    this.state.callStack.push(this.state.programCounter + 1)
    const targetLine = this.findLineIndex(statement.lineNumber)
    if (targetLine === -1) {
      throw new Error(`Line ${statement.lineNumber} not found`)
    }
    this.state.programCounter = targetLine
  }

  private executeReturn(): void {
    if (this.state.callStack.length === 0) {
      throw new Error('RETURN without GOSUB')
    }
    this.state.programCounter = this.state.callStack.pop()!
  }

  private executeDim(statement: DimNode): void {
    for (const arrayDecl of statement.arrays) {
      const dimensions = []
      const bounds: [number, number][] = []
      
      for (const dimExpr of arrayDecl.dimensions) {
        // For simplicity, evaluate dimension expressions immediately
        // In real BASIC, these would be evaluated at runtime
        const size = this.evaluateExpressionSync(dimExpr)
        if (typeof size !== 'number' || size < 1) {
          throw new Error('Array dimension must be a positive number')
        }
        dimensions.push(Math.floor(size))
        bounds.push([1, Math.floor(size)]) // 1-indexed arrays
      }
      
      const arrayState: ArrayState = {
        name: arrayDecl.name,
        dimensions,
        values: new Map(),
        recentlyAccessed: new Set(),
        bounds,
        type: arrayDecl.name.endsWith('$') ? 'string' : 'number'
      }
      
      this.state.arrays.set(arrayDecl.name, arrayState)
    }
  }

  // Expression evaluation
  private async evaluateExpression(expr: ExpressionNode): Promise<any> {
    switch (expr.type) {
      case 'Number':
        return expr.value
      case 'String':
        return expr.value
      case 'Variable':
        return this.getVariable(expr.name)
      case 'ArrayRef':
        const indices = []
        for (const indexExpr of expr.indices) {
          const index = await this.evaluateExpression(indexExpr)
          indices.push(Math.floor(index as number))
        }
        return this.getArrayValue(expr.name, indices)
      case 'BinaryOp':
        return this.evaluateBinaryOp(expr)
      case 'UnaryOp':
        return this.evaluateUnaryOp(expr)
      case 'FunctionCall':
        return this.evaluateFunctionCall(expr)
      default:
        throw new Error(`Unknown expression type: ${(expr as any).type}`)
    }
  }

  // Synchronous expression evaluation for DIM statements
  private evaluateExpressionSync(expr: ExpressionNode): any {
    switch (expr.type) {
      case 'Number':
        return expr.value
      case 'String':
        return expr.value
      default:
        throw new Error('Only literal values allowed in DIM statements')
    }
  }

  private async evaluateBinaryOp(expr: BinaryOpNode): Promise<any> {
    const left = await this.evaluateExpression(expr.left)
    const right = await this.evaluateExpression(expr.right)
    
    switch (expr.operator) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
      case '/': return left / right
      case '^': return Math.pow(left, right)
      case '=': return left === right ? 1 : 0
      case '<>': return left !== right ? 1 : 0
      case '<': return left < right ? 1 : 0
      case '<=': return left <= right ? 1 : 0
      case '>': return left > right ? 1 : 0
      case '>=': return left >= right ? 1 : 0
      case 'AND': return (this.isTruthy(left) && this.isTruthy(right)) ? 1 : 0
      case 'OR': return (this.isTruthy(left) || this.isTruthy(right)) ? 1 : 0
      default:
        throw new Error(`Unknown binary operator: ${expr.operator}`)
    }
  }

  private async evaluateUnaryOp(expr: UnaryOpNode): Promise<any> {
    const operand = await this.evaluateExpression(expr.operand)
    
    switch (expr.operator) {
      case '-': return -operand
      case 'NOT': return this.isTruthy(operand) ? 0 : 1
      default:
        throw new Error(`Unknown unary operator: ${expr.operator}`)
    }
  }

  private async evaluateFunctionCall(expr: FunctionCallNode): Promise<number> {
    const arg = await this.evaluateExpression(expr.args[0])
    const num = typeof arg === 'number' ? arg : parseFloat(String(arg))
    
    switch (expr.name) {
      case 'ABS': return Math.abs(num)
      case 'SQR': return Math.sqrt(num)
      case 'INT': return Math.floor(num)
      case 'SGN': return num > 0 ? 1 : num < 0 ? -1 : 0
      case 'SIN': return Math.sin(num)
      case 'COS': return Math.cos(num)
      case 'ATN': return Math.atan(num)
      case 'EXP': return Math.exp(num)
      case 'LOG': return Math.log(num)
      case 'RND': return Math.random()
      case 'TAB': return num // TAB is handled in print formatting
      default:
        throw new Error(`Unknown function: ${expr.name}`)
    }
  }

  // Variable and array management
  private setVariable(name: string, value: any): void {
    const type = name.endsWith('$') ? 'string' : 'number'
    const variable: Variable = {
      name,
      value,
      type,
      lastChanged: this.state.currentLine || undefined
    }
    
    this.state.variables.set(name, variable)
    this.state.recentlyChangedVars.add(name)
  }

  private getVariable(name: string): any {
    const variable = this.state.variables.get(name)
    if (!variable) {
      // Uninitialized variables default to 0 or ""
      return name.endsWith('$') ? '' : 0
    }
    return variable.value
  }

  private setArrayValue(name: string, indices: number[], value: any): void {
    const array = this.state.arrays.get(name)
    if (!array) {
      throw new Error(`Array ${name} not dimensioned`)
    }
    
    // Check bounds (1-indexed)
    for (let i = 0; i < indices.length; i++) {
      const [min, max] = array.bounds[i]
      if (indices[i] < min || indices[i] > max) {
        throw new Error(`Array index ${indices[i]} out of bounds [${min}, ${max}]`)
      }
    }
    
    const key = indices.join(',')
    array.values.set(key, value)
    array.recentlyAccessed.add(key)
    
    if (!this.state.recentlyAccessedArrays.has(name)) {
      this.state.recentlyAccessedArrays.set(name, new Set())
    }
    this.state.recentlyAccessedArrays.get(name)!.add(key)
  }

  private getArrayValue(name: string, indices: number[]): any {
    const array = this.state.arrays.get(name)
    if (!array) {
      throw new Error(`Array ${name} not dimensioned`)
    }
    
    const key = indices.join(',')
    array.recentlyAccessed.add(key)
    
    if (!this.state.recentlyAccessedArrays.has(name)) {
      this.state.recentlyAccessedArrays.set(name, new Set())
    }
    this.state.recentlyAccessedArrays.get(name)!.add(key)
    
    return array.values.get(key) || (array.type === 'string' ? '' : 0)
  }

  // Utility methods
  private isTruthy(value: any): boolean {
    if (typeof value === 'number') return value !== 0
    if (typeof value === 'string') return value !== ''
    return Boolean(value)
  }

  private valueToString(value: any): string {
    if (typeof value === 'string') return value
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toString()
      return value.toFixed(6).replace(/\.?0+$/, '')
    }
    return String(value)
  }

  private findLineIndex(lineNumber: number): number {
    return this.program.lines.findIndex(line => line.lineNumber === lineNumber)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
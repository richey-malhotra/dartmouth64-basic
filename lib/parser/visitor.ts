/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicParser } from './parser'
import { BasicLexer } from './lexer'
import {
  ProgramNode, LineNode, StatementNode, ExpressionNode,
  LetNode, PrintNode, InputNode, ForNode, NextNode, IfNode,
  GotoNode, GosubNode, ReturnNode, DimNode, ReadNode, DataNode,
  RemNode, EndNode, StopNode, VariableRefNode, ArrayRefNode,
  FunctionCallNode, PrintItemNode, ArrayDeclNode
} from './ast'

const BaseVisitorConstructor = (BasicParser as unknown as {
  getBaseCstVisitorConstructor: () => new (...args: unknown[]) => {
    validateVisitor: () => void
    visit: (ctx: any) => any
  }
}).getBaseCstVisitorConstructor()

// CST to AST visitor for Dartmouth 64 BASIC
export class BasicInterpreterVisitor extends BaseVisitorConstructor {
  
  constructor() {
    super()
    this.validateVisitor()
  }

  program(ctx: any): ProgramNode {
    const lines: LineNode[] = []
    if (ctx.line) {
      for (const lineCtx of ctx.line) {
        lines.push(this.visit(lineCtx))
      }
    }
    return {
      type: 'Program',
      lines
    }
  }

  line(ctx: any): LineNode {
    const lineNumber = parseInt(ctx.LineNumber[0].image)
    const statement = this.visit(ctx.statement)
    
    return {
      type: 'Line',
      lineNumber,
      statement
    }
  }

  statement(ctx: any): StatementNode {
    if (ctx.letStatement) return this.visit(ctx.letStatement)
    if (ctx.printStatement) return this.visit(ctx.printStatement)
    if (ctx.inputStatement) return this.visit(ctx.inputStatement)
    if (ctx.forStatement) return this.visit(ctx.forStatement)
    if (ctx.nextStatement) return this.visit(ctx.nextStatement)
    if (ctx.ifStatement) return this.visit(ctx.ifStatement)
    if (ctx.gotoStatement) return this.visit(ctx.gotoStatement)
    if (ctx.gosubStatement) return this.visit(ctx.gosubStatement)
    if (ctx.returnStatement) return this.visit(ctx.returnStatement)
    if (ctx.dimStatement) return this.visit(ctx.dimStatement)
    if (ctx.readStatement) return this.visit(ctx.readStatement)
    if (ctx.dataStatement) return this.visit(ctx.dataStatement)
    if (ctx.remStatement) return this.visit(ctx.remStatement)
    if (ctx.endStatement) return this.visit(ctx.endStatement)
    if (ctx.stopStatement) return this.visit(ctx.stopStatement)
    
    throw new Error('Unknown statement type')
  }

  letStatement(ctx: any): LetNode {
    const varRef = this.visit(ctx.variableRef)
    const expression = this.visit(ctx.expression)
    
    // Handle array assignment vs variable assignment
    if (varRef.type === 'ArrayRef') {
      return {
        type: 'Let',
        variable: varRef.name,
        arrayIndices: varRef.indices,
        expression
      }
    } else {
      return {
        type: 'Let',
        variable: varRef.name,
        expression
      }
    }
  }

  printStatement(ctx: any): PrintNode {
    const items: PrintItemNode[] = []
    
    if (ctx.printItem) {
      for (let i = 0; i < ctx.printItem.length; i++) {
        const expression = this.visit(ctx.printItem[i])
        let separator: 'comma' | 'semicolon' | undefined
        
        // Determine separator from context
        if (i < ctx.printItem.length - 1) {
          if (ctx.Comma && ctx.Comma[i]) separator = 'comma'
          else if (ctx.Semicolon && ctx.Semicolon[i]) separator = 'semicolon'
        }
        
        items.push({
          type: 'PrintItem',
          expression,
          separator
        })
      }
    }
    
    return {
      type: 'Print',
      items
    }
  }

  inputStatement(ctx: any): InputNode {
    const variables: VariableRefNode[] = []
    for (const varRef of ctx.variableRef) {
      variables.push(this.visit(varRef))
    }
    
    return {
      type: 'Input',
      variables
    }
  }

  forStatement(ctx: any): ForNode {
    const variable = ctx.Variable[0].image
    const start = this.visit(ctx.start)
    const end = this.visit(ctx.end)
    const step = ctx.step ? this.visit(ctx.step) : undefined
    
    return {
      type: 'For',
      variable,
      start,
      end,
      step
    }
  }

  nextStatement(ctx: any): NextNode {
    const variable = ctx.Variable[0].image
    
    return {
      type: 'Next',
      variable
    }
  }

  ifStatement(ctx: any): IfNode {
    const condition = this.visit(ctx.condition)
    let thenAction: StatementNode | GotoNode
    
    if (ctx.statement) {
      thenAction = this.visit(ctx.statement)
    } else if (ctx.NumberLiteral) {
      // THEN line_number becomes GOTO line_number
      thenAction = {
        type: 'Goto',
        lineNumber: parseInt(ctx.NumberLiteral[0].image)
      }
    } else {
      throw new Error('IF statement missing THEN action')
    }
    
    return {
      type: 'If',
      condition,
      thenAction
    }
  }

  gotoStatement(ctx: any): GotoNode {
    const lineNumber = parseInt(ctx.NumberLiteral[0].image)
    
    return {
      type: 'Goto',
      lineNumber
    }
  }

  gosubStatement(ctx: any): GosubNode {
    const lineNumber = parseInt(ctx.NumberLiteral[0].image)
    
    return {
      type: 'Gosub',
      lineNumber
    }
  }

  returnStatement(): ReturnNode {
    return {
      type: 'Return'
    }
  }

  dimStatement(ctx: any): DimNode {
    const arrays: ArrayDeclNode[] = []
    for (const arrayDecl of ctx.arrayDecl) {
      arrays.push(this.visit(arrayDecl))
    }
    
    return {
      type: 'Dim',
      arrays
    }
  }

  arrayDecl(ctx: any): ArrayDeclNode {
    const name = ctx.Variable[0].image
    const dimensions: ExpressionNode[] = []
    
    for (const expr of ctx.expression) {
      dimensions.push(this.visit(expr))
    }
    
    return {
      type: 'ArrayDecl',
      name,
      dimensions
    }
  }

  readStatement(ctx: any): ReadNode {
    const variables: VariableRefNode[] = []
    for (const varRef of ctx.variableRef) {
      variables.push(this.visit(varRef))
    }
    
    return {
      type: 'Read',
      variables
    }
  }

  dataStatement(ctx: any): DataNode {
    const values: (number | string)[] = []
    
    for (const dataValue of ctx.dataValue) {
      const value = this.visit(dataValue)
      values.push(value)
    }
    
    return {
      type: 'Data',
      values
    }
  }

  dataValue(ctx: any): number | string {
    if (ctx.NumberLiteral) {
      return parseFloat(ctx.NumberLiteral[0].image)
    } else if (ctx.StringLiteral) {
      // Remove quotes
      const str = ctx.StringLiteral[0].image
      return str.slice(1, -1)
    }
    throw new Error('Invalid data value')
  }

  remStatement(ctx: any): RemNode {
    const comment = ctx.Comment ? ctx.Comment[0].image : ''
    
    return {
      type: 'Rem',
      comment
    }
  }

  endStatement(): EndNode {
    return {
      type: 'End'
    }
  }

  stopStatement(): StopNode {
    return {
      type: 'Stop'
    }
  }

  // Expression visitors
  expression(ctx: any): ExpressionNode {
    return this.visit(ctx.orExpression)
  }

  orExpression(ctx: any): ExpressionNode {
    let result = this.visit(ctx.andExpression[0])
    
    for (let i = 1; i < ctx.andExpression.length; i++) {
      result = {
        type: 'BinaryOp',
        left: result,
        operator: 'OR',
        right: this.visit(ctx.andExpression[i])
      }
    }
    
    return result
  }

  andExpression(ctx: any): ExpressionNode {
    let result = this.visit(ctx.relationalExpression[0])
    
    for (let i = 1; i < ctx.relationalExpression.length; i++) {
      result = {
        type: 'BinaryOp',
        left: result,
        operator: 'AND',
        right: this.visit(ctx.relationalExpression[i])
      }
    }
    
    return result
  }

  relationalExpression(ctx: any): ExpressionNode {
    let result = this.visit(ctx.additiveExpression[0])
    
    for (let i = 1; i < ctx.additiveExpression.length; i++) {
      let operator: string
      if (ctx.Equal && ctx.Equal[i-1]) operator = '='
      else if (ctx.NotEqual && ctx.NotEqual[i-1]) operator = '<>'
      else if (ctx.LessThan && ctx.LessThan[i-1]) operator = '<'
      else if (ctx.LessEqual && ctx.LessEqual[i-1]) operator = '<='
      else if (ctx.GreaterThan && ctx.GreaterThan[i-1]) operator = '>'
      else if (ctx.GreaterEqual && ctx.GreaterEqual[i-1]) operator = '>='
      else throw new Error('Unknown relational operator')
      
      result = {
        type: 'BinaryOp',
        left: result,
        operator: operator as any,
        right: this.visit(ctx.additiveExpression[i])
      }
    }
    
    return result
  }

  additiveExpression(ctx: any): ExpressionNode {
    let result = this.visit(ctx.multiplicativeExpression[0])
    
    for (let i = 1; i < ctx.multiplicativeExpression.length; i++) {
      const operator = ctx.Plus?.[i-1] ? '+' : '-'
      result = {
        type: 'BinaryOp',
        left: result,
        operator: operator as any,
        right: this.visit(ctx.multiplicativeExpression[i])
      }
    }
    
    return result
  }

  multiplicativeExpression(ctx: any): ExpressionNode {
    let result = this.visit(ctx.powerExpression[0])
    
    for (let i = 1; i < ctx.powerExpression.length; i++) {
      const operator = ctx.Multiply?.[i-1] ? '*' : '/'
      result = {
        type: 'BinaryOp',
        left: result,
        operator: operator as any,
        right: this.visit(ctx.powerExpression[i])
      }
    }
    
    return result
  }

  powerExpression(ctx: any): ExpressionNode {
    let result = this.visit(ctx.unaryExpression[0])
    
    for (let i = 1; i < ctx.unaryExpression.length; i++) {
      result = {
        type: 'BinaryOp',
        left: result,
        operator: '^',
        right: this.visit(ctx.unaryExpression[i])
      }
    }
    
    return result
  }

  unaryExpression(ctx: any): ExpressionNode {
    if (ctx.Minus || ctx.Not) {
      const operator = ctx.Minus ? '-' : 'NOT'
      return {
        type: 'UnaryOp',
        operator: operator as any,
        operand: this.visit(ctx.unaryExpression)
      }
    } else {
      return this.visit(ctx.primaryExpression)
    }
  }

  primaryExpression(ctx: any): ExpressionNode {
    if (ctx.NumberLiteral) {
      return {
        type: 'Number',
        value: parseFloat(ctx.NumberLiteral[0].image)
      }
    } else if (ctx.StringLiteral) {
      // Remove quotes
      const str = ctx.StringLiteral[0].image
      return {
        type: 'String',
        value: str.slice(1, -1)
      }
    } else if (ctx.variableRef) {
      return this.visit(ctx.variableRef)
    } else if (ctx.functionCall) {
      return this.visit(ctx.functionCall)
    } else if (ctx.expression) {
      return this.visit(ctx.expression)
    }
    
    throw new Error('Unknown primary expression')
  }

  variableRef(ctx: any): VariableRefNode | ArrayRefNode {
    const name = ctx.Variable[0].image
    
    if (ctx.expression) {
      // Array reference
      const indices: ExpressionNode[] = []
      for (const expr of ctx.expression) {
        indices.push(this.visit(expr))
      }
      
      return {
        type: 'ArrayRef',
        name,
        indices
      }
    } else {
      // Simple variable
      return {
        type: 'Variable',
        name
      }
    }
  }

  functionCall(ctx: any): FunctionCallNode {
    // Get function name from context
    let name: string
    if (ctx.Abs) name = 'ABS'
    else if (ctx.Sqr) name = 'SQR'
    else if (ctx.Int) name = 'INT'
    else if (ctx.Sgn) name = 'SGN'
    else if (ctx.Sin) name = 'SIN'
    else if (ctx.Cos) name = 'COS'
    else if (ctx.Atn) name = 'ATN'
    else if (ctx.Exp) name = 'EXP'
    else if (ctx.Log) name = 'LOG'
    else if (ctx.Rnd) name = 'RND'
    else if (ctx.Tab) name = 'TAB'
    else throw new Error('Unknown function')
    
    const args = [this.visit(ctx.expression)]
    
    return {
      type: 'FunctionCall',
      name: name as any,
      args
    }
  }
}

// Main parse function
export function parseBasicProgram(code: string): ProgramNode {
  const lexingResult = BasicLexer.tokenize(code)
  
  if (lexingResult.errors.length > 0) {
    throw new Error(`Lexing errors: ${lexingResult.errors.map(e => e.message).join(', ')}`)
  }
  
  const parser = new BasicParser()
  parser.input = lexingResult.tokens
  
  const cst = parser.program()
  
  if (parser.errors.length > 0) {
    throw new Error(`Parsing errors: ${parser.errors.map(e => e.message).join(', ')}`)
  }
  
  const visitor = new BasicInterpreterVisitor()
  const ast = visitor.visit(cst) as ProgramNode
  
  return ast
}
// AST Node types for Dartmouth 64 BASIC
// Following specification from docs/spec.md

export interface ASTNode {
  type: string
  location?: { line: number, column: number }
}

// Program structure
export interface ProgramNode extends ASTNode {
  type: 'Program'
  lines: LineNode[]
}

export interface LineNode extends ASTNode {
  type: 'Line'
  lineNumber: number
  statement: StatementNode
}

// Statement nodes
export type StatementNode = 
  | LetNode
  | PrintNode
  | InputNode
  | ForNode
  | NextNode
  | IfNode
  | GotoNode
  | GosubNode
  | ReturnNode
  | DimNode
  | ReadNode
  | DataNode
  | RemNode
  | EndNode
  | StopNode

export interface LetNode extends ASTNode {
  type: 'Let'
  variable: string
  arrayIndices?: ExpressionNode[]
  expression: ExpressionNode
}

export interface PrintNode extends ASTNode {
  type: 'Print'
  items: PrintItemNode[]
  separator?: 'comma' | 'semicolon' | 'none'
}

export interface PrintItemNode extends ASTNode {
  type: 'PrintItem'
  expression: ExpressionNode
  separator?: 'comma' | 'semicolon'
}

export interface InputNode extends ASTNode {
  type: 'Input'
  variables: VariableRefNode[]
}

export interface ForNode extends ASTNode {
  type: 'For'
  variable: string
  start: ExpressionNode
  end: ExpressionNode
  step?: ExpressionNode
}

export interface NextNode extends ASTNode {
  type: 'Next'
  variable: string
}

export interface IfNode extends ASTNode {
  type: 'If'
  condition: ExpressionNode
  thenAction: StatementNode | GotoNode
}

export interface GotoNode extends ASTNode {
  type: 'Goto'
  lineNumber: number
}

export interface GosubNode extends ASTNode {
  type: 'Gosub'
  lineNumber: number
}

export interface ReturnNode extends ASTNode {
  type: 'Return'
}

export interface DimNode extends ASTNode {
  type: 'Dim'
  arrays: ArrayDeclNode[]
}

export interface ArrayDeclNode extends ASTNode {
  type: 'ArrayDecl'
  name: string
  dimensions: ExpressionNode[]
}

export interface ReadNode extends ASTNode {
  type: 'Read'
  variables: VariableRefNode[]
}

export interface DataNode extends ASTNode {
  type: 'Data'
  values: (number | string)[]
}

export interface RemNode extends ASTNode {
  type: 'Rem'
  comment: string
}

export interface EndNode extends ASTNode {
  type: 'End'
}

export interface StopNode extends ASTNode {
  type: 'Stop'
}

// Expression nodes
export type ExpressionNode = 
  | BinaryOpNode
  | UnaryOpNode
  | VariableRefNode
  | ArrayRefNode
  | NumberNode
  | StringNode
  | FunctionCallNode

export interface BinaryOpNode extends ASTNode {
  type: 'BinaryOp'
  left: ExpressionNode
  operator: '+' | '-' | '*' | '/' | '^' | '=' | '<>' | '<' | '<=' | '>' | '>=' | 'AND' | 'OR'
  right: ExpressionNode
}

export interface UnaryOpNode extends ASTNode {
  type: 'UnaryOp'
  operator: '-' | 'NOT'
  operand: ExpressionNode
}

export interface VariableRefNode extends ASTNode {
  type: 'Variable'
  name: string
}

export interface ArrayRefNode extends ASTNode {
  type: 'ArrayRef'
  name: string
  indices: ExpressionNode[]
}

export interface NumberNode extends ASTNode {
  type: 'Number'
  value: number
}

export interface StringNode extends ASTNode {
  type: 'String'
  value: string
}

export interface FunctionCallNode extends ASTNode {
  type: 'FunctionCall'
  name: 'ABS' | 'SQR' | 'INT' | 'SGN' | 'SIN' | 'COS' | 'ATN' | 'EXP' | 'LOG' | 'RND' | 'TAB'
  args: ExpressionNode[]
}

// Helper type for pattern matching
export type AnyNode = 
  | ProgramNode
  | LineNode
  | StatementNode
  | ExpressionNode
  | PrintItemNode
  | ArrayDeclNode
  | VariableRefNode
import { createToken, Lexer, CstParser, IToken } from 'chevrotain'

// Token definitions for Dartmouth 64 BASIC
// Following historical 1964 specification

// Keywords (case insensitive)
export const Let = createToken({ name: 'Let', pattern: /LET/i })
export const Print = createToken({ name: 'Print', pattern: /PRINT/i })
export const Input = createToken({ name: 'Input', pattern: /INPUT/i })
export const For = createToken({ name: 'For', pattern: /FOR/i })
export const To = createToken({ name: 'To', pattern: /TO/i })
export const Step = createToken({ name: 'Step', pattern: /STEP/i })
export const Next = createToken({ name: 'Next', pattern: /NEXT/i })
export const If = createToken({ name: 'If', pattern: /IF/i })
export const Then = createToken({ name: 'Then', pattern: /THEN/i })
export const Goto = createToken({ name: 'Goto', pattern: /GOTO/i })
export const Gosub = createToken({ name: 'Gosub', pattern: /GOSUB/i })
export const Return = createToken({ name: 'Return', pattern: /RETURN/i })
export const Dim = createToken({ name: 'Dim', pattern: /DIM/i })
export const Read = createToken({ name: 'Read', pattern: /READ/i })
export const Data = createToken({ name: 'Data', pattern: /DATA/i })
export const Restore = createToken({ name: 'Restore', pattern: /RESTORE/i })
export const Rem = createToken({ name: 'Rem', pattern: /REM/i })
export const End = createToken({ name: 'End', pattern: /END/i })
export const Stop = createToken({ name: 'Stop', pattern: /STOP/i })

// Built-in functions
export const Abs = createToken({ name: 'Abs', pattern: /ABS/i })
export const Sqr = createToken({ name: 'Sqr', pattern: /SQR/i })
export const Int = createToken({ name: 'Int', pattern: /INT/i })
export const Sgn = createToken({ name: 'Sgn', pattern: /SGN/i })
export const Sin = createToken({ name: 'Sin', pattern: /SIN/i })
export const Cos = createToken({ name: 'Cos', pattern: /COS/i })
export const Atn = createToken({ name: 'Atn', pattern: /ATN/i })
export const Exp = createToken({ name: 'Exp', pattern: /EXP/i })
export const Log = createToken({ name: 'Log', pattern: /LOG/i })
export const Rnd = createToken({ name: 'Rnd', pattern: /RND/i })
export const Tab = createToken({ name: 'Tab', pattern: /TAB/i })

// Operators
export const Plus = createToken({ name: 'Plus', pattern: /\+/ })
export const Minus = createToken({ name: 'Minus', pattern: /-/ })
export const Multiply = createToken({ name: 'Multiply', pattern: /\*/ })
export const Divide = createToken({ name: 'Divide', pattern: /\// })
export const Power = createToken({ name: 'Power', pattern: /\^/ })

// Comparison operators
export const Equal = createToken({ name: 'Equal', pattern: /=/ })
export const NotEqual = createToken({ name: 'NotEqual', pattern: /<>/ })
export const LessThan = createToken({ name: 'LessThan', pattern: /</ })
export const LessEqual = createToken({ name: 'LessEqual', pattern: /<=/ })
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ })
export const GreaterEqual = createToken({ name: 'GreaterEqual', pattern: />=/ })

// Logical operators
export const And = createToken({ name: 'And', pattern: /AND/i })
export const Or = createToken({ name: 'Or', pattern: /OR/i })
export const Not = createToken({ name: 'Not', pattern: /NOT/i })

// Punctuation
export const LeftParen = createToken({ name: 'LeftParen', pattern: /\(/ })
export const RightParen = createToken({ name: 'RightParen', pattern: /\)/ })
export const Comma = createToken({ name: 'Comma', pattern: /,/ })
export const Semicolon = createToken({ name: 'Semicolon', pattern: /;/ })

// Literals
export const NumberLiteral = createToken({ 
  name: 'NumberLiteral', 
  pattern: /\d*\.?\d+([eE][+-]?\d+)?/ 
})

export const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"([^"\\]|\\.)*"/
})

// Line numbers 
export const LineNumber = createToken({
  name: 'LineNumber',
  pattern: /\d+/
})

// Variables (letter + optional digit + optional $)
export const Variable = createToken({
  name: 'Variable',
  pattern: /[A-Za-z][0-9]?\$?/,
  longer_alt: [Let, Print, Input, For, To, Step, Next, If, Then, Goto, Gosub, Return, Dim, Read, Data, Restore, Rem, End, Stop, And, Or, Not]
})

// Whitespace
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED
})

// Newlines (significant in BASIC)
export const NewLine = createToken({
  name: 'NewLine',
  pattern: /\r?\n/,
  line_breaks: true
})

// Comments (anything after REM - simplified for now)
export const Comment = createToken({
  name: 'Comment',
  pattern: /[^\r\n]+/
})

// Token array for lexer (order matters!)
export const allTokens = [
  // Whitespace first
  WhiteSpace,
  NewLine,
  
  // Line numbers (must be first on line)
  LineNumber,
  
  // Multi-character operators (before single chars)
  NotEqual,
  LessEqual, 
  GreaterEqual,
  
  // Keywords (before variables)
  Let, Print, Input, For, To, Step, Next, If, Then, Goto, Gosub, Return,
  Dim, Read, Data, Restore, Rem, End, Stop,
  And, Or, Not,
  
  // Functions
  Abs, Sqr, Int, Sgn, Sin, Cos, Atn, Exp, Log, Rnd, Tab,
  
  // Operators
  Plus, Minus, Multiply, Divide, Power,
  Equal, LessThan, GreaterThan,
  
  // Punctuation
  LeftParen, RightParen, Comma, Semicolon,
  
  // Literals
  NumberLiteral, StringLiteral,
  
  // Variables (after keywords to avoid conflicts)
  Variable,
  
  // Comments (last, as it consumes rest of line)
  Comment
]

// Create lexer
export const BasicLexer = new Lexer(allTokens)
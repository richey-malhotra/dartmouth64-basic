import { CstParser, IToken } from 'chevrotain'
import {
  allTokens,
  Let, Print, Input, For, To, Step, Next, If, Then, Goto, Gosub, Return,
  Dim, Read, Data, Restore, Rem, End, Stop,
  Plus, Minus, Multiply, Divide, Power,
  Equal, NotEqual, LessThan, LessEqual, GreaterThan, GreaterEqual,
  And, Or, Not,
  LeftParen, RightParen, Comma, Semicolon,
  NumberLiteral, StringLiteral, Variable, LineNumber, NewLine, Comment,
  Abs, Sqr, Int, Sgn, Sin, Cos, Atn, Exp, Log, Rnd, Tab
} from './lexer'

// Dartmouth 64 BASIC Parser using Chevrotain
export class BasicParser extends CstParser {
  constructor() {
    super(allTokens, { recoveryEnabled: true })
    this.performSelfAnalysis()
  }

  // Program is a sequence of lines
  program = this.RULE('program', () => {
    this.MANY(() => {
      this.SUBRULE(this.line)
    })
  })

  // Line: line_number statement [newline]
  line = this.RULE('line', () => {
    this.CONSUME(LineNumber)
    this.SUBRULE(this.statement)
    this.OPTION(() => {
      this.CONSUME(NewLine)
    })
  })

  // Statement alternatives
  statement = this.RULE('statement', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.letStatement) },
      { ALT: () => this.SUBRULE(this.printStatement) },
      { ALT: () => this.SUBRULE(this.inputStatement) },
      { ALT: () => this.SUBRULE(this.forStatement) },
      { ALT: () => this.SUBRULE(this.nextStatement) },
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.gotoStatement) },
      { ALT: () => this.SUBRULE(this.gosubStatement) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.dimStatement) },
      { ALT: () => this.SUBRULE(this.readStatement) },
      { ALT: () => this.SUBRULE(this.dataStatement) },
      { ALT: () => this.SUBRULE(this.remStatement) },
      { ALT: () => this.SUBRULE(this.endStatement) },
      { ALT: () => this.SUBRULE(this.stopStatement) },
    ])
  })

  // LET variable = expression (LET is optional in Dartmouth 64)
  letStatement = this.RULE('letStatement', () => {
    this.OPTION(() => {
      this.CONSUME(Let)
    })
    this.SUBRULE(this.variableRef)
    this.CONSUME(Equal)
    this.SUBRULE(this.expression)
  })

  // PRINT [item[,item...]]
  printStatement = this.RULE('printStatement', () => {
    this.CONSUME(Print)
    this.OPTION(() => {
      this.SUBRULE(this.printItem)
      this.MANY(() => {
        this.OR([
          {
            ALT: () => {
              this.CONSUME(Comma)
              this.OPTION1(() => this.SUBRULE1(this.printItem))
            }
          },
          {
            ALT: () => {
              this.CONSUME(Semicolon)
              this.OPTION2(() => this.SUBRULE2(this.printItem))
            }
          }
        ])
      })
    })
  })

  printItem = this.RULE('printItem', () => {
    this.SUBRULE(this.expression)
  })

  // INPUT variable[,variable...]
  inputStatement = this.RULE('inputStatement', () => {
    this.CONSUME(Input)
    this.SUBRULE(this.variableRef)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE1(this.variableRef)
    })
  })

  // FOR variable = start TO end [STEP step]
  forStatement = this.RULE('forStatement', () => {
    this.CONSUME(For)
    this.CONSUME(Variable)
    this.CONSUME(Equal)
    this.SUBRULE(this.expression, { LABEL: 'start' })
    this.CONSUME(To)
    this.SUBRULE1(this.expression, { LABEL: 'end' })
    this.OPTION(() => {
      this.CONSUME(Step)
      this.SUBRULE2(this.expression, { LABEL: 'step' })
    })
  })

  // NEXT variable
  nextStatement = this.RULE('nextStatement', () => {
    this.CONSUME(Next)
    this.CONSUME(Variable)
  })

  // IF condition THEN (statement | line_number)
  ifStatement = this.RULE('ifStatement', () => {
    this.CONSUME(If)
    this.SUBRULE(this.expression, { LABEL: 'condition' })
    this.CONSUME(Then)
    this.OR([
      { ALT: () => this.SUBRULE(this.statement) },
      { ALT: () => this.CONSUME(NumberLiteral) } // Line number for GOTO
    ])
  })

  // GOTO line_number
  gotoStatement = this.RULE('gotoStatement', () => {
    this.CONSUME(Goto)
    this.CONSUME(NumberLiteral)
  })

  // GOSUB line_number
  gosubStatement = this.RULE('gosubStatement', () => {
    this.CONSUME(Gosub)
    this.CONSUME(NumberLiteral)
  })

  // RETURN
  returnStatement = this.RULE('returnStatement', () => {
    this.CONSUME(Return)
  })

  // DIM array(size)[,array(size)...]
  dimStatement = this.RULE('dimStatement', () => {
    this.CONSUME(Dim)
    this.SUBRULE(this.arrayDecl)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE1(this.arrayDecl)
    })
  })

  arrayDecl = this.RULE('arrayDecl', () => {
    this.CONSUME(Variable)
    this.CONSUME(LeftParen)
    this.SUBRULE(this.expression)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE1(this.expression)
    })
    this.CONSUME(RightParen)
  })

  // READ variable[,variable...]
  readStatement = this.RULE('readStatement', () => {
    this.CONSUME(Read)
    this.SUBRULE(this.variableRef)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE1(this.variableRef)
    })
  })

  // DATA value[,value...]
  dataStatement = this.RULE('dataStatement', () => {
    this.CONSUME(Data)
    this.SUBRULE(this.dataValue)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE1(this.dataValue)
    })
  })

  dataValue = this.RULE('dataValue', () => {
    this.OR([
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) }
    ])
  })

  // REM comment
  remStatement = this.RULE('remStatement', () => {
    this.CONSUME(Rem)
    this.OPTION(() => {
      this.CONSUME(Comment)
    })
  })

  // END
  endStatement = this.RULE('endStatement', () => {
    this.CONSUME(End)
  })

  // STOP
  stopStatement = this.RULE('stopStatement', () => {
    this.CONSUME(Stop)
  })

  // Expression grammar with precedence
  expression = this.RULE('expression', () => {
    this.SUBRULE(this.orExpression)
  })

  orExpression = this.RULE('orExpression', () => {
    this.SUBRULE(this.andExpression)
    this.MANY(() => {
      this.CONSUME(Or)
      this.SUBRULE1(this.andExpression)
    })
  })

  andExpression = this.RULE('andExpression', () => {
    this.SUBRULE(this.relationalExpression)
    this.MANY(() => {
      this.CONSUME(And)
      this.SUBRULE1(this.relationalExpression)
    })
  })

  relationalExpression = this.RULE('relationalExpression', () => {
    this.SUBRULE(this.additiveExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Equal) },
        { ALT: () => this.CONSUME(NotEqual) },
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(LessEqual) },
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(GreaterEqual) }
      ])
      this.SUBRULE1(this.additiveExpression)
    })
  })

  additiveExpression = this.RULE('additiveExpression', () => {
    this.SUBRULE(this.multiplicativeExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) }
      ])
      this.SUBRULE1(this.multiplicativeExpression)
    })
  })

  multiplicativeExpression = this.RULE('multiplicativeExpression', () => {
    this.SUBRULE(this.powerExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Multiply) },
        { ALT: () => this.CONSUME(Divide) }
      ])
      this.SUBRULE1(this.powerExpression)
    })
  })

  powerExpression = this.RULE('powerExpression', () => {
    this.SUBRULE(this.unaryExpression)
    this.MANY(() => {
      this.CONSUME(Power)
      this.SUBRULE1(this.unaryExpression)
    })
  })

  unaryExpression = this.RULE('unaryExpression', () => {
    this.OR([
      {
        ALT: () => {
          this.OR1([
            { ALT: () => this.CONSUME(Minus) },
            { ALT: () => this.CONSUME(Not) }
          ])
          this.SUBRULE(this.unaryExpression)
        }
      },
      { ALT: () => this.SUBRULE(this.primaryExpression) }
    ])
  })

  primaryExpression = this.RULE('primaryExpression', () => {
    this.OR([
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.SUBRULE(this.variableRef) },
      { ALT: () => this.SUBRULE(this.functionCall) },
      {
        ALT: () => {
          this.CONSUME(LeftParen)
          this.SUBRULE(this.expression)
          this.CONSUME(RightParen)
        }
      }
    ])
  })

  // Variable or array reference
  variableRef = this.RULE('variableRef', () => {
    this.CONSUME(Variable)
    this.OPTION(() => {
      this.CONSUME(LeftParen)
      this.SUBRULE(this.expression)
      this.MANY(() => {
        this.CONSUME(Comma)
        this.SUBRULE1(this.expression)
      })
      this.CONSUME(RightParen)
    })
  })

  // Function call
  functionCall = this.RULE('functionCall', () => {
    this.OR([
      { ALT: () => this.CONSUME(Abs) },
      { ALT: () => this.CONSUME(Sqr) },
      { ALT: () => this.CONSUME(Int) },
      { ALT: () => this.CONSUME(Sgn) },
      { ALT: () => this.CONSUME(Sin) },
      { ALT: () => this.CONSUME(Cos) },
      { ALT: () => this.CONSUME(Atn) },
      { ALT: () => this.CONSUME(Exp) },
      { ALT: () => this.CONSUME(Log) },
      { ALT: () => this.CONSUME(Rnd) },
      { ALT: () => this.CONSUME(Tab) }
    ])
    this.CONSUME(LeftParen)
    this.SUBRULE(this.expression)
    this.CONSUME(RightParen)
  })
}

// Parser instance
export const basicParser = new BasicParser()
// Main parser export for Dartmouth 64 BASIC
export { parseBasicProgram } from './visitor'
export { BasicLexer } from './lexer'
export { BasicParser } from './parser'
export * from './ast'

// Convenience function to test parser
export function testParser(code: string) {
  try {
    const ast = parseBasicProgram(code)
    return { success: true, ast, errors: [] }
  } catch (error) {
    return { 
      success: false, 
      ast: null, 
      errors: [error instanceof Error ? error.message : String(error)] 
    }
  }
}
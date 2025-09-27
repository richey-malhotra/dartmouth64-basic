'use client'

import { useEffect, useRef } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface MonacoBasicEditorProps {
  value: string
  onChange: (value: string) => void
  currentLine?: number | null
  onCursorPositionChange?: (position: { line: number; column: number }) => void
  fontSize?: number
}

// Language configuration for BASIC
const basicLanguageConfiguration: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: 'REM',
  },
  brackets: [
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  surroundingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
}

// Dartmouth 64 BASIC Language Definition for Monaco Monarch
const basicLanguageDefinition: monaco.languages.IMonarchLanguage = {
  // Set defaultToken to invalid to see what we do not tokenize yet
  defaultToken: 'invalid',
  
  // Keywords for Dartmouth 64 BASIC
  keywords: [
    'DIM', 'END', 'FOR', 'GOSUB', 'GOTO', 'IF', 'INPUT', 'LET', 
    'NEXT', 'PRINT', 'READ', 'REM', 'RETURN', 'STOP', 'THEN', 'TO', 'STEP'
  ],
  
  // Built-in functions
  functions: [
    'ABS', 'ATN', 'COS', 'EXP', 'INT', 'LOG', 'RND', 'SGN', 'SIN', 'SQR', 'TAB', 'TAN'
  ],
  
  // Operators
  operators: [
    '=', '>', '<', '<=', '>=', '<>', '+', '-', '*', '/', '^', 'AND', 'OR', 'NOT'
  ],

  // The main tokenizer for Dartmouth BASIC
  tokenizer: {
    root: [
      // Line numbers (must start line)
      [/^\d+/, 'line-number'],
      
      // Keywords
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@functions': 'function',
          '@operators': 'operator',
          '@default': 'variable'
        }
      }],
      
      // Variables (single letter + optional digit + optional $)
      [/\b[A-Z][0-9]?\$?\b/, 'variable'],
      
      // Arrays (variable followed by parentheses)
      [/\b[A-Z][0-9]?\s*(?=\()/, 'array'],
      
      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\d+/, 'number'],
      
      // Operators and delimiters
      [/[+\-*/^=<>(),:;]/, 'operator'],
      
      // Strings
      [/"([^"\\]|\\.)*"/, 'string'],
      
      // Comments - REM statement consumes rest of line
      [/\bREM\b.*$/, 'comment'],
      
      // Whitespace
      [/\s+/, 'white'],
    ],
  },
}

// Theme for BASIC syntax highlighting (VS Code Dark)
const basicTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'line-number', foreground: '7f8ea3', fontStyle: 'bold' },
    { token: 'keyword', foreground: '4bc0ff', fontStyle: 'bold' },
    { token: 'function', foreground: 'c95df5', fontStyle: 'bold' },
    { token: 'operator', foreground: '9aa1b5' },
    { token: 'variable', foreground: 'd7f5ff' },
    { token: 'array', foreground: '5be3b8', fontStyle: 'bold' },
    { token: 'number', foreground: 'ffd37d' },
    { token: 'number.float', foreground: 'ffd37d' },
    { token: 'string', foreground: 'ffb4e2' },
    { token: 'comment', foreground: '627094', fontStyle: 'italic' },
  ],
  colors: {
    'editor.background': '#0f1526',
    'editor.foreground': '#dde3f7',
    'editor.lineHighlightBackground': '#16314388',
    'editorLineNumber.foreground': '#4d566c',
    'editorCursor.foreground': '#4bc0ff',
    'editor.selectionBackground': '#1e406355',
    'editor.inactiveSelectionBackground': '#1e2f4635',
    'editor.selectionHighlightBackground': '#305a7f55',
    'editorSuggestWidget.background': '#12192cdd',
    'editorSuggestWidget.border': '#1d2641',
    'editorWidget.background': '#12182aee',
    'editorHoverWidget.background': '#12182add',
    'editorLineNumber.activeForeground': '#9fb8ff',
    'editorIndentGuide.background': '#1b2235',
    'editorIndentGuide.activeBackground': '#28324d',
  },
}

export function MonacoBasicEditor({ value, onChange, currentLine, onCursorPositionChange, fontSize }: MonacoBasicEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const languageId = 'dartmouth-basic'

  // Initialize Monaco with BASIC language
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Register Dartmouth BASIC language
    if (!monaco.languages.getLanguages().find(lang => lang.id === languageId)) {
      monaco.languages.register({ id: languageId })
      
      // Set the Monarch tokenizer with the complete language definition
      monaco.languages.setMonarchTokensProvider(languageId, basicLanguageDefinition)
      
      // Set language configuration
      monaco.languages.setLanguageConfiguration(languageId, basicLanguageConfiguration)
      
      // Define custom theme
      monaco.editor.defineTheme('basic-theme', basicTheme)
      
      // Register completion item provider for BASIC intellisense
      monaco.languages.registerCompletionItemProvider(languageId, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          const suggestions = [
            // Keywords
            ...(basicLanguageDefinition.keywords ?? []).map((keyword: string) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              documentation: `BASIC keyword: ${keyword}`,
              range: range,
            })),
            // Functions
            ...(basicLanguageDefinition.functions ?? []).map((func: string) => ({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `${func}()`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: `BASIC function: ${func}`,
              range: range,
            })),
            // Common BASIC snippets
            {
              label: 'FOR-NEXT',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'FOR ${1:I} = ${2:1} TO ${3:10}\n\t${4:PRINT I}\nNEXT ${1:I}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'FOR-NEXT loop structure',
              range: range,
            },
            {
              label: 'IF-THEN',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'IF ${1:condition} THEN ${2:statement}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'IF-THEN conditional statement',
              range: range,
            }
          ]
          
          return { suggestions }
        }
      })
    }

    // Set editor options for educational experience
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'off', // BASIC has its own line numbers
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 0,
      glyphMargin: false,
      folding: false,
      rulers: [],
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      smoothScrolling: true,
      cursorSmoothCaretAnimation: 'on',
    })

    // Track cursor position changes
    if (onCursorPositionChange) {
      editor.onDidChangeCursorPosition((e) => {
        onCursorPositionChange({
          line: e.position.lineNumber,
          column: e.position.column
        })
      })
    }
  }

  // Highlight current line during execution
  useEffect(() => {
    if (editorRef.current && monacoRef.current && currentLine !== null && currentLine !== undefined) {
      const editor = editorRef.current
      const monaco = monacoRef.current
      
      // Clear previous decorations
      const oldDecorations = editor.getModel()?.getAllDecorations() || []
      const decorationIds = oldDecorations
        .filter(d => d.options.className === 'current-line-execution')
        .map(d => d.id)
      
      // Add new decoration for current line
      editor.deltaDecorations(decorationIds, [
        {
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: 'current-line-execution',
            linesDecorationsClassName: 'current-line-execution-margin',
          },
        },
      ])

      // Smoothly reveal the current line
      editor.revealLineInCenterIfOutsideViewport(currentLine)
    }
  }, [currentLine])

  useEffect(() => {
    if (editorRef.current) {
      const newFontSize = fontSize || 14; // Default to 14 if undefined
      editorRef.current.updateOptions({
        fontSize: newFontSize,
        lineHeight: newFontSize * 1.5,
        padding: {
          top: newFontSize / 2,
          bottom: newFontSize / 2,
        },
      });
    }
  }, [fontSize]);

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={languageId}
        theme="basic-theme"
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          contextmenu: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'matchingDocuments',
          parameterHints: { enabled: true },
          hover: { enabled: true },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true
          }
        }}
      />
      
      {/* CSS for execution highlighting */}
      <style jsx global>{`
        .current-line-execution {
          background: linear-gradient(90deg, rgba(75, 192, 255, 0.12), rgba(201, 93, 245, 0.05)) !important;
          border-left: 3px solid rgba(75, 192, 255, 0.75) !important;
        }
        
        .current-line-execution-margin {
          background: linear-gradient(180deg, rgba(75, 192, 255, 0.85), rgba(201, 93, 245, 0.65)) !important;
          width: 4px !important;
        }
      `}</style>
    </div>
  )
}
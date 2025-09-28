'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { Monaco } from '@monaco-editor/react'
import type * as MonacoModule from 'monaco-editor'

interface MonacoBasicEditorProps {
  value: string
  onChange: (value: string) => void
  currentLine?: number | null
  onCursorPositionChange?: (position: { line: number; column: number }) => void
  fontSize?: number
  stopPoints?: number[]
  onToggleStopPoint?: (line: number) => void
}

const DEFAULT_FONT_SIZE = 17

// Language configuration for BASIC
const basicLanguageConfiguration: MonacoModule.languages.LanguageConfiguration = {
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
const basicLanguageDefinition: MonacoModule.languages.IMonarchLanguage = {
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
const basicTheme: MonacoModule.editor.IStandaloneThemeData = {
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

const MonacoEditor = dynamic(async () => {
  const mod = await import('@monaco-editor/react')
  return mod.default
}, {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0f1526]" />,
})

let completionProviderRegistered = false

export function MonacoBasicEditor({
  value,
  onChange,
  currentLine,
  onCursorPositionChange,
  fontSize,
  stopPoints = [],
  onToggleStopPoint
}: MonacoBasicEditorProps) {
  const editorRef = useRef<MonacoModule.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const stopDecorationsRef = useRef<string[]>([])
  const disposablesRef = useRef<MonacoModule.IDisposable[]>([])
  const toggleStopPointRef = useRef(onToggleStopPoint)
  const languageId = 'dartmouth-basic'

  useEffect(() => {
    toggleStopPointRef.current = onToggleStopPoint
  }, [onToggleStopPoint])

  const registerBasicLanguage = (monacoInstance: Monaco) => {
    if (!monacoInstance.languages.getLanguages().some(lang => lang.id === languageId)) {
      monacoInstance.languages.register({ id: languageId })
    }

    monacoInstance.languages.setMonarchTokensProvider(languageId, basicLanguageDefinition)
    monacoInstance.languages.setLanguageConfiguration(languageId, basicLanguageConfiguration)
    monacoInstance.editor.defineTheme('basic-theme', basicTheme)

    if (!completionProviderRegistered) {
      monacoInstance.languages.registerCompletionItemProvider(languageId, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }
          const suggestions = [
            ...(basicLanguageDefinition.keywords ?? []).map((keyword: string) => ({
              label: keyword,
              kind: monacoInstance.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              documentation: `BASIC keyword: ${keyword}`,
              range,
            })),
            ...(basicLanguageDefinition.functions ?? []).map((func: string) => ({
              label: func,
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: `${func}()` ,
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: `BASIC function: ${func}`,
              range,
            })),
            {
              label: 'FOR-NEXT',
              kind: monacoInstance.languages.CompletionItemKind.Snippet,
              insertText: 'FOR ${1:I} = ${2:1} TO ${3:10}\n\t${4:PRINT I}\nNEXT ${1:I}',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'FOR-NEXT loop structure',
              range,
            },
            {
              label: 'IF-THEN',
              kind: monacoInstance.languages.CompletionItemKind.Snippet,
              insertText: 'IF ${1:condition} THEN ${2:statement}',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'IF-THEN conditional statement',
              range,
            },
          ]

          return { suggestions }
        },
      })

      completionProviderRegistered = true
    }
  }

  const handleBeforeMount = (monacoInstance: Monaco) => {
    registerBasicLanguage(monacoInstance)
  }

  // Initialize Monaco with BASIC language
  const handleEditorDidMount = (editor: MonacoModule.editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monacoInstance

    monacoInstance.editor.setTheme('basic-theme')

    const size = fontSize ?? DEFAULT_FONT_SIZE

    // Set editor options for educational experience
    editor.updateOptions({
      fontSize: size,
      lineHeight: size * 1.5,
      padding: {
        top: size / 2,
        bottom: size / 2,
      },
      lineNumbers: 'off',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineDecorationsWidth: 20,
      glyphMargin: true,
      folding: false,
      rulers: [],
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      smoothScrolling: true,
      cursorSmoothCaretAnimation: 'on',
      cursorStyle: 'block',
      cursorBlinking: 'blink',
    })

    // Track cursor position changes
    if (onCursorPositionChange) {
      const cursorDisposable = editor.onDidChangeCursorPosition((e: MonacoModule.editor.ICursorPositionChangedEvent) => {
        onCursorPositionChange({
          line: e.position.lineNumber,
          column: e.position.column
        })
      })
      disposablesRef.current.push(cursorDisposable)
    }

    const mouseDownDisposable = editor.onMouseDown(event => {
      if (
        event.target.type === monacoInstance.editor.MouseTargetType.GUTTER_GLYPH_MARGIN &&
        event.target.position?.lineNumber
      ) {
        toggleStopPointRef.current?.(event.target.position.lineNumber)
      }
    })
    disposablesRef.current.push(mouseDownDisposable)
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
    if (!editorRef.current || !monacoRef.current) {
      return
    }

    const editor = editorRef.current
    const monaco = monacoRef.current
    const decorations = stopPoints.map(line => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'stop-point-line',
        glyphMarginClassName: 'stop-point-glyph',
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
      },
    }))

    stopDecorationsRef.current = editor.deltaDecorations(stopDecorationsRef.current, decorations)
  }, [stopPoints])

  useEffect(() => {
    if (editorRef.current) {
      const newFontSize = fontSize || DEFAULT_FONT_SIZE
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

  useEffect(() => {
    const editor = editorRef.current
    return () => {
      if (editor && stopDecorationsRef.current.length) {
        editor.deltaDecorations(stopDecorationsRef.current, [])
      }
      disposablesRef.current.forEach(disposable => disposable.dispose())
      disposablesRef.current = []
    }
  }, [])

  return (
    <div className="h-full bg-[#0f1526]">
      <MonacoEditor
        height="100%"
        language={languageId}
        theme="basic-theme"
        value={value}
        onChange={(newValue: string | undefined) => onChange(newValue || '')}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        loading={<div className="h-full w-full bg-[#0f1526]" />}
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

        .stop-point-line {
          background: linear-gradient(90deg, rgba(123, 134, 255, 0.16), rgba(91, 227, 184, 0.06)) !important;
        }

        .stop-point-glyph {
          position: relative;
          width: 11px !important;
          height: 11px !important;
          margin-left: 4px;
          border-radius: 9999px;
          background: radial-gradient(circle at 40% 40%, rgba(124, 132, 255, 0.85), rgba(14, 21, 36, 0.2));
          box-shadow: 0 0 3px rgba(112, 131, 255, 0.55);
        }

        .stop-point-glyph::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          border: 1px solid rgba(124, 132, 255, 0.4);
          opacity: 0.6;
        }

        .monaco-editor .margin {
          background: linear-gradient(180deg, rgba(16, 24, 38, 0.78), rgba(11, 18, 29, 0.86));
          box-shadow: inset -1px 0 0 rgba(91, 105, 148, 0.25);
        }

        .monaco-editor .glyph-margin {
          width: 18px !important;
        }

        .monaco-editor .cursor.block {
          background-color: rgba(236, 252, 255, 0.9) !important;
        }
      `}</style>
    </div>
  )
}
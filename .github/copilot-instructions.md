# RBASIC-D64 AI Coding Instructions

## Project Overview
**RBASIC-D64** is an educational Dartmouth BASIC interpreter designed to help novice programmers build mental models through visual execution. This is a **production SaaS** with authentication, payments, and user persistence - not a toy project.

## Core Architecture & Mission
- **Educational First**: 40% of screen space dedicated to variable/array visualization - this is NOT just a code editor
- **Visual Learning**: Every variable change, array access, and execution step must be visible and educational
- **Phased Development**: Phase 1 focuses ONLY on editor functionality; other pages are intentionally stubbed

## Tech Stack Specifics

### Frontend Foundation
- **Next.js 14 with App Router** - MANDATORY: Use `app/` directory structure, NOT `pages/`
- **TypeScript** - Strict typing required for AST nodes and educational components
- **Tailwind CSS + shadcn/ui** - Design system for consistent UI components
- **Monaco Editor** - Custom Dartmouth 64 BASIC language definition required

### App Router Requirements
- Use `app/` directory for all routes (not `pages/` directory)
- Leverage route groups: `(auth)/` for public pages, `(protected)/` for authenticated pages
- Use `layout.tsx` files for shared layouts
- Server Components by default, Client Components only when needed (Monaco Editor, interactive panels)

### Core Dependencies
- **Chevrotain** - Parser for strict Dartmouth 64 compliance (see AST specs in `/docs/spec.md`)
- **Supabase** - Database, auth, and real-time features
- **Stripe** - Subscription payments integration
- **Lucide React** - Icon system

## Critical Implementation Patterns

### 1. Educational Panel Architecture (40% Width)
```typescript
// Variables & Arrays Panel structure
interface EducationalPanelProps {
  variables: Map<string, Variable>
  arrays: Map<string, ArrayState>
  currentLine: number
  executionState: 'ready' | 'running' | 'paused' | 'error'
}

// Array visualization is THE most important educational feature
interface ArrayState {
  dimensions: number[]
  values: Map<string, any>
  recentlyAccessed: Set<string> // For highlighting
  bounds: [number, number][]
}
```

### 2. Monaco Integration Patterns
- **Smooth Line Highlighting**: Use `revealLineInCenterIfOutsideViewport()` NOT `revealLineInCenter()`
- **Visual Stability**: No jarring scrolls - maintain editor dimensions during execution
- **Custom Language**: Dartmouth 64 BASIC syntax with IntelliSense for educational keywords

### 3. Execution Engine Design
```typescript
// Speed-adaptive execution with educational timing
interface ExecutionEngine {
  speed: number // 100ms-3000ms range
  mode: 'continuous' | 'step' | 'paused'
  highlightDuration: number // Scales with speed
}
```

## VS Code-Style Navigation (Phase 1)
- **48px Fixed Left Bar** with emoji icons: 🎯📁📚⚙️🆘🚪
- **Active Route**: `/editor` (full implementation)
- **Stubbed Routes**: All others show "Coming Soon" with basic functionality
- **Version Display**: "v1.0.0" prominently shown

## Dartmouth 64 BASIC Compliance

### Critical Language Rules
- **1-indexed arrays**: `DIM A(10)` gives indices 1-10, NOT 0-9
- **Line numbers**: Execute by number order, not source order
- **Variable names**: Single letter + optional digit (A, A1, B9) + optional $ for strings
- **Historical accuracy**: Match 1964 Dartmouth implementation exactly

### AST Node Types (Chevrotain Implementation)
Refer to `/docs/spec.md` for complete AST structure - these are required:
```typescript
// Essential nodes for educational visualization
LetNode, PrintNode, InputNode, ForNode, NextNode, DimNode, ArrayRefNode
```

## Visual Stability Requirements
**CRITICAL UX**: Educational effectiveness depends on stable, non-distracting visuals.

### Animation Guidelines
- **Variable changes**: 500ms gentle green flash (NOT aggressive flashing)
- **Array access**: 2px gold border highlight (800ms fade)
- **Speed adaptation**: Highlights scale with execution speed (100ms-3000ms)
- **Smooth transitions**: 300ms CSS transitions for progress bars
- **Respect accessibility**: Honor `prefers-reduced-motion`

### Layout Stability
- Fixed panel dimensions during execution
- Internal scrolling only (never page layout shifts)
- `contain: layout` CSS on dynamic content areas

## File Organization Patterns

### App Router Structure (MANDATORY)
```
app/
├── layout.tsx        # Root layout with navigation
├── page.tsx          # Landing page
├── (auth)/           # Route group for public auth pages
│   ├── login/        
│   │   └── page.tsx  # Login page
│   └── subscribe/    
│       └── page.tsx  # Payment flow
├── (protected)/      # Route group for authenticated pages
│   ├── layout.tsx    # Protected layout with VS Code nav
│   ├── editor/       # 🎯 Phase 1 FULL implementation
│   │   └── page.tsx
│   ├── files/        # 📁 Phase 2 stub
│   │   └── page.tsx
│   ├── examples/     # 📚 Phase 2 stub  
│   │   └── page.tsx
│   ├── settings/     # ⚙️ Phase 2 stub
│   │   └── page.tsx
│   └── support/      # 🆘 Phase 2 stub
│       └── page.tsx
```

### Component Architecture
```
components/
├── editor/
│   ├── MonacoEditor.tsx      # Custom BASIC language
│   ├── ControlPanel.tsx      # RUN/STEP/STOP controls
│   ├── VariablePanel.tsx     # Educational visualization
│   ├── ArrayVisualization.tsx # MOST IMPORTANT component
│   └── ConsolePanel.tsx      # Retro terminal output
├── ui/                       # shadcn/ui components
└── auth/                     # Supabase integration
```

## Development Workflow

### Phase 1 Priorities (ONLY)
1. **Monaco + Custom BASIC Language** - Syntax highlighting, validation
2. **Chevrotain Parser** - Complete AST for Dartmouth 64
3. **Educational Panels** - Variables, arrays, console (40% width)
4. **Execution Engine** - Step-by-step with speed control
5. **Array Visualization** - Grid display with access highlighting

### Testing Strategy
- **Educational Effectiveness**: Can novices understand variable changes?
- **Visual Stability**: No jarring movements during execution
- **Parser Accuracy**: Strict Dartmouth 64 compliance
- **Performance**: Monaco + real-time updates with large programs

## Production Considerations

### Supabase Schema (Future)
```sql
-- Core tables for SaaS functionality
users, programs, subscription_status, user_settings
```

### Performance Patterns
- Debounced Monaco updates during fast execution
- Efficient array visualization for large datasets
- Memory management for long-running programs

## Common Pitfalls to Avoid
1. **Generic Code Editor**: This is an EDUCATIONAL tool - visualization is equally important as editing
2. **Modern BASIC**: Must match 1964 Dartmouth exactly, not modern BASIC variants  
3. **Phase Creep**: Phase 1 is editor ONLY - resist adding file management features
4. **Aggressive Animations**: Subtle educational highlights, not distracting effects
5. **0-based Arrays**: Dartmouth BASIC uses 1-based indexing consistently

## Success Metrics
The implementation succeeds when a novice programmer can:
- Watch variables change during program execution
- Understand array structure through visual grids
- Learn programming concepts through step-by-step visualization
- Progress from simple variables to complex array algorithms

Remember: This is not just a BASIC interpreter - it's an **educational programming environment** where the visualization is as important as the code itself.
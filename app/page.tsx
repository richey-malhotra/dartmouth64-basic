import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            RBASIC-D64
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Educational Dartmouth BASIC Interpreter
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Learn programming fundamentals through visual execution. Watch variables change, 
            arrays grow, and algorithms come to life with our educational BASIC interpreter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/editor">
              <Button size="lg" className="w-full sm:w-auto">
                🎯 Launch Editor
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">👁️</div>
              <h3 className="text-xl font-semibold mb-2">Visual Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                40% of screen space dedicated to variable and array visualization. 
                See every change as your program executes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Historical Accuracy</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experience Dartmouth BASIC exactly as it was in 1964. 
                Learn programming history while building modern skills.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">🎓</div>
              <h3 className="text-xl font-semibent mb-2">Educational First</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Step-by-step execution with speed control. 
                Perfect for understanding algorithms and data structures.
              </p>
            </div>
          </div>

          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            Version 1.0.0 | Phase 1: Editor Focus
          </div>
        </div>
      </div>
    </div>
  )
}
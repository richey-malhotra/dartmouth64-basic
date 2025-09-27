'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Code2, 
  FolderOpen, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus,
  Minus
} from 'lucide-react'

const navigation = [
  { name: 'Editor', href: '/editor', icon: Code2, active: true },
  { name: 'Files', href: '/files', icon: FolderOpen, active: true },
  { name: 'Examples', href: '/examples', icon: BookOpen, active: true },
  { name: 'Settings', href: '/settings', icon: Settings, active: true },
  { name: 'Support', href: '/support', icon: HelpCircle, active: true },
]

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="h-screen flex bg-[#1e1e1e]">
      {/* VS Code-style Activity Bar */}
      <div className="w-14 bg-[#333333] border-r border-[#2d2d30] flex flex-col">
        {/* Navigation Icons */}
        <div className="flex-1 py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isAvailable = item.active || isActive
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`activity-bar-item ${
                  isActive
                    ? 'active'
                    : isAvailable
                    ? 'available'
                    : 'disabled'
                }`}
                title={item.name}
              >
                <Icon size={26} strokeWidth={1.5} />
                {isActive && <div className="activity-bar-indicator" />}
              </Link>
            )
          })}
        </div>

        {/* Font Size Controls */}
        <div className="border-t border-[#2d2d30] py-2">
          <button
            onClick={() => {
              // Target Monaco editor via CSS custom property
              const root = document.documentElement;
              const currentSize = parseInt(getComputedStyle(root).getPropertyValue('--monaco-font-size')) || 14;
              const newSize = Math.min(currentSize + 1, 24);
              root.style.setProperty('--monaco-font-size', newSize + 'px');
              
              // Also directly update Monaco if loaded
              const monacoElements = document.querySelectorAll('.monaco-editor .view-lines');
              monacoElements.forEach(element => {
                (element as HTMLElement).style.fontSize = newSize + 'px';
              });
            }}
            className="activity-bar-item available"
            title="Increase Editor Font Size"
          >
            <Plus size={24} strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              // Target Monaco editor via CSS custom property
              const root = document.documentElement;
              const currentSize = parseInt(getComputedStyle(root).getPropertyValue('--monaco-font-size')) || 14;
              const newSize = Math.max(currentSize - 1, 10);
              root.style.setProperty('--monaco-font-size', newSize + 'px');
              
              // Also directly update Monaco if loaded
              const monacoElements = document.querySelectorAll('.monaco-editor .view-lines');
              monacoElements.forEach(element => {
                (element as HTMLElement).style.fontSize = newSize + 'px';
              });
            }}
            className="activity-bar-item available"
            title="Decrease Editor Font Size"
          >
            <Minus size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Logout Button */}
        <div className="pb-2">
          <Link
            href="/"
            className="activity-bar-item available"
            title="Logout"
          >
            <LogOut size={26} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <div className="h-9 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-4 text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-[#cccccc] font-medium">RBASIC-D64 Editor</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                pathname === '/editor' ? 'bg-[#4ec9b0]' : 'bg-[#969696]'
              }`}></div>
              <span className="text-[#cccccc] font-medium">
                {pathname === '/editor' ? 'READY' : 'INACTIVE'}
              </span>
            </div>
            <span className="text-[#cccccc] font-mono">v1.0.0</span>
            <span className="text-[#cccccc] font-mono">@user</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
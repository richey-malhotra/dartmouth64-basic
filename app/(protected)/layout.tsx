'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
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
  const [fontSize, setFontSize] = useState(16);
  const [status, setStatus] = useState('READY');

  useEffect(() => {
    document.documentElement.style.setProperty('--monaco-font-size', `${fontSize}px`);
  }, [fontSize]);

  const increaseFontSize = () => setFontSize(size => Math.min(size + 1, 24));
  const decreaseFontSize = () => setFontSize(size => Math.max(size - 1, 10));

  return (
    <div className="h-screen flex bg-background">
      {/* VS Code-style Activity Bar */}
      <div className="w-14 bg-card border-r border-border flex flex-col">
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
        {/* Top Header Bar - Removed for a cleaner look, integrated into ControlPanel */}
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {React.cloneElement(children as React.ReactElement, {
            setStatus,
            status,
            version: 'v1.0.0',
            user: 'user',
          })}
        </div>
      </div>
    </div>
  )
}
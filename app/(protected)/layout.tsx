'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  CircleUser,
  Code2,
  Compass,
  FolderOpen,
  HelpCircle,
  LogOut,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Editor', href: '/editor', icon: Code2, active: true },
  { name: 'Files', href: '/files', icon: FolderOpen, active: true },
  { name: 'Examples', href: '/examples', icon: BookOpen, active: true },
  { name: 'Onboarding', href: '/onboarding', icon: Compass, active: true },
  { name: 'Help', href: '/support', icon: HelpCircle, active: true },
  { name: 'Settings', href: '/settings', icon: Settings, active: true },
]

const appVersion = 'v1.0.0'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [status, setStatus] = useState('READY');

  return (
    <div className="h-screen flex bg-background">
      {/* VS Code-style Activity Bar */}
      <div className="relative w-20 bg-card border-r border-border flex flex-col px-3 pt-6 pb-4">
        {/* Navigation Icons */}
        <div className="flex-1 space-y-4">
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
                <Icon size={32} strokeWidth={1.35} />
                {isActive && <div className="activity-bar-indicator" />}
              </Link>
            )
          })}
        </div>

        <div className="absolute left-1/2 bottom-5 -translate-x-1/2 flex h-10 items-center justify-center">
          <span className="uppercase tracking-[0.4em] text-[0.55rem] font-semibold text-muted-foreground/70">
            {appVersion}
          </span>
        </div>

        {/* Logout Button */}
        <div className="space-y-4 pb-16">
          <Link
            href="/profile"
            className="activity-bar-item available"
            title="Profile"
          >
            <CircleUser size={32} strokeWidth={1.35} />
          </Link>
          <Link
            href="/"
            className="activity-bar-item available"
            title="Logout"
          >
            <LogOut size={32} strokeWidth={1.35} />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(45,186,142,0.12),transparent_55%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_55%)]" />

        <header className="relative z-10 px-6 lg:px-10 py-3 flex flex-col items-start gap-2 border-b border-white/5 bg-gradient-to-r from-[#0b1223]/92 via-[#10182d]/87 to-[#11192f]/68 shadow-[0_18px_48px_-32px_rgba(15,23,42,0.78)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-[1.9rem] lg:text-[2.1rem] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#22d3ee] to-[#f472b6] drop-shadow-[0_8px_18px_rgba(96,165,250,0.32)]">
              RBASIC-D64
            </h1>
            <p className="max-w-lg text-sm leading-snug text-white/72">
              Visual Dartmouth BASIC, crafted for curious minds. Learn programming logic by watching every step come alive.
            </p>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
          {React.cloneElement(children as React.ReactElement, {
            setStatus,
            status,
            user: 'user',
          })}
        </div>
      </div>
    </div>
  )
}
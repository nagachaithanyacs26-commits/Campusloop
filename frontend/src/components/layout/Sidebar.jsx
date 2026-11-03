
import { NavLink } from 'react-router-dom'

import {
  LayoutDashboard,
  MessageCircle,
  Repeat2,
  BookOpen,
  CalendarDays,
  Search,
  Users,
  Settings,
  GraduationCap,
  X,
  Handshake,
  ClipboardList,
  Bot,
} from 'lucide-react'

const navigation = [
  {
    title: 'OVERVIEW',
    items: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'Campus Feed',
        path: '/feed',
        icon: MessageCircle,
      },
      {
        name: 'AI Chatbot',
        path: '/ai-chatbot',
        icon: Bot,
      },
    ],
  },
  {
    title: 'CAMPUS SERVICES',
    items: [
      {
        name: 'Resource Exchange',
        path: '/resources',
        icon: Repeat2,
      },
      {
        name: 'My Requests',
        path: '/my-requests',
        icon: ClipboardList,
      },
      {
        name: 'Academic Resources',
        path: '/academics',
        icon: BookOpen,
      },
      {
        name: 'Bookings',
        path: '/bookings',
        icon: CalendarDays,
      },
      {
        name: 'Lost & Found',
        path: '/lost-found',
        icon: Search,
      },
      {
        name: 'Study Groups',
        path: '/study-groups',
        icon: GraduationCap,
      },
    ],
  },
  {
    title: 'COMMUNITY',
    items: [
      {
        name: 'Events',
        path: '/events',
        icon: Users,
      },
      {
        name: 'Messages',
        path: '/messages',
        icon: MessageCircle,
      },
    ],
  },
]

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Campus<span className="text-indigo-400">Loop</span>
              </h1>

              <p className="text-[11px] text-slate-400">
                Your campus, connected
              </p>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.title} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-500">
                {group.title}
              </p>

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/30'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={19} strokeWidth={1.8} />
                      <span>{item.name}</span>
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-sm font-bold text-indigo-300">
              ST
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                Student User
              </p>

              <p className="truncate text-xs text-slate-400">
                Campus Member
              </p>
            </div>
          </div>

          {/* Settings */}
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Settings size={18} />
            Settings
          </NavLink>

          {/* Footer */}
          <div className="mt-4 flex items-center gap-2 px-3 text-xs text-slate-500">
            <Handshake size={15} />
            <span>Built for campus communities</span>
          </div>
        </div>
      </aside>
    </>
  )
}

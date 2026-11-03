
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import Header from './Header'
import FloatingAssistant from './FloatingAssistant'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-[260px]">
        <Header
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Floating assistant appears across all layout pages */}
      <FloatingAssistant />
    </div>
  )
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import './index.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = ReactDOM.createRoot(document.getElementById('root'))

if (!clerkPublishableKey) {
  root.render(
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <section className="max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">CampusLoop setup</p>
        <h1 className="mt-3 text-3xl font-bold">Add your Clerk key to continue</h1>
        <p className="mt-4 leading-7 text-slate-300">The development server is running. Copy <code className="rounded bg-white/10 px-1.5 py-1">frontend/.env.example</code> to <code className="rounded bg-white/10 px-1.5 py-1">frontend/.env</code>, add your Clerk publishable key, then restart <code className="rounded bg-white/10 px-1.5 py-1">npm run dev</code>.</p>
        <p className="mt-3 text-sm text-slate-400">Backend and sign-in features also require the private values listed in <code>backend/.env.example</code>.</p>
      </section>
    </div>,
  )
} else {
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <BrowserRouter>
        <ProfileProvider>
          <App />
          <Toaster position="top-right" />
        </ProfileProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
)
}

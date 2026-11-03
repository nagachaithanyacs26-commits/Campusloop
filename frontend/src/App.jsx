import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

import MainLayout from './components/layout/MainLayout'

// Authentication pages
import Login from './pages/Login'
import Register from './pages/Register'

// Main pages
import Dashboard from './pages/Dashboard'
import ResourceExchange from './pages/ResourceExchange'
import CampusFeed from './pages/CampusFeed'
import Events from './pages/Events'
import StudyGroups from './pages/StudyGroups'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import AIChatbot from './pages/AIChatbot'
import AcademicResources from './pages/AcademicResources'
import MyRequests from './pages/MyRequests'
import Bookings from './pages/Bookings'
import LostAndFound from './pages/LostAndFound'
import Settings from './pages/Settings'

// Protected route
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-500">
            Loading CampusLoop...
          </p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Placeholder page
function PlaceholderPage({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
        CampusLoop
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-slate-500">
        {description}
      </p>

      <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-800">
        This section is under development. More features will be added soon.
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>

      {/* Public authentication routes */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected CampusLoop application */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Campus services */}
        <Route
          path="resources"
          element={<ResourceExchange />}
        />
        <Route path="/my-requests" element={<MyRequests />} />

        <Route
  path="/academics"
  element={<AcademicResources />}
/>

        <Route path="bookings" element={<Bookings />} />

        <Route path="lost-found" element={<LostAndFound />} />

        {/* Community */}
        <Route path="feed" element={<CampusFeed />} />

        <Route path="events" element={<Events />} />

        <Route path="study-groups" element={<StudyGroups />} />

        <Route path="messages" element={<Messages />} />

        {/* AI Chatbot */}
        <Route path="ai-chatbot" element={<AIChatbot />} />

        {/* Profile */}
        <Route path="profile" element={<Profile />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App

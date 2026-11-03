import { useEffect, useState } from 'react'

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock,
  FileText,
  Heart,
  Package,
  Users,
  MapPin,
  Sparkles,
  Search,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  getResources,
  getAcademicResources,
  getEvents,
} from '../services/api'

const quickActions = [
  {
    title: 'Share a resource',
    description: 'Help another student',
    icon: Package,
    path: '/resources',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Upload study notes',
    description: 'Share your knowledge',
    icon: FileText,
    path: '/academics',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Explore events',
    description: 'Find your next opportunity',
    icon: CalendarDays,
    path: '/events',
    color: 'bg-amber-50 text-amber-600',
  },
]

function SectionHeading({ title, description, action, to }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          to={to}
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          {action}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}

function StatCard({ stat }) {
  const Icon = stat.icon

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {stat.title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stat.value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${stat.color}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        {stat.description}
      </p>
    </div>
  )
}

function ResourceCard({ resource }) {
  const icons = {
    Cpu: Package,
    BookOpen,
    Calculator: Package,
    FileText,
  }

  const Icon = icons[resource.icon] || Package

  const initials =
    resource.initials ||
    resource.owner
      ?.split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'ST'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`rounded-xl p-3 ${
            resource.color || 'bg-indigo-100 text-indigo-600'
          }`}
        >
          <Icon size={25} />
        </div>

        <button
          type="button"
          aria-label={`Save ${resource.title}`}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <Heart size={19} />
        </button>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
            {resource.category}
          </span>

          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            {resource.status || 'Available'}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900">
          {resource.title}
        </h3>

        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
          {resource.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-700">
              {resource.owner || 'Student'}
            </p>

            <p className="truncate text-[11px] text-slate-400">
              {resource.department || 'CampusLoop'}
            </p>
          </div>
        </div>

        <Link
          to="/resources"
          className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          View
        </Link>
      </div>
    </article>
  )
}

function EventCard({ event }) {
  const dateParts = (event.date || '').split(' ')

  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
      <div className="flex h-[66px] w-[66px] shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
        <span className="text-xs font-bold">
          {dateParts[0]}
        </span>

        <span className="text-xl font-bold">
          {dateParts[1]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={`inline-block rounded-md px-2 py-1 text-[10px] font-bold ${
            event.color || 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {event.category}
        </span>

        <h3 className="mt-2 font-semibold text-slate-800">
          {event.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {event.time}
          </span>

          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {event.location}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [resources, setResources] = useState([])
  const [academicResources, setAcademicResources] = useState([])
  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const [resourceResponse, academicResponse, eventResponse] =
          await Promise.all([
            getResources(),
            getAcademicResources(),
            getEvents(),
          ])

        setResources(resourceResponse.resources || [])
        setAcademicResources(academicResponse.resources || [])
        setEvents(eventResponse.events || [])
      } catch (err) {
        console.error('Dashboard loading error:', err)

        setError(
          err.response?.data?.message ||
          'Unable to load dashboard data. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const availableResources = resources.filter(
    (resource) => resource.status === 'Available'
  ).length

  const stats = [
    {
      title: 'Available Resources',
      value: loading ? '...' : availableResources,
      description: 'Currently available for students',
      icon: Package,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Active Connections',
      value: '—',
      description: 'Connection feature coming soon',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Academic Materials',
      value: loading ? '...' : academicResources.length,
      description: 'Materials shared by students',
      icon: BookOpen,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Upcoming Events',
      value: loading ? '...' : events.filter((event) => event.date >= new Date().toISOString().slice(0, 10)).length,
      description: 'Upcoming campus events',
      icon: CalendarDays,
      color: 'bg-rose-50 text-rose-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" />

        <div className="pointer-events-none absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-50">
            <Sparkles size={14} />
            Your campus community at a glance
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your campus, <br className="sm:hidden" />
            your community.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Discover useful resources, share knowledge, connect
            with fellow students, and make the most of campus life.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              <Search size={17} />
              Explore Resources
            </Link>

            <Link
              to="/feed"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Campus Feed
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <SectionHeading
          title="Campus at a glance"
          description="A snapshot of your campus community."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <SectionHeading
          title="Quick actions"
          description="What would you like to do today?"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className={`rounded-xl p-3 ${action.color}`}>
                  <Icon size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {action.description}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Resources and events */}
      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionHeading
            title="Recently shared resources"
            description="Useful items and materials shared by students."
            action="View all"
            to="/resources"
          />

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading resources...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              {error}
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <Package
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-semibold text-slate-700">
                No resources shared yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Be the first student to share a resource.
              </p>

              <Link
                to="/resources"
                className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Share a resource
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {resources.slice(0, 4).map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <SectionHeading
            title="Upcoming events"
            description="Discover what's happening on campus."
            action="View all"
            to="/events"
          />

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
            {events.filter((event) => event.date >= new Date().toISOString().slice(0, 10)).slice(0, 3).map((event) => (
              <EventCard
                key={event._id || event.id}
                event={{ ...event, date: new Date(`${event.date}T12:00:00`).toLocaleDateString('en-IN', { month: 'short', day: '2-digit' }).toUpperCase(), color: 'bg-indigo-50 text-indigo-700' }}
              />
            ))}

            {events.filter((event) => event.date >= new Date().toISOString().slice(0, 10)).length === 0 && <p className="p-5 text-center text-sm text-slate-500">No upcoming events. Check back soon.</p>}

            <Link
              to="/events"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Explore all events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center">
        <p>© 2026 CampusLoop. Connecting campus communities.</p>
        <p>Built for students, powered by collaboration.</p>
      </footer>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/react'
import {
  Search,
  SlidersHorizontal,
  Package,
  BookOpen,
  Cpu,
  Calculator,
  FileText,
  Plus,
  MapPin,
  X,
  Heart,
} from 'lucide-react'

import {
  getResources,
  createResource,
  createResourceRequest,
} from '../services/api'

import toast from 'react-hot-toast'

const categories = [
  'All',
  'Electronics',
  'Books',
  'Stationery',
  'Study Materials',
]

const resourceIcons = {
  Cpu,
  BookOpen,
  Calculator,
  FileText,
  Package,
}

export default function ResourceExchange() {
  const { getToken, isSignedIn } = useAuth()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [type, setType] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [resources, setResources] = useState([])
  const [savedResources, setSavedResources] = useState([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requestingId, setRequestingId] = useState(null)

  // Load resources from MongoDB
  useEffect(() => {
    let isMounted = true

    async function loadResources() {
      try {
        setLoading(true)

        const response = await getResources()

        if (isMounted && response.success) {
          setResources(response.resources || [])
        }
      } catch (error) {
        console.error('Error loading resources:', error)

        if (isMounted) {
          toast.error(
            error.response?.data?.message ||
              'Unable to load resources.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadResources()

    return () => {
      isMounted = false
    }
  }, [])

  // Search and filter resources
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const searchText = [
        resource.title,
        resource.description,
        resource.owner,
        resource.category,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchText.includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' || resource.category === category

      const matchesType =
        type === 'All' || resource.type === type

      return matchesSearch && matchesCategory && matchesType
    })
  }, [resources, search, category, type])

  // Add resource to MongoDB
  async function handleAddResource(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const title = formData.get('title')?.toString().trim()
    const description = formData.get('description')?.toString().trim()
    const selectedCategory = formData.get('category')?.toString()
    const selectedType = formData.get('type')?.toString()

    if (!title || !description) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (!isSignedIn) {
      toast.error('Please sign in to share a resource.')
      return
    }

    try {
      setSubmitting(true)

      const token = await getToken()

      if (!token) {
        toast.error('Please sign in again.')
        return
      }

      const response = await createResource(
        {
          title,
          description,
          category: selectedCategory,
          type: selectedType,
        },
        token,
      )

      if (response.success) {
        setResources((current) => [
          response.resource,
          ...current,
        ])

        setCategory('All')
        setType('All')
        setSearch('')
        setShowForm(false)

        form.reset()

        toast.success('Resource added successfully!')
      }
    } catch (error) {
      console.error('Error adding resource:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to add resource.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Send resource request to MongoDB
  async function handleRequestResource(resource) {
    const resourceId = resource._id

    if (!isSignedIn) {
      toast.error('Please sign in to request a resource.')
      return
    }

    if (!resourceId) {
      toast.error('Invalid resource.')
      return
    }

    try {
      setRequestingId(resourceId)

      const token = await getToken()

      if (!token) {
        toast.error('Please sign in again.')
        return
      }

      const response = await createResourceRequest(
        {
          resourceId,
          message: '',
        },
        token,
      )

      if (response.success) {
        toast.success('Resource request sent successfully!')
      }
    } catch (error) {
      console.error('Error requesting resource:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to send resource request.',
      )
    } finally {
      setRequestingId(null)
    }
  }

  // Save and unsave resources
  function toggleSaved(resourceId) {
    const isSaved = savedResources.includes(resourceId)

    setSavedResources((current) =>
      isSaved
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId],
    )

    toast.success(
      isSaved
        ? 'Removed from saved resources'
        : 'Resource saved!',
    )
  }

  function clearFilters() {
    setSearch('')
    setCategory('All')
    setType('All')
  }

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Campus resource sharing
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Resource Exchange
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Borrow, share, and discover useful resources from fellow students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Share a resource
        </button>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total resources</p>
            <Package size={20} className="text-indigo-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resources.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Available now</p>
            <BookOpen size={20} className="text-emerald-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {resources.filter(
              (item) => item.status === 'Available',
            ).length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Saved resources</p>
            <Heart size={20} className="text-rose-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-rose-500">
            {savedResources.length}
          </p>
        </div>

      </section>

      {/* Search and filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources, owners, or keywords..."
              aria-label="Search resources"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={18}
              className="text-slate-500"
            />

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              aria-label="Filter by sharing type"
              className="min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All types</option>
              <option value="Borrow">Borrow</option>
              <option value="Share">Share</option>
            </select>
          </div>

        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

      </section>

      {/* Resource list */}
      <section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Discover resources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Find items and study materials shared by your campus community.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
            {filteredResources.length} found
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading resources...
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Package size={38} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No resources found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term or change the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {filteredResources.map((resource) => {
              const Icon = resourceIcons[resource.icon] || Package
              const resourceId = resource._id
              const isSaved = savedResources.includes(resourceId)
              const isRequesting = requestingId === resourceId

              return (
                <article
                  key={resourceId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div
                      className={`rounded-xl p-3 ${
                        resource.color ||
                        'bg-indigo-100 text-indigo-600'
                      }`}
                    >
                      <Icon size={25} />
                    </div>

                    <div className="flex items-center gap-2">

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {resource.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleSaved(resourceId)}
                        aria-label={
                          isSaved
                            ? `Unsave ${resource.title}`
                            : `Save ${resource.title}`
                        }
                        className={`rounded-lg p-2 transition ${
                          isSaved
                            ? 'bg-rose-50 text-rose-500'
                            : 'text-slate-400 hover:bg-rose-50 hover:text-rose-500'
                        }`}
                      >
                        <Heart
                          size={19}
                          fill={isSaved ? 'currentColor' : 'none'}
                        />
                      </button>

                    </div>
                  </div>

                  <div className="mt-4">

                    <div className="mb-2 flex flex-wrap items-center gap-2">

                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {resource.category}
                      </span>

                      <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                        {resource.type}
                      </span>

                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {resource.title}
                    </h3>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                      {resource.description}
                    </p>

                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

                    <div className="flex min-w-0 items-center gap-2">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {resource.initials || 'ST'}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-800">
                          {resource.owner}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {resource.department}
                        </p>

                      </div>
                    </div>

                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={13} />

                    <span>
                      {resource.dueInfo || 'Check availability'}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={
                      isRequesting ||
                      resource.status !== 'Available'
                    }
                    onClick={() => handleRequestResource(resource)}
                    className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRequesting
                      ? 'Sending request...'
                      : resource.status !== 'Available'
                        ? 'Unavailable'
                        : 'Request resource'}
                  </button>

                </article>
              )
            })}

          </div>
        )}

      </section>

      {/* Add resource modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-form-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >

            <div className="mb-5 flex items-center justify-between gap-3">

              <div>
                <h2
                  id="resource-form-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Share a resource
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add an item for other students to discover.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleAddResource} className="space-y-4">

              <div>
                <label
                  htmlFor="resource-title"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Resource title *
                </label>

                <input
                  id="resource-title"
                  name="title"
                  required
                  maxLength={100}
                  placeholder="e.g. Engineering Mathematics textbook"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="resource-description"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Description *
                </label>

                <textarea
                  id="resource-description"
                  name="description"
                  required
                  maxLength={500}
                  rows={3}
                  placeholder="Describe the resource..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="resource-category"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="resource-category"
                    name="category"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    {categories
                      .filter((item) => item !== 'All')
                      .map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="resource-type"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Sharing type
                  </label>

                  <select
                    id="resource-type"
                    name="type"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    <option value="Borrow">Borrow</option>
                    <option value="Share">Share</option>
                  </select>
                </div>

              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Adding...' : 'Add resource'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
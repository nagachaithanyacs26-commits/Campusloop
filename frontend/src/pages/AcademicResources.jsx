
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/react'
import {
  Search,
  BookOpen,
  FileText,
  ClipboardList,
  Presentation,
  GraduationCap,
  Plus,
  X,
  Download,
  Trash2,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getAcademicResources,
  createAcademicResource,
  deleteAcademicResource,
  downloadAcademicResource,
} from '../services/api'

const categories = [
  'All',
  'Notes',
  'Previous Papers',
  'Assignments',
  'Books',
  'Presentations',
  'Study Guides',
  'Other',
]

const categoryIcons = {
  Notes: FileText,
  'Previous Papers': ClipboardList,
  Assignments: ClipboardList,
  Books: BookOpen,
  Presentations: Presentation,
  'Study Guides': GraduationCap,
  Other: BookOpen,
}

const categoryColors = {
  Notes: 'bg-blue-50 text-blue-600',
  'Previous Papers': 'bg-purple-50 text-purple-600',
  Assignments: 'bg-amber-50 text-amber-600',
  Books: 'bg-emerald-50 text-emerald-600',
  Presentations: 'bg-pink-50 text-pink-600',
  'Study Guides': 'bg-indigo-50 text-indigo-600',
  Other: 'bg-slate-100 text-slate-600',
}

export default function AcademicResources() {
  const { getToken, isSignedIn, userId } = useAuth()

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subject, setSubject] = useState('All')
  const [semester, setSemester] = useState('All')

  // Load academic resources
  async function loadResources() {
    try {
      setLoading(true)

      const filters = {}

      if (category !== 'All') filters.category = category
      if (subject !== 'All') filters.subject = subject
      if (semester !== 'All') filters.semester = semester
      if (search.trim()) filters.search = search.trim()

      const response = await getAcademicResources(filters)

      if (response.success) {
        setResources(response.resources || [])
      }
    } catch (error) {
      console.error('Error loading academic resources:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to load academic resources.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [category, subject, semester, search])

  // Subject filter options
  const subjects = useMemo(() => {
    const uniqueSubjects = [
      ...new Set(
        resources
          .map((resource) => resource.subject)
          .filter(Boolean),
      ),
    ]

    return uniqueSubjects.sort()
  }, [resources])

  // Add academic resource
  async function handleAddResource(event) {
    event.preventDefault()

    if (!isSignedIn) {
      toast.error('Please sign in to upload a resource.')
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    const resourceData = {
      title: formData.get('title')?.toString().trim(),
      description: formData.get('description')?.toString().trim(),
      category: formData.get('category')?.toString(),
      subject: formData.get('subject')?.toString().trim(),
      department: formData.get('department')?.toString().trim(),
      semester: formData.get('semester')?.toString().trim(),
      resourceUrl: formData.get('resourceUrl')?.toString().trim(),
      fileName: formData.get('fileName')?.toString().trim(),
    }

    if (
      !resourceData.title ||
      !resourceData.category ||
      !resourceData.subject ||
      !resourceData.resourceUrl
    ) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)

      const token = await getToken()

      if (!token) {
        toast.error('Please sign in again.')
        return
      }

      const response = await createAcademicResource(
        resourceData,
        token,
      )

      if (response.success) {
        toast.success('Academic resource added successfully!')
        setShowForm(false)
        form.reset()
        await loadResources()
      }
    } catch (error) {
      console.error('Error adding academic resource:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to add academic resource.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Delete resource
  async function handleDeleteResource(resource) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.title}"?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(resource._id)

      const token = await getToken()

      if (!token) {
        toast.error('Please sign in again.')
        return
      }

      const response = await deleteAcademicResource(
        resource._id,
        token,
      )

      if (response.success) {
        setResources((current) =>
          current.filter((item) => item._id !== resource._id),
        )

        toast.success('Resource deleted successfully.')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to delete resource.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  // Download resource
  async function handleDownload(resource) {
    try {
      setDownloadingId(resource._id)

      const response = await downloadAcademicResource(resource._id)

      if (response.success && response.resourceUrl) {
        setResources((current) =>
          current.map((item) =>
            item._id === resource._id
              ? {
                  ...item,
                  downloads: response.downloads,
                }
              : item,
          ),
        )

        window.open(
          response.resourceUrl,
          '_blank',
          'noopener,noreferrer',
        )
      }
    } catch (error) {
      console.error('Error downloading resource:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to open resource.',
      )
    } finally {
      setDownloadingId(null)
    }
  }

  function clearFilters() {
    setSearch('')
    setCategory('All')
    setSubject('All')
    setSemester('All')
  }

  const totalDownloads = resources.reduce(
    (total, resource) => total + (resource.downloads || 0),
    0,
  )

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Learn. Share. Grow.
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Academic Resources
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Discover notes, previous papers, assignments, and study materials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Resource
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total resources
            </p>
            <BookOpen size={21} className="text-indigo-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resources.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Study categories
            </p>
            <GraduationCap size={21} className="text-purple-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {new Set(resources.map((item) => item.category)).size}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total downloads
            </p>
            <Download size={21} className="text-emerald-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {totalDownloads}
          </p>
        </div>

      </section>

      {/* Search and filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-600" />

          <h2 className="font-semibold text-slate-800">
            Find study materials
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

          <div className="relative xl:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources..."
              aria-label="Search academic resources"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? 'All categories' : item}
              </option>
            ))}
          </select>

          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            aria-label="Filter by subject"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
          >
            <option value="All">All subjects</option>

            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
            aria-label="Filter by semester"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
          >
            <option value="All">All semesters</option>

            {Array.from({ length: 8 }, (_, index) => (
              <option key={index + 1} value={`Semester ${index + 1}`}>
                Semester {index + 1}
              </option>
            ))}
          </select>

        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Clear filters
          </button>
        </div>

      </section>

      {/* Resource cards */}
      <section>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Explore resources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Resources shared by your campus community.
            </p>
          </div>

          <button
            type="button"
            onClick={loadResources}
            disabled={loading}
            aria-label="Refresh resources"
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading academic resources...
            </p>
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <BookOpen size={40} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No academic resources found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first study resource or change your filters.
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

            {resources.map((resource) => {
              const Icon =
                categoryIcons[resource.category] || BookOpen

              const color =
                categoryColors[resource.category] ||
                categoryColors.Other

              const isOwner =
                resource.uploaderClerkId === userId

              return (
                <article
                  key={resource._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className={`rounded-xl p-3 ${color}`}>
                      <Icon size={25} />
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {resource.category}
                    </span>

                  </div>

                  <div className="mt-4">

                    <h3 className="text-lg font-bold text-slate-900">
                      {resource.title}
                    </h3>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                      {resource.description ||
                        'No description provided.'}
                    </p>

                  </div>

                  <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">

                    <div className="flex justify-between gap-2 text-sm">
                      <span className="text-slate-500">
                        Subject
                      </span>

                      <span className="text-right font-semibold text-slate-800">
                        {resource.subject}
                      </span>
                    </div>

                    <div className="flex justify-between gap-2 text-sm">
                      <span className="text-slate-500">
                        Department
                      </span>

                      <span className="text-right font-semibold text-slate-800">
                        {resource.department || 'Not specified'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-2 text-sm">
                      <span className="text-slate-500">
                        Semester
                      </span>

                      <span className="text-right font-semibold text-slate-800">
                        {resource.semester || 'Not specified'}
                      </span>
                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {resource.uploaderName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {resource.downloads || 0} downloads
                      </p>
                    </div>

                    {isOwner && (
                      <button
                        type="button"
                        disabled={deletingId === resource._id}
                        onClick={() => handleDeleteResource(resource)}
                        aria-label={`Delete ${resource.title}`}
                        className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}

                  </div>

                  <button
                    type="button"
                    disabled={downloadingId === resource._id}
                    onClick={() => handleDownload(resource)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download size={17} />

                    {downloadingId === resource._id
                      ? 'Opening...'
                      : 'View / Download'}
                  </button>

                </article>
              )
            })}

          </div>
        )}

      </section>

      {/* Add Resource Modal */}
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
            aria-labelledby="academic-resource-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
          >

            <div className="mb-5 flex items-center justify-between gap-3">

              <div>
                <h2
                  id="academic-resource-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Add Academic Resource
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Share useful study materials with your campus.
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

            <form
              onSubmit={handleAddResource}
              className="space-y-4"
            >

              <div>
                <label
                  htmlFor="academic-title"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Resource title *
                </label>

                <input
                  id="academic-title"
                  name="title"
                  required
                  maxLength={150}
                  placeholder="e.g. Data Structures Complete Notes"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="academic-description"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="academic-description"
                  name="description"
                  rows={3}
                  maxLength={1000}
                  placeholder="Describe the study material..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="academic-category"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Category *
                  </label>

                  <select
                    id="academic-category"
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
                    htmlFor="academic-subject"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Subject *
                  </label>

                  <input
                    id="academic-subject"
                    name="subject"
                    required
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="academic-department"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Department
                  </label>

                  <input
                    id="academic-department"
                    name="department"
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="academic-semester"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Semester
                  </label>

                  <select
                    id="academic-semester"
                    name="semester"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    <option value="">Select semester</option>

                    {Array.from({ length: 8 }, (_, index) => (
                      <option
                        key={index + 1}
                        value={`Semester ${index + 1}`}
                      >
                        Semester {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label
                  htmlFor="academic-file"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  File name
                </label>

                <input
                  id="academic-file"
                  name="fileName"
                  placeholder="e.g. Data-Structures-Notes.pdf"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="academic-url"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Resource URL *
                </label>

                <input
                  id="academic-url"
                  name="resourceUrl"
                  type="url"
                  required
                  placeholder="https://example.com/your-study-material.pdf"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Paste a shareable link to your PDF or study material.
                </p>
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
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? 'Adding resource...'
                    : 'Publish Resource'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

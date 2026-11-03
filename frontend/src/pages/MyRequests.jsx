
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getMyResourceRequests,
  updateResourceRequestStatus,
} from '../services/api'

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
}

export default function MyRequests() {
  const { getToken } = useAuth()

  const [activeTab, setActiveTab] = useState('received')
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true)

      const token = await getToken()

      if (!token) {
        toast.error('Please sign in again.')
        return
      }

      const response = await getMyResourceRequests(token)

      if (response.success) {
        setSentRequests(response.sentRequests || [])
        setReceivedRequests(response.receivedRequests || [])
      }
    } catch (error) {
      console.error('Error loading requests:', error)
      toast.error(
        error.response?.data?.message || 'Unable to load requests.',
      )
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  async function handleStatusUpdate(requestId, status) {
    try {
      setUpdatingId(requestId)

      const token = await getToken()

      if (!token) {
        toast.error('Please sign in again.')
        return
      }

      const response = await updateResourceRequestStatus(
        requestId,
        status,
        token,
      )

      if (response.success) {
        toast.success(`Request ${status.toLowerCase()} successfully.`)
        await loadRequests()
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error(
        error.response?.data?.message || 'Unable to update request.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const requests =
    activeTab === 'received' ? receivedRequests : sentRequests

  function RequestCard({ request, received }) {
    const resource = request.resourceId
    const isUpdating = updatingId === request._id

    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={23} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                {resource?.title || 'Resource no longer available'}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {resource?.category || 'Resource'}
                {resource?.type ? ` · ${resource.type}` : ''}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {received
                  ? `Requested by ${request.requesterName || 'Student'}`
                  : 'Your request to the resource owner'}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusStyles[request.status] || statusStyles.Pending
            }`}
          >
            {request.status === 'Approved' ? (
              <CheckCircle size={14} />
            ) : request.status === 'Rejected' ? (
              <XCircle size={14} />
            ) : (
              <Clock size={14} />
            )}
            {request.status}
          </span>
        </div>

        {request.message && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">
              Message
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {request.message}
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            {request.createdAt
              ? `Requested on ${new Date(request.createdAt).toLocaleDateString()}`
              : 'Request date unavailable'}
          </p>

          {received && request.status === 'Pending' && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                className="flex-1 rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 sm:flex-none"
              >
                Reject
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(request._id, 'Approved')}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:flex-none"
              >
                {isUpdating ? 'Updating...' : 'Approve'}
              </button>
            </div>
          )}
        </div>
      </article>
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Resource Exchange
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            My Requests
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your requests and manage requests for your resources.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Received requests</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {receivedRequests.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Sent requests</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {sentRequests.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending received</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {receivedRequests.filter(
              (request) => request.status === 'Pending',
            ).length}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              activeTab === 'received'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownLeft size={17} />
            Received ({receivedRequests.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              activeTab === 'sent'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight size={17} />
            Sent ({sentRequests.length})
          </button>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Package size={38} className="mx-auto text-slate-300" />

          <h3 className="mt-4 font-semibold text-slate-800">
            No {activeTab} requests yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {activeTab === 'received'
              ? 'Requests from other students will appear here.'
              : 'Resources you request from other students will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              received={activeTab === 'received'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

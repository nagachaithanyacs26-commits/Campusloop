import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/react';
import { getEvents, createEvent, toggleEventRegistration } from '../services/api';
import {
  Search,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Plus,
  X,
  Ticket,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialEvents = [
  {
    id: 1,
    title: 'Campus Hackathon 2026',
    category: 'Technology',
    date: '2026-11-15',
    time: '09:00',
    location: 'Innovation Lab',
    description:
      'Build innovative solutions, collaborate with talented students, and turn your ideas into working projects.',
    organizer: 'Computer Science Club',
    attendees: 45,
    capacity: 100,
    color: 'from-indigo-500 to-violet-600',
  },
  {
    id: 2,
    title: 'AI and Machine Learning Workshop',
    category: 'Workshop',
    date: '2026-11-08',
    time: '10:30',
    location: 'Seminar Hall A',
    description:
      'Explore artificial intelligence fundamentals, machine learning concepts, and practical project ideas.',
    organizer: 'AI Student Community',
    attendees: 32,
    capacity: 60,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 3,
    title: 'Campus Cultural Fest',
    category: 'Cultural',
    date: '2026-11-20',
    time: '16:00',
    location: 'Main Auditorium',
    description:
      'Celebrate student creativity with music, performances, art, and activities from across the campus.',
    organizer: 'Student Council',
    attendees: 120,
    capacity: 250,
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 4,
    title: 'Career Development Session',
    category: 'Career',
    date: '2026-11-12',
    time: '14:00',
    location: 'Conference Room',
    description:
      'Learn about resumes, interviews, internships, and preparing for campus placement opportunities.',
    organizer: 'Career Guidance Cell',
    attendees: 28,
    capacity: 75,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 5,
    title: 'Web Development Workshop',
    category: 'Workshop',
    date: '2026-11-10',
    time: '11:00',
    location: 'Computer Lab 2',
    description:
      'Learn the basics of modern web development and discover how to build interactive websites.',
    organizer: 'Web Developers Club',
    attendees: 38,
    capacity: 50,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 6,
    title: 'Inter-Department Sports Meet',
    category: 'Sports',
    date: '2026-11-25',
    time: '08:00',
    location: 'College Sports Ground',
    description:
      'Participate in friendly competitions, support your department, and enjoy a day of campus sports.',
    organizer: 'Sports Committee',
    attendees: 85,
    capacity: 180,
    color: 'from-red-500 to-orange-500',
  },
];

const categories = [
  'All Events',
  'Technology',
  'Workshop',
  'Cultural',
  'Career',
  'Sports',
];

const emptyForm = {
  title: '',
  category: 'Technology',
  date: '',
  time: '',
  location: '',
  description: '',
  organizer: 'Student Community',
  capacity: '50',
};

function formatDate(dateString) {
  if (!dateString) return 'Date to be announced';

  const date = new Date(dateString + 'T12:00:00');

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Events() {
  const { getToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Events');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { getEvents().then((result) => setEvents(result.events || [])).catch((error) => toast.error(error.response?.data?.message || 'Unable to load events.')); }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query);

        const matchesCategory =
          activeCategory === 'All Events' ||
          event.category === activeCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        return (
          new Date(a.date + 'T' + a.time) -
          new Date(b.date + 'T' + b.time)
        );
      });
  }, [events, search, activeCategory]);

  const handleRegister = async (eventItem) => {
    try { const token = await getToken(); const result = await toggleEventRegistration(eventItem.id, token); setEvents((items) => items.map((item) => item.id === eventItem.id ? result.event : item)); toast.success(result.event.registered ? `You registered for ${eventItem.title}!` : 'Registration cancelled.'); } catch (error) { toast.error(error.response?.data?.message || 'Unable to update registration.'); }
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.date ||
      !form.time ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      const token = await getToken();
      const result = await createEvent({ ...form, title: form.title.trim(), location: form.location.trim(), description: form.description.trim(), capacity: Math.max(1, Number(form.capacity) || 50) }, token);
      setEvents((current) => [...current, result.event]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create event.');
      return;
    }
    setForm(emptyForm);
    setShowModal(false);
    setActiveCategory('All Events');
    setSearch('');

    toast.success('Event created successfully!');
  };

  const upcomingCount = events.filter(
    (event) => event.date >= new Date().toISOString().slice(0, 10)
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            CAMPUS CALENDAR
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Campus Events
          </h1>

          <p className="mt-2 text-slate-500">
            Discover events, meet students, and make campus life memorable.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={19} />
          Create Event
        </button>
      </div>

      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
        <div className="flex items-center gap-4">
          <div className="hidden rounded-2xl bg-white/15 p-4 sm:block">
            <Sparkles size={35} />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Something exciting is happening!
            </h2>

            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Find workshops, hackathons, cultural activities, and career
              opportunities happening in your campus community.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Upcoming Events</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {upcomingCount}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarDays size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Your Registrations</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {events.filter((event) => event.registered).length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Ticket size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Available Events</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {filteredEvents.length}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search events, locations, or organizers..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={
              activeCategory === category
                ? 'rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white'
                : 'rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700'
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Explore Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredEvents.length} event
              {filteredEvents.length === 1 ? '' : 's'} found
            </p>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((eventItem) => {
              const isRegistered = eventItem.registered;
              const isFull = eventItem.attendees >= eventItem.capacity;

              return (
                <article
                  key={eventItem.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Card banner */}
                  <div
                    className={
                      'relative flex h-36 items-center justify-center bg-gradient-to-r ' +
                      eventItem.color
                    }
                  >
                    <CalendarDays
                      size={54}
                      className="text-white/90"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {eventItem.category}
                    </span>

                    {isRegistered && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                        <CheckCircle size={13} />
                        Registered
                      </span>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {eventItem.title}
                    </h3>

                    <p className="mt-2 min-h-16 text-sm leading-6 text-slate-500">
                      {eventItem.description}
                    </p>

                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-indigo-600"
                        />
                        {formatDate(eventItem.date)}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock
                          size={17}
                          className="shrink-0 text-indigo-600"
                        />
                        {eventItem.time}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin
                          size={17}
                          className="shrink-0 text-indigo-600"
                        />
                        <span className="truncate">{eventItem.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Users
                          size={17}
                          className="shrink-0 text-indigo-600"
                        />
                        {eventItem.attendees} / {eventItem.capacity} attendees
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width:
                              Math.min(
                                100,
                                (eventItem.attendees / eventItem.capacity) *
                                  100
                              ) + '%',
                          }}
                        />
                      </div>

                      <p className="text-xs text-slate-500">
                        Organized by {eventItem.organizer}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isFull && !isRegistered}
                      onClick={() => handleRegister(eventItem)}
                      className={
                        isRegistered
                          ? 'mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100'
                          : isFull
                            ? 'mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400'
                            : 'mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700'
                      }
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle size={17} />
                          Cancel Registration
                        </>
                      ) : isFull ? (
                        'Event Full'
                      ) : (
                        <>
                          <Ticket size={17} />
                          Register Now
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No events found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('All Events');
              }}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Create event modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-event-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="create-event-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Create a Campus Event
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add an event for your campus community.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Name *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Enter event name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    {categories
                      .filter((item) => item !== 'All Events')
                      .map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Maximum Attendees
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(event) =>
                      setForm({ ...form, capacity: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Event Date *
                  </label>

                  <input
                    required
                    type="date"
                    min="2026-10-28"
                    value={form.date}
                    onChange={(event) =>
                      setForm({ ...form, date: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Event Time *
                  </label>

                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={(event) =>
                      setForm({ ...form, time: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Location *
                </label>

                <input
                  required
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  placeholder="e.g. Seminar Hall"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Organizer
                </label>

                <input
                  value={form.organizer}
                  onChange={(event) =>
                    setForm({ ...form, organizer: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description *
                </label>

                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe the event..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm(emptyForm);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;




import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/react';
import { getStudyGroups, createStudyGroup, toggleStudyGroupMembership } from '../services/api';
import {
  Search,
  Users,
  BookOpen,
  Plus,
  X,
  CalendarDays,
  Clock,
  MapPin,
  GraduationCap,
  Code,
  Calculator,
  Brain,
  CheckCircle,
  UserPlus,
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialGroups = [
  {
    id: 1,
    name: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    description:
      'Practice DSA problems together, discuss algorithms, and prepare for coding interviews.',
    schedule: 'Monday and Wednesday',
    time: '5:00 PM',
    location: 'Library, Floor 2',
    members: 12,
    capacity: 20,
    level: 'Intermediate',
    initials: 'DS',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 2,
    name: 'Machine Learning Study Circle',
    subject: 'Artificial Intelligence',
    description:
      'Learn machine learning concepts, explore datasets, and build beginner-friendly AI projects.',
    schedule: 'Tuesday and Thursday',
    time: '4:00 PM',
    location: 'Computer Lab 1',
    members: 8,
    capacity: 15,
    level: 'Beginner',
    initials: 'ML',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    id: 3,
    name: 'Database Management Systems',
    subject: 'Database Systems',
    description:
      'Review SQL, normalization, ER diagrams, and important exam questions together.',
    schedule: 'Friday',
    time: '3:30 PM',
    location: 'Room 204',
    members: 15,
    capacity: 20,
    level: 'All Levels',
    initials: 'DB',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 4,
    name: 'Mathematics Problem Solvers',
    subject: 'Mathematics',
    description:
      'Work through challenging mathematics problems and help each other prepare for exams.',
    schedule: 'Saturday',
    time: '10:00 AM',
    location: 'Central Library',
    members: 9,
    capacity: 18,
    level: 'All Levels',
    initials: 'MA',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 5,
    name: 'Web Development Project Team',
    subject: 'Web Development',
    description:
      'Collaborate on React projects, practice frontend development, and share coding resources.',
    schedule: 'Wednesday and Friday',
    time: '5:30 PM',
    location: 'Innovation Lab',
    members: 6,
    capacity: 12,
    level: 'Beginner',
    initials: 'WD',
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 6,
    name: 'Operating Systems Revision',
    subject: 'Computer Science',
    description:
      'Study processes, threads, memory management, scheduling algorithms, and exam topics.',
    schedule: 'Thursday',
    time: '2:00 PM',
    location: 'Room 105',
    members: 10,
    capacity: 16,
    level: 'Intermediate',
    initials: 'OS',
    color: 'bg-rose-100 text-rose-700',
  },
];

const categories = [
  'All Subjects',
  'Computer Science',
  'Artificial Intelligence',
  'Database Systems',
  'Mathematics',
  'Web Development',
];

const emptyForm = {
  name: '',
  subject: 'Computer Science',
  description: '',
  schedule: '',
  time: '',
  location: '',
  capacity: '15',
  level: 'All Levels',
};

function StudyGroups() {
  const { getToken } = useAuth();
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Subjects');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  useEffect(() => { getStudyGroups().then((result) => setGroups(result.groups || [])).catch((error) => toast.error(error.response?.data?.message || 'Unable to load study groups.')); }, []);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(query) ||
        group.subject.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === 'All Subjects' ||
        group.subject === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [groups, search, activeCategory]);

  const handleJoin = async (group) => {
    try { const token = await getToken(); const result = await toggleStudyGroupMembership(group.id, token); setGroups((items) => items.map((item) => item.id === group.id ? result.group : item)); toast.success(result.group.joined ? `You joined ${group.name}!` : `You left ${group.name}.`); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to update group membership.'); }
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.schedule.trim() ||
      !form.time.trim() ||
      !form.location.trim()
    ) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      const token = await getToken();
      const result = await createStudyGroup({ ...form, name: form.name.trim(), description: form.description.trim(), schedule: form.schedule.trim(), time: form.time.trim(), location: form.location.trim(), capacity: Math.max(1, Number(form.capacity) || 15) }, token);
      setGroups((current) => [result.group, ...current]);
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to create study group.'); return; }
    setForm(emptyForm);
    setShowModal(false);
    setActiveCategory('All Subjects');
    setSearch('');

    toast.success('Study group created successfully!');
  };

  const totalMembers = groups.reduce(
    (total, group) => total + group.members,
    0
  );

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            LEARN TOGETHER
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Study Groups
          </h1>

          <p className="mt-2 text-slate-500">
            Find study partners, share knowledge, and achieve more together.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={19} />
          Create Group
        </button>
      </div>

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
        <div className="flex items-center gap-4">
          <div className="hidden rounded-2xl bg-white/15 p-4 sm:block">
            <GraduationCap size={36} />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Better together, smarter together.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
              Join classmates who share your academic interests, prepare for
              exams, and collaborate on exciting projects.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Study Groups</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {groups.length}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BookOpen size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Members</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalMembers}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Groups Joined</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {groups.filter((group) => group.joined).length}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <CheckCircle size={24} />
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
          placeholder="Search groups, subjects, or topics..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Subject filters */}
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

      {/* Group cards */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Explore Study Groups
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredGroups.length} group
            {filteredGroups.length === 1 ? '' : 's'} found
          </p>
        </div>

        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredGroups.map((group) => {
              const isJoined = group.joined;
              const isFull = group.members >= group.capacity;

              return (
                <article
                  key={group.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={
                        'flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ' +
                        group.color
                      }
                    >
                      {group.initials}
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {group.level}
                    </span>
                  </div>

                  <div className="mt-5">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {group.subject}
                    </span>

                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                      {group.name}
                    </h3>

                    <p className="mt-2 min-h-16 text-sm leading-6 text-slate-500">
                      {group.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CalendarDays
                        size={17}
                        className="shrink-0 text-indigo-600"
                      />
                      {group.schedule}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock
                        size={17}
                        className="shrink-0 text-indigo-600"
                      />
                      {group.time}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin
                        size={17}
                        className="shrink-0 text-indigo-600"
                      />
                      <span className="truncate">{group.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users
                        size={17}
                        className="shrink-0 text-indigo-600"
                      />
                      {group.members} / {group.capacity} members
                    </div>
                  </div>

                  <div className="mb-4 mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width:
                          Math.min(
                            100,
                            (group.members / group.capacity) * 100
                          ) + '%',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isFull && !isJoined}
                    onClick={() => handleJoin(group)}
                    className={
                      isJoined
                        ? 'flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100'
                        : isFull
                          ? 'flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400'
                          : 'flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700'
                    }
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle size={17} />
                        Leave Group
                      </>
                    ) : isFull ? (
                      'Group Full'
                    ) : (
                      <>
                        <UserPlus size={17} />
                        Join Study Group
                      </>
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No study groups found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try a different search or create a new study group.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('All Subjects');
              }}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Create group modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-group-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="create-group-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Create a Study Group
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Invite classmates to learn together.
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

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Group Name *
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Python Programming Group"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Subject
                  </label>

                  <select
                    value={form.subject}
                    onChange={(event) =>
                      setForm({ ...form, subject: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    {categories
                      .filter((item) => item !== 'All Subjects')
                      .map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Difficulty
                  </label>

                  <select
                    value={form.level}
                    onChange={(event) =>
                      setForm({ ...form, level: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Study Days *
                  </label>

                  <input
                    required
                    value={form.schedule}
                    onChange={(event) =>
                      setForm({ ...form, schedule: event.target.value })
                    }
                    placeholder="e.g. Monday and Friday"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Study Time *
                  </label>

                  <input
                    required
                    value={form.time}
                    onChange={(event) =>
                      setForm({ ...form, time: event.target.value })
                    }
                    placeholder="e.g. 4:00 PM"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    placeholder="e.g. Library"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Maximum Members
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
                  placeholder="What will members learn or practice?"
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
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyGroups;


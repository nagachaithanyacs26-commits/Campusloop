
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Pencil,
  Plus,
  X,
  Check,
  Code2,
  Globe,
  Sparkles,
  Trophy,
  BookOpen,
  Users,
  CalendarDays,
  Package,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  ExternalLink,
  Zap,
  Star,
  Award,
  Clock,
} from 'lucide-react'

import { useProfile } from '../context/ProfileContext'

const EMPTY_PROFILE = {
  name: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  course: '',
  department: '',
  year: '',
  college: '',
  bio: '',
  skills: [],
  interests: [],
  github: '',
  linkedin: '',
  website: '',
  avatar: '',
}

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    title: 'Building CampusLoop',
    description:
      'Working on a smart campus platform to help students connect, exchange resources, and collaborate on academic projects.',
    date: 'Recently',
    icon: Code2,
    color: 'bg-indigo-100 text-indigo-600',
    likes: 12,
  },
  {
    id: 2,
    title: 'Learning modern web development',
    description:
      'Exploring React, responsive interfaces, and interactive user experiences.',
    date: 'This month',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-600',
    likes: 8,
  },
]

const HEADLINES = [
  'Aspiring Software Developer',
  'Technology Enthusiast',
  'Creative Problem Solver',
  'Future Innovator',
]

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
            {eyebrow}
          </p>
        )}

        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {action}
    </div>
  )
}

function Profile() {
  const {
    profile,
    saveProfile: saveProfileToDatabase,
    profileLoading,
    profileError,
  } = useProfile()

  const [formData, setFormData] = useState(EMPTY_PROFILE)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [activeTab, setActiveTab] = useState('Overview')
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')

  // These activities are still frontend demo data.
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [likedActivities, setLikedActivities] = useState([])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeadlineIndex(
        (previous) => (previous + 1) % HEADLINES.length
      )
    }, 2800)

    return () => window.clearInterval(timer)
  }, [])

  const safeProfile = {
    ...EMPTY_PROFILE,
    ...profile,
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    interests: Array.isArray(profile?.interests)
      ? profile.interests
      : [],
  }

  const profileFields = [
    safeProfile.name,
    safeProfile.headline,
    safeProfile.email,
    safeProfile.location,
    safeProfile.course,
    safeProfile.department,
    safeProfile.bio,
  ]

  const completion = Math.round(
    (profileFields.filter(
      (value) => typeof value === 'string' && value.trim().length > 0
    ).length /
      7) *
      100
  )

  // These are illustrative demo statistics until their
  // respective backend features are connected.
  const stats = [
    {
      label: 'Connections',
      value: '128',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Resources shared',
      value: '12',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Events joined',
      value: '8',
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Study groups',
      value: '4',
      icon: BookOpen,
      color: 'text-violet-600 bg-violet-50',
    },
  ]

  function openEditor() {
    setFormData({
      ...EMPTY_PROFILE,
      ...safeProfile,
      skills: [...safeProfile.skills],
      interests: [...safeProfile.interests],
    })

    setNewSkill('')
    setNewInterest('')
    setEditing(true)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function addTag(type) {
    const isSkill = type === 'skills'
    const value = (isSkill ? newSkill : newInterest).trim()

    if (!value) return

    if (
      formData[type].some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      toast.error('This item has already been added.')
      return
    }

    setFormData((previous) => ({
      ...previous,
      [type]: [...previous[type], value],
    }))

    if (isSkill) setNewSkill('')
    else setNewInterest('')
  }

  function removeTag(type, value) {
    setFormData((previous) => ({
      ...previous,
      [type]: previous[type].filter((item) => item !== value),
    }))
  }

  async function saveProfile(event) {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please enter your name and email.')
      return
    }

    const updatedProfile = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      headline: formData.headline.trim(),
      bio: formData.bio.trim(),
      skills: [...formData.skills],
      interests: [...formData.interests],
    }

    try {
      setSaving(true)

      await saveProfileToDatabase(updatedProfile)

      setEditing(false)
      toast.success('Your profile has been saved!')
    } catch (error) {
      console.error('Profile save error:', error)

      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to save your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  function cancelEditing() {
    setFormData({
      ...EMPTY_PROFILE,
      ...safeProfile,
      skills: [...safeProfile.skills],
      interests: [...safeProfile.interests],
    })

    setEditing(false)
  }

  function toggleLike(id) {
    const alreadyLiked = likedActivities.includes(id)

    setLikedActivities((previous) =>
      alreadyLiked
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    )

    setActivities((previous) =>
      previous.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              likes: Math.max(
                0,
                activity.likes + (alreadyLiked ? -1 : 1)
              ),
            }
          : activity
      )
    )
  }

  function addActivity() {
    const title = window.prompt('What would you like to share?')

    if (!title?.trim()) return

    const description = window.prompt(
      'Add a short description for your activity:'
    )

    setActivities((previous) => [
      {
        id: Date.now(),
        title: title.trim(),
        description:
          description?.trim() || 'Shared a new campus update.',
        date: 'Just now',
        icon: Sparkles,
        color: 'bg-indigo-100 text-indigo-600',
        likes: 0,
      },
      ...previous,
    ])

    setActiveTab('Activity')
    toast.success('Your update has been published!')
  }

  async function shareProfile() {
    const profileUrl = window.location.href

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(profileUrl)
        toast.success('Profile link copied!')
      } else {
        window.prompt('Copy your profile link:', profileUrl)
      }
    } catch {
      toast.error('Could not copy the profile link.')
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab)

    if (!['Overview', 'Activity', 'Skills', 'Education'].includes(tab)) {
      toast('This profile section is coming soon.', {
        icon: '✨',
      })
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'

  // Loading state while fetching the MongoDB profile.
  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen space-y-6 pb-10">
      <style>{`
        @keyframes profileFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes profileGlow {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.08); }
        }

        @keyframes profileReveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-float {
          animation: profileFloat 5s ease-in-out infinite;
        }

        .profile-glow {
          animation: profileGlow 5s ease-in-out infinite;
        }

        .profile-reveal {
          animation: profileReveal .6s ease-out both;
        }

        .profile-card {
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .profile-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px -24px rgba(49,46,129,.4);
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-float,
          .profile-glow,
          .profile-reveal {
            animation: none !important;
          }

          .profile-card {
            transition: none !important;
          }

          .profile-card:hover {
            transform: none !important;
          }
        }
      `}</style>

      {/* Page heading */}
      <header className="profile-reveal flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Your professional identity
            </p>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            My Profile<span className="ml-2 text-indigo-600">.</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Showcase your journey, connect with students, and grow together.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={shareProfile}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            <Share2 size={16} /> Share
          </button>

          <button
            type="button"
            onClick={openEditor}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            <Pencil size={16} /> Edit Profile
          </button>
        </div>
      </header>

      {/* Profile loading error */}
      {profileError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {profileError}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-2 font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Profile identity card */}
      <section className="profile-reveal overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-800 sm:h-60">
          <div className="profile-glow absolute -right-12 -top-24 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl" />
          <div className="profile-glow absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="profile-float absolute right-[12%] top-8 hidden h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md sm:flex">
            <Code2 size={34} className="text-white/80" />
          </div>

          <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
              CampusLoop / Profile
            </span>
          </div>

          <div className="absolute bottom-5 left-6 max-w-[80%] sm:bottom-8 sm:left-8">
            <p className="text-xs font-medium text-indigo-200">
              YOUR JOURNEY STARTS HERE
            </p>
            <p className="mt-2 text-xl font-black text-white sm:text-3xl">
              Make your next move count.
            </p>
          </div>

          <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4 sm:-mt-[68px]">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border-[5px] border-white bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-3xl font-black text-white shadow-xl sm:h-36 sm:w-36 sm:text-4xl">
              {safeProfile.avatar ? (
                <img
                  src={safeProfile.avatar}
                  alt={safeProfile.name || 'Profile'}
                  className="h-full w-full rounded-[23px] object-cover"
                />
              ) : (
                getInitials(safeProfile.name) || 'ST'
              )}

              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" />
            </div>

            <div className="flex flex-wrap gap-2 pb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                <GraduationCap size={15} /> Student
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                <Star size={14} /> Campus Member
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px] lg:items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {safeProfile.name || 'Your Name'}
              </h2>

              <p
                key={headlineIndex}
                className="mt-2 min-h-7 text-sm font-semibold text-indigo-600 sm:text-base"
              >
                {headlineIndex === 0
                  ? safeProfile.headline || HEADLINES[0]
                  : HEADLINES[headlineIndex]}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {safeProfile.course || 'Course not added'} ·{' '}
                {safeProfile.department || 'Department not added'} ·{' '}
                {safeProfile.year || 'Year not added'}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-indigo-500" />
                  {safeProfile.location || 'Location not added'}
                </span>

                <span className="flex items-center gap-1.5">
                  <Mail size={15} className="text-indigo-500" />
                  {safeProfile.email || 'Email not added'}
                </span>

                {safeProfile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={15} className="text-indigo-500" />
                    {safeProfile.phone}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {safeProfile.github && (
                  <a
                    href={safeProfile.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Code2 size={18} />
                  </a>
                )}

                {safeProfile.linkedin && (
                  <a
                    href={safeProfile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}

                {safeProfile.website && (
                  <a
                    href={safeProfile.website}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Personal website"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Globe size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <GraduationCap size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Education
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {safeProfile.college || 'College not added'}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {safeProfile.course} · {safeProfile.department}
                  </p>

                  <p className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                    {safeProfile.year || 'Year not added'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-6 overflow-x-auto border-b border-slate-100">
            {['Overview', 'Activity', 'Skills', 'Education'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`relative shrink-0 pb-3 text-sm font-semibold ${
                  activeTab === tab
                    ? 'text-indigo-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}

                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="profile-reveal grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="profile-card rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={17} className="text-slate-300" />
              </div>

              <p className="mt-4 text-2xl font-black text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          )
        })}
      </section>

      {/* Main content */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* About */}
          {(activeTab === 'Overview' || activeTab === 'Education') && (
            <section className="profile-card rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="Get to know me"
                title="About"
                description="A little more about my journey and what I enjoy."
                action={
                  <button
                    type="button"
                    onClick={openEditor}
                    aria-label="Edit about section"
                    className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil size={17} />
                  </button>
                }
              />

              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {safeProfile.bio || 'Add an introduction to tell your story.'}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-indigo-50/70 p-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Zap size={18} />
                    <span className="text-xs font-bold">My focus</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    Learning by building
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Turning new ideas into practical projects.
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50/70 p-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Users size={18} />
                    <span className="text-xs font-bold">My mindset</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    Learn together
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Sharing knowledge and growing as a community.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Activity */}
          {(activeTab === 'Overview' || activeTab === 'Activity') && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="My journey"
                title="Recent Activity"
                description="Projects, learning milestones, and campus updates."
                action={
                  <button
                    type="button"
                    onClick={addActivity}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-100 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50"
                  >
                    <Plus size={15} /> Share update
                  </button>
                }
              />

              {activities.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">
                  Your activity will appear here.
                </p>
              )}

              <div>
                {activities.map((activity, index) => {
                  const Icon = activity.icon
                  const liked = likedActivities.includes(activity.id)

                  return (
                    <article
                      key={activity.id}
                      className={`py-5 ${
                        index !== activities.length - 1
                          ? 'border-b border-slate-100'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${activity.color}`}>
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-sm font-bold text-slate-900">
                              {activity.title}
                            </h3>

                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock size={12} /> {activity.date}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {activity.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <button
                              type="button"
                              onClick={() => toggleLike(activity.id)}
                              className={`flex items-center gap-1.5 text-xs font-semibold ${
                                liked
                                  ? 'text-rose-600'
                                  : 'text-slate-400 hover:text-rose-500'
                              }`}
                            >
                              <Heart
                                size={16}
                                fill={liked ? 'currentColor' : 'none'}
                              />
                              {activity.likes} Likes
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toast('Comments will be available when connected.')
                              }
                              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600"
                            >
                              <MessageCircle size={16} /> Comment
                            </button>

                            <button
                              type="button"
                              onClick={shareProfile}
                              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600"
                            >
                              <Share2 size={15} /> Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* Skills and interests */}
          {(activeTab === 'Overview' || activeTab === 'Skills') && (
            <section className="profile-card rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="What I bring"
                title="Skills & Expertise"
                description="Technologies and skills I'm exploring."
                action={
                  <button
                    type="button"
                    onClick={openEditor}
                    aria-label="Edit skills"
                    className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil size={17} />
                  </button>
                }
              />

              <div className="flex flex-wrap gap-2.5">
                {safeProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2.5 text-xs font-semibold text-indigo-700"
                  >
                    <Code2 size={14} /> {skill}
                  </span>
                ))}

                {safeProfile.skills.length === 0 && (
                  <p className="text-sm text-slate-400">
                    Add your first skill using Edit Profile.
                  </p>
                )}
              </div>

              <div className="my-6 border-t border-slate-100" />

              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Interests
              </h3>

              <div className="flex flex-wrap gap-2">
                {safeProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
                  >
                    {interest}
                  </span>
                ))}

                {safeProfile.interests.length === 0 && (
                  <p className="text-sm text-slate-400">
                    Add interests using Edit Profile.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {(activeTab === 'Overview' || activeTab === 'Education') && (
            <section className="profile-card rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="My academic journey"
                title="Education"
                description="Where I am learning and growing."
                action={
                  <button
                    type="button"
                    onClick={openEditor}
                    aria-label="Edit education"
                    className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil size={17} />
                  </button>
                }
              />

              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-100">
                  <GraduationCap size={27} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900">
                    {safeProfile.college || 'College not added'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {safeProfile.course}, {safeProfile.department}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {safeProfile.year}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                    <BookOpen size={14} /> Academic journey in progress
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          {/* Profile completion */}
          <section className="profile-card rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                  Profile strength
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-900">
                  Keep growing!
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  A complete profile helps others learn about you.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Trophy size={23} />
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <span className="text-sm font-semibold text-slate-600">
                Completion
              </span>

              <span className="text-2xl font-black text-indigo-600">
                {completion}%
              </span>
            </div>

            <div
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Profile completion"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>

            <button
              type="button"
              onClick={openEditor}
              className="mt-5 flex w-full items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
            >
              Improve your profile <ChevronRight size={16} />
            </button>
          </section>

          {/* Highlights */}
          <section className="profile-card rounded-3xl border border-slate-200 bg-white p-5">
            <SectionHeading
              title="Highlights"
              description="Your campus journey at a glance."
            />

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Award size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Continuous learner
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Exploring new skills and technologies.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Community contributor
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Connecting and collaborating with students.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Sparkles size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Future focused
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Building experience through practical projects.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section className="profile-card rounded-3xl border border-slate-200 bg-white p-5">
            <SectionHeading
              title="Interests"
              description="Topics on my radar."
            />

            <div className="flex flex-wrap gap-2">
              {safeProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {interest}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={openEditor}
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Customize interests <ArrowUpRight size={14} />
            </button>
          </section>

          {/* CampusLoop banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 p-5 text-white">
            <div className="profile-glow absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl" />

            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <GraduationCap size={23} />
              </div>

              <h3 className="mt-4 text-lg font-black">
                Your campus.
                <br />
                Your community.
              </h3>

              <p className="mt-2 text-xs leading-5 text-indigo-100">
                Learn together, share resources, and build your future with CampusLoop.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/80">
                <Heart size={14} /> Made for student connections
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Edit profile modal */}
      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              cancelEditing()
            }
          }}
        >
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 px-5 py-6 text-white sm:px-8">
              <div className="profile-glow absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">
                    Personalize your presence
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Edit Profile
                  </h2>

                  <p className="mt-1 text-sm text-indigo-100">
                    Tell your campus community more about you.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  aria-label="Close editor"
                  className="rounded-xl bg-white/10 p-2 hover:bg-white/20 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={saveProfile}>
              <div className="max-h-[60vh] space-y-5 overflow-y-auto p-5 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Full name *
                    </label>

                    <input
                      id="profile-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Email address *
                    </label>

                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-headline"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Professional headline
                    </label>

                    <input
                      id="profile-headline"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="Student | Web Developer | Designer"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-phone"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Phone number
                    </label>

                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-location"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Location
                    </label>

                    <input
                      id="profile-location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City or campus"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-course"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Degree / Course
                    </label>

                    <input
                      id="profile-course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-year"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Year of study
                    </label>

                    <select
                      id="profile-year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={`${inputClass} bg-white`}
                    >
                      <option value="">Select year</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Postgraduate</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-department"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Department
                    </label>

                    <input
                      id="profile-department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-college"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      College / University
                    </label>

                    <input
                      id="profile-college"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-bio"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      About me
                    </label>

                    <textarea
                      id="profile-bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      maxLength={600}
                      placeholder="Tell your story..."
                      className={`${inputClass} resize-y leading-6`}
                    />

                    <p className="mt-1 text-right text-[10px] text-slate-400">
                      {formData.bio.length}/600 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-github"
                      className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                    >
                      <Code2 size={15} /> GitHub URL
                    </label>

                    <input
                      id="profile-github"
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-linkedin"
                      className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                    >
                      <ExternalLink size={15} /> LinkedIn URL
                    </label>

                    <input
                      id="profile-linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-website"
                      className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                    >
                      <Globe size={15} /> Personal website
                    </label>

                    <input
                      id="profile-website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Skills editor */}
                <div className="border-t border-slate-100 pt-5">
                  <label
                    htmlFor="profile-new-skill"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Skills
                  </label>

                  <div className="flex gap-2">
                    <input
                      id="profile-new-skill"
                      value={newSkill}
                      onChange={(event) => setNewSkill(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          addTag('skills')
                        }
                      }}
                      placeholder="Add a skill..."
                      className={`min-w-0 flex-1 ${inputClass}`}
                    />

                    <button
                      type="button"
                      onClick={() => addTag('skills')}
                      className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                    >
                      <Plus size={15} /> Add
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700"
                      >
                        {skill}

                        <button
                          type="button"
                          onClick={() => removeTag('skills', skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests editor */}
                <div>
                  <label
                    htmlFor="profile-new-interest"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Interests
                  </label>

                  <div className="flex gap-2">
                    <input
                      id="profile-new-interest"
                      value={newInterest}
                      onChange={(event) => setNewInterest(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          addTag('interests')
                        }
                      }}
                      placeholder="Add an interest..."
                      className={`min-w-0 flex-1 ${inputClass}`}
                    />

                    <button
                      type="button"
                      onClick={() => addTag('interests')}
                      className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      <Plus size={15} /> Add
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                      >
                        {interest}

                        <button
                          type="button"
                          onClick={() => removeTag('interests', interest)}
                          aria-label={`Remove ${interest}`}
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={17} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

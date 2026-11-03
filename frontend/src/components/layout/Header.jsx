
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';

import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  CircleUserRound,
  X,
} from 'lucide-react';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { profile } = useProfile();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Generate initials from the student's profile name.
  const initials =
    profile?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'ST';

  function goToProfile() {
    setProfileMenuOpen(false);
    navigate('/profile');
  }

  function goToSettings() {
    setProfileMenuOpen(false);
    navigate('/settings');
  }

  function toggleNotifications() {
    setNotificationsOpen((previous) => !previous);
    setProfileMenuOpen(false);
  }

  function toggleProfileMenu() {
    setProfileMenuOpen((previous) => !previous);
    setNotificationsOpen(false);
  }

  function closeMenus() {
    setProfileMenuOpen(false);
    setNotificationsOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Left section: Menu and search */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="relative hidden w-full max-w-md sm:block">
          <Search
            size={19}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search resources, events, students..."
            aria-label="Search CampusLoop"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        <p className="truncate text-sm font-bold text-indigo-600 sm:hidden">
          CampusLoop
        </p>
      </div>

      {/* Right section: Notifications and profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
            className={`relative rounded-xl border p-2.5 transition ${
              notificationsOpen
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-14 z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Your campus updates
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3">
                <div className="flex gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Welcome to CampusLoop!
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Complete your profile and connect with your campus
                      community.
                    </p>
                  </div>
                </div>

                <div className="mt-1 flex gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <CircleUserRound size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Build your network
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Discover study groups, campus events, and shared
                      resources.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/events');
                  }}
                  className="w-full rounded-xl bg-indigo-50 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
                >
                  Explore Campus Events
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Student profile dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Open student profile menu"
            aria-expanded={profileMenuOpen}
            onClick={toggleProfileMenu}
            className={`flex items-center gap-2 rounded-xl p-1.5 transition ${
              profileMenuOpen ? 'bg-indigo-50' : 'hover:bg-slate-50'
            }`}
          >
            {/* Profile initials */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-100 bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
              {initials}
            </div>

            <div className="hidden text-left md:block">
              <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                {profile?.name || 'Student User'}
              </p>

              <p className="text-xs text-slate-500">
                {profile?.year || 'Campus Member'}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform md:block ${
                profileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile dropdown menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {profile?.name || 'Student User'}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {profile?.headline || 'Campus Member'}
                    </p>
                  </div>
                </div>

                {profile?.email && (
                  <p className="mt-3 truncate text-xs text-slate-500">
                    {profile.email}
                  </p>
                )}
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={goToProfile}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <UserRound size={18} />
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={goToSettings}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  <span>Back to My Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close menus when clicking outside */}
      {(profileMenuOpen || notificationsOpen) && (
        <button
          type="button"
          aria-label="Close open menus"
          className="fixed inset-0 z-20 cursor-default"
          onClick={closeMenus}
        />
      )}
    </header>
  );
}

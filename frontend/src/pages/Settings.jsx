import { useEffect, useState } from 'react'
import { useAuth, useClerk } from '@clerk/react'
import { Bell, CalendarDays, Mail, Shield, LogOut, Save, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMySettings, updateMySettings } from '../services/api'

const defaults = { emailNotifications: true, eventReminders: true, resourceUpdates: true, weeklyDigest: false, profileVisibility: 'campus' }
const options = [
  { key: 'emailNotifications', title: 'Email notifications', description: 'Receive important updates about your CampusLoop account.', icon: Mail },
  { key: 'eventReminders', title: 'Event reminders', description: 'Get reminders before events you registered for.', icon: CalendarDays },
  { key: 'resourceUpdates', title: 'Resource request updates', description: 'Know when someone requests or responds to a resource.', icon: BookOpen },
  { key: 'weeklyDigest', title: 'Weekly campus digest', description: 'Receive a weekly summary of campus activity.', icon: Bell },
]

export default function Settings() {
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const [settings, setSettings] = useState(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    getToken().then(getMySettings).then((result) => { if (active) setSettings({ ...defaults, ...result.settings }) }).catch((error) => toast.error(error.response?.data?.message || 'Unable to load settings.')).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [getToken])

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    try { const token = await getToken(); const result = await updateMySettings(settings, token); setSettings({ ...defaults, ...result.settings }); toast.success('Settings saved.') }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to save settings.') }
    finally { setSaving(false) }
  }

  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))

  return <div className="mx-auto max-w-4xl space-y-7">
    <header><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">YOUR ACCOUNT</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1><p className="mt-2 text-slate-500">Manage your notifications, profile visibility, and account session.</p></header>
    <form onSubmit={save} className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6"><h2 className="font-bold text-slate-900">Notifications</h2><p className="mt-1 text-sm text-slate-500">Choose the updates you want to receive.</p></div>
        <div className="divide-y divide-slate-100 px-5 sm:px-6">
          {options.map(({ key, title, description, icon: Icon }) => <label key={key} className="flex cursor-pointer items-center justify-between gap-4 py-5"><span className="flex items-start gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Icon size={19}/></span><span><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span></span></span><input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} disabled={loading} className="h-5 w-5 shrink-0 accent-indigo-600"/></label>)}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-start gap-3"><span className="rounded-xl bg-violet-50 p-2.5 text-violet-600"><Shield size={19}/></span><div className="flex-1"><h2 className="font-bold text-slate-900">Profile visibility</h2><p className="mt-1 text-sm text-slate-500">Control who can discover your campus profile.</p><select value={settings.profileVisibility} onChange={(event) => setSettings((current) => ({ ...current, profileVisibility: event.target.value }))} disabled={loading} className="mt-4 w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400"><option value="campus">Visible to campus members</option><option value="private">Private</option></select></div></div></section>
      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row"><button type="button" onClick={() => signOut({ redirectUrl: '/login' })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"><LogOut size={17}/>Sign out</button><button type="submit" disabled={loading || saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><Save size={17}/>{saving ? 'Saving…' : 'Save settings'}</button></div>
    </form>
  </div>
}

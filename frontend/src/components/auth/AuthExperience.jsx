import { Infinity, Search, Bell, Sparkles, Users, BookOpen, CalendarDays, CircleHelp } from 'lucide-react'
import './auth.css'

const stories = [
  { label: 'CAMPUS ORIGINAL', title: 'Freshers Forever', icon: Sparkles, tone: 'auth-poster-one' },
  { label: 'CAMPUS LIFE', title: 'College Stories', icon: Users, tone: 'auth-poster-two' },
  { label: 'AFTER CLASS', title: 'Study Together', icon: BookOpen, tone: 'auth-poster-three' },
  { label: 'NEXT CHAPTER', title: 'Placement Diaries', icon: CalendarDays, tone: 'auth-poster-four' },
]

export default function AuthExperience({ children, mode }) {
  const isLogin = mode === 'login'
  return (
    <main className="auth-scene relative min-h-screen overflow-hidden bg-[#08090d] text-white">
      <div className="auth-ambient auth-ambient-one" />
      <div className="auth-ambient auth-ambient-two" />
      <header className="auth-nav relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
        <a href="/" className="flex items-center gap-2.5" aria-label="CampusLoop home">
          <Infinity size={38} strokeWidth={3} className="text-indigo-400" />
          <span className="text-xl font-black tracking-tight">Campus<span className="text-indigo-400">Loop</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/65 md:flex"><a className="auth-nav-active" href="/login">Home</a><a href="/events">Browse</a><a href="/login">My Loop</a></nav>
        <div className="flex items-center gap-4 text-white/80"><Search size={20} className="hidden sm:block"/><Bell size={20} className="hidden sm:block"/><a href={isLogin ? '/register' : '/login'} className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-950/40">{isLogin ? 'C' : '↗'}</a></div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-76px)] max-w-[1680px] items-center gap-x-10 gap-y-8 px-5 pb-10 pt-3 sm:px-10 lg:grid-cols-[1fr_0.82fr] lg:px-14 xl:gap-x-14">
        <section className="auth-intro flex min-h-[470px] flex-col justify-center py-4 lg:min-h-[600px] lg:pb-28">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-indigo-300"><span className="h-px w-8 bg-indigo-400" />CampusLoop Original</p>
          <h1 className="max-w-2xl text-6xl font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-7xl lg:text-[clamp(5rem,9vw,9rem)]">Campus<br /><span className="auth-title-glow">Loop</span></h1>
          <p className="mt-5 text-xl font-bold tracking-tight text-white sm:text-2xl">Watch. Learn. Belong.</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/65 sm:text-base">From college life to campus stories, CampusLoop brings your university world to life — one connection at a time.</p>
          <div className="mt-6 flex flex-wrap gap-3"><a href="#campus-stories" className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"><CircleHelp size={17}/>More info</a></div>
        </section>

        <section className="auth-panel-wrap mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="auth-panel rounded-2xl border border-white/15 p-5 shadow-2xl shadow-black/60 sm:p-8">
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-300">{isLogin ? 'CampusLoop Original' : 'Join the community'}</p>
              <h2 className="text-3xl font-extrabold tracking-tight">{isLogin ? 'Welcome Back!' : 'Join CampusLoop'}</h2>
              <p className="mt-2 text-sm text-white/60">{isLogin ? 'Log in to continue your CampusLoop journey.' : 'Create your account and start your campus story.'}</p>
            </div>
            {children}
          </div>
          <p className="mt-4 text-center text-[11px] text-white/40">Secure sign-in powered by Clerk</p>
        </section>

        <section id="campus-stories" className="auth-stories lg:absolute lg:bottom-8 lg:left-14 lg:right-[calc(41%+3.5rem)]">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-bold text-white sm:text-lg">Trending on CampusLoop</h2><span className="text-xs font-semibold text-indigo-300">Explore stories</span></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stories.map(({ label, title, icon: Icon, tone }, index) => <article key={label} className={`auth-poster ${tone} group relative flex min-h-[145px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-3.5 transition duration-300 hover:-translate-y-1 hover:border-white/25 sm:min-h-[150px] sm:p-4`}>
              <div className="auth-poster-orb" />
              <div className="relative z-10 flex items-center justify-between"><span className="text-[8px] font-bold tracking-[0.16em] text-white/70 sm:text-[9px]">{label}</span><span className="text-[10px] text-white/55">0{index + 1}</span></div>
              <div className="relative z-10"><Icon size={20} className="mb-3 text-white/80 sm:mb-4" /><h2 className="max-w-32 text-sm font-bold leading-tight sm:max-w-40 sm:text-lg">{title}</h2></div>
            </article>)}
          </div>
        </section>
      </div>
    </main>
  )
}

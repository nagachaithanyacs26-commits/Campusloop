import { SignIn } from '@clerk/react'

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">CampusLoop</h1>
          <p className="mt-2 text-slate-500">Welcome back! Sign in to your campus community.</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            routing="hash"
            signUpUrl="/register"
            fallbackRedirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: '#4f46e5',
                colorBackground: '#ffffff',
                colorText: '#0f172a',
                colorTextSecondary: '#64748b',
                borderRadius: '0.75rem',
                fontFamily: 'inherit',
              },
              elements: {
                cardBox: 'shadow-none border border-slate-200 rounded-2xl',
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 shadow-none',
                footer: 'bg-white',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Login

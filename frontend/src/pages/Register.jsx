import { SignUp } from '@clerk/react'
import AuthExperience from '../components/auth/AuthExperience'

function Register() {
  return <AuthExperience mode="register">
    <SignUp
      routing="hash"
      signInUrl="/login"
      fallbackRedirectUrl="/"
      appearance={{
        variables: { colorPrimary: '#4f46e5', colorBackground: 'transparent', colorText: '#ffffff', colorTextSecondary: '#a1a1aa', borderRadius: '0.75rem', fontFamily: 'inherit' },
        elements: {
          rootBox: 'w-full', cardBox: 'w-full border-0 bg-transparent shadow-none', card: 'w-full border-0 bg-transparent shadow-none',
          headerTitle: 'text-white', headerSubtitle: 'text-white/60', formFieldLabel: 'text-white/70', formFieldInput: 'bg-white/5 text-white border-white/15',
          socialButtonsBlockButton: 'bg-white/5 text-white border-white/15 hover:bg-white/10', formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950/30',
          footer: 'bg-transparent', footerActionText: 'text-white/55', footerActionLink: 'text-indigo-300 hover:text-indigo-200', dividerLine: 'bg-white/15', dividerText: 'text-white/45',
        },
      }}
    />
  </AuthExperience>
}

export default Register

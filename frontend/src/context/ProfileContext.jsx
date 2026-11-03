import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { useAuth, useUser } from '@clerk/react'
import { getMyProfile, updateMyProfile } from '../services/api'

const ProfileContext = createContext(null)

const defaultProfile = {
  name: '',
  headline: 'Student at CampusLoop',
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

export function ProfileProvider({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  const [profile, setProfile] = useState(defaultProfile)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  // Load profile from MongoDB
  const refreshProfile = useCallback(async () => {
    if (!isLoaded) return

    if (!isSignedIn) {
      setProfile(defaultProfile)
      setProfileLoading(false)
      setProfileError(null)
      return
    }

    try {
      setProfileLoading(true)
      setProfileError(null)

      const token = await getToken()

      if (!token) {
        throw new Error('Unable to get authentication token.')
      }

      const response = await getMyProfile(token)
      const mongoUser = response.user || {}

      setProfile({
        ...defaultProfile,
        ...mongoUser,
        name: mongoUser.name || user?.fullName || '',
        email:
          mongoUser.email ||
          user?.primaryEmailAddress?.emailAddress ||
          '',
        skills: mongoUser.skills || [],
        interests: mongoUser.interests || [],
      })
    } catch (error) {
      console.error('Profile loading error:', error)

      setProfileError(
        error.response?.data?.message ||
        error.message ||
        'Unable to load your profile.'
      )
    } finally {
      setProfileLoading(false)
    }
  }, [isLoaded, isSignedIn, getToken, user])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  // Save profile to MongoDB
  const saveProfile = async (profileData) => {
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication token is unavailable.')
    }

    const response = await updateMyProfile(profileData, token)

    if (!response.user) {
      throw new Error('The server did not return the updated profile.')
    }

    setProfile({
      ...defaultProfile,
      ...response.user,
      skills: response.user.skills || [],
      interests: response.user.interests || [],
    })

    return response.user
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        saveProfile,
        refreshProfile,
        profileLoading,
        profileError,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider')
  }

  return context
}
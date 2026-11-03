
import User from '../models/User.js'

const defaultSettings = {
  emailNotifications: true,
  eventReminders: true,
  resourceUpdates: true,
  weeklyDigest: false,
  profileVisibility: 'campus',
}

export const getMySettings = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: req.auth.userId },
      { $setOnInsert: { clerkId: req.auth.userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).select('settings')
    res.json({ success: true, settings: { ...defaultSettings, ...(user.settings?.toObject?.() || user.settings || {}) } })
  } catch (error) { next(error) }
}

export const updateMySettings = async (req, res, next) => {
  try {
    const allowed = ['emailNotifications', 'eventReminders', 'resourceUpdates', 'weeklyDigest']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (typeof req.body[key] !== 'boolean') return res.status(400).json({ success: false, message: `${key} must be true or false.` })
        updates[`settings.${key}`] = req.body[key]
      }
    }
    if (req.body.profileVisibility !== undefined) {
      if (!['campus', 'private'].includes(req.body.profileVisibility)) return res.status(400).json({ success: false, message: 'Invalid profile visibility.' })
      updates['settings.profileVisibility'] = req.body.profileVisibility
    }
    const user = await User.findOneAndUpdate(
      { clerkId: req.auth.userId },
      { $set: updates, $setOnInsert: { clerkId: req.auth.userId } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).select('settings')
    res.json({ success: true, message: 'Settings saved.', settings: { ...defaultSettings, ...(user.settings?.toObject?.() || user.settings || {}) } })
  } catch (error) { next(error) }
}

// Get logged-in user's profile
export const getMyProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId

    let user = await User.findOne({ clerkId })

    // Create profile if it doesn't exist
    if (!user) {
      user = await User.create({
        clerkId,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      user,
    })
  } catch (error) {
    console.error('Get profile error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch profile',
      error: error.message,
    })
  }
}

// Update logged-in user's profile
export const updateMyProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId

    const allowedFields = [
      'name',
      'headline',
      'email',
      'phone',
      'location',
      'course',
      'department',
      'year',
      'college',
      'bio',
      'skills',
      'interests',
      'github',
      'linkedin',
      'website',
      'avatar',
    ]

    const updates = {}

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: updates,
        $setOnInsert: { clerkId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    })
  } catch (error) {
    console.error('Update profile error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to update profile',
      error: error.message,
    })
  }
}

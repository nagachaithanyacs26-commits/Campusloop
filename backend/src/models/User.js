
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      default: 'Student User',
      trim: true,
    },

    headline: {
      type: String,
      default: 'Student at CampusLoop',
    },

    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    course: {
      type: String,
      default: '',
    },

    department: {
      type: String,
      default: '',
    },

    year: {
      type: String,
      default: '',
    },

    college: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: '',
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: '',
    },

    linkedin: {
      type: String,
      default: '',
    },

    website: {
      type: String,
      default: '',
    },

    avatar: {
      type: String,
      default: '',
    },

    settings: {
      emailNotifications: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: true },
      resourceUpdates: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      profileVisibility: { type: String, enum: ['campus', 'private'], default: 'campus' },
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User

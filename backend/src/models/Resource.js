
import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Electronics',
        'Books',
        'Stationery',
        'Study Materials',
      ],
    },

    type: {
      type: String,
      required: true,
      enum: ['Borrow', 'Share'],
    },

    status: {
      type: String,
      enum: ['Available', 'Unavailable'],
      default: 'Available',
    },

    owner: {
      type: String,
      required: true,
      trim: true,
    },

    ownerClerkId: {
      type: String,
      required: true,
      index: true,
    },

    department: {
      type: String,
      default: 'Student',
      trim: true,
    },

    condition: {
      type: String,
      default: 'Good',
    },

    icon: {
      type: String,
      default: 'Package',
    },

    color: {
      type: String,
      default: 'bg-indigo-100 text-indigo-600',
    },

    initials: {
      type: String,
      default: 'ST',
    },

    dueInfo: {
      type: String,
      default: 'Available now',
    },
  },
  {
    timestamps: true,
  }
)

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource

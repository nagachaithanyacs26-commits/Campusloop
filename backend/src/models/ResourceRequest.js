import mongoose from 'mongoose'

const resourceRequestSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },

    requesterClerkId: {
      type: String,
      required: true,
      index: true,
    },

    requesterName: {
      type: String,
      required: true,
    },

    ownerClerkId: {
      type: String,
      required: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate requests from the same student
// for the same resource.
resourceRequestSchema.index(
  {
    resourceId: 1,
    requesterClerkId: 1,
  },
  {
    unique: true,
  }
)

const ResourceRequest = mongoose.model(
  'ResourceRequest',
  resourceRequestSchema
)

export default ResourceRequest
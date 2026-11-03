import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    authorClerkId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      default: 'Student',
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
)

const postSchema = new mongoose.Schema(
  {
    authorClerkId: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    initials: {
      type: String,
      default: 'ST',
    },
    department: {
      type: String,
      default: 'Campus Member',
    },
    avatar: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Academic', 'Announcement', 'General'],
      default: 'General',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.model('Post', postSchema)

export default Post
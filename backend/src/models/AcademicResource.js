
import mongoose from 'mongoose'

const academicResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Notes',
        'Previous Papers',
        'Assignments',
        'Books',
        'Presentations',
        'Study Guides',
        'Other',
      ],
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
      default: '',
    },

    semester: {
      type: String,
      trim: true,
      default: '',
    },

    resourceUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      trim: true,
      default: '',
    },

    uploaderClerkId: {
      type: String,
      required: true,
      index: true,
    },

    uploaderName: {
      type: String,
      required: true,
      trim: true,
    },

    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

academicResourceSchema.index({
  subject: 1,
  semester: 1,
  department: 1,
})

const AcademicResource = mongoose.model(
  'AcademicResource',
  academicResourceSchema,
)

export default AcademicResource

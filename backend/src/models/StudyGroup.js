import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  schedule: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  capacity: { type: Number, default: 15, min: 1 },
  level: { type: String, default: 'All Levels' },
  members: { type: [String], default: [] },
  ownerClerkId: { type: String, required: true, index: true },
}, { timestamps: true })

export default mongoose.models.StudyGroup || mongoose.model('StudyGroup', groupSchema)

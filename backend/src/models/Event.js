import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  category: { type: String, default: 'General', trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  organizer: { type: String, default: 'Student Community', trim: true },
  capacity: { type: Number, default: 50, min: 1 },
  attendees: { type: [String], default: [] },
  ownerClerkId: { type: String, required: true, index: true },
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model('Event', eventSchema)

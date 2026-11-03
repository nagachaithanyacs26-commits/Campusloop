import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true, index: true },
  recipientId: { type: String, required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 5000 },
  readAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.models.Message || mongoose.model('Message', messageSchema)

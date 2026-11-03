import mongoose from 'mongoose'
const bookingSchema = new mongoose.Schema({ userId: { type: String, required: true, index: true }, facility: { type: String, required: true, trim: true }, date: { type: String, required: true }, time: { type: String, required: true }, purpose: { type: String, trim: true, maxlength: 1000 }, status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' } }, { timestamps: true })
export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

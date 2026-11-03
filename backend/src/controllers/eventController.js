import { getAuth } from '@clerk/express'
import mongoose from 'mongoose'
import Event from '../models/Event.js'

const shape = (event, userId) => ({ ...event.toObject(), id: event._id.toString(), attendees: event.attendees.length, registered: Boolean(userId && event.attendees.includes(userId)) })
export const listEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1, createdAt: -1 })
    const uniqueEvents = []
    const seen = new Set()
    for (const event of events) {
      const key = `${event.title.trim().toLocaleLowerCase()}|${event.date}`
      if (seen.has(key)) continue
      seen.add(key)
      uniqueEvents.push(shape(event, req.auth?.userId))
    }
    res.json({ success: true, events: uniqueEvents })
  } catch (error) { next(error) }
}

export const createEvent = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const title = req.body.title?.trim()
    const existing = title && req.body.date
      ? await Event.findOne({ date: req.body.date, title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
      : null
    if (existing) return res.status(409).json({ success: false, message: 'An event with this title and date already exists.' })
    const event = await Event.create({ ...req.body, ownerClerkId: userId })
    res.status(201).json({ success: true, event: shape(event, userId) })
  } catch (error) { next(error) }
}
export const registerEvent = async (req, res, next) => { try { const { userId } = getAuth(req); if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid event ID.' }); const event = await Event.findById(req.params.id); if (!event) return res.status(404).json({ success: false, message: 'Event not found.' }); const registered = event.attendees.includes(userId); if (registered) event.attendees.pull(userId); else { if (event.attendees.length >= event.capacity) return res.status(409).json({ success: false, message: 'This event is full.' }); event.attendees.addToSet(userId) } await event.save(); res.json({ success: true, event: shape(event, userId) }) } catch (error) { next(error) } }

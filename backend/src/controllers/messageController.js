import { getAuth } from '@clerk/express'
import User from '../models/User.js'
import Message from '../models/Message.js'

export const listConversations = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const messages = await Message.find({ $or: [{ senderId: userId }, { recipientId: userId }] }).sort({ createdAt: -1 }).limit(500).lean()
    const latest = new Map()
    for (const message of messages) {
      const otherId = message.senderId === userId ? message.recipientId : message.senderId
      if (!latest.has(otherId)) latest.set(otherId, { ...message, otherId })
    }
    const users = await User.find({ clerkId: { $in: [...latest.keys()] } }).lean()
    const userMap = new Map(users.map((user) => [user.clerkId, user]))
    res.json({ success: true, conversations: [...latest.values()].map((message) => {
      const person = userMap.get(message.otherId) || {}
      const name = person.name || 'Campus Member'
      return { id: message.otherId, name, initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), course: person.department || 'Campus Member', lastMessage: message.text, time: message.createdAt, unread: 0 }
    }) })
  } catch (error) { next(error) }
}

export const getConversation = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const messages = await Message.find({ $or: [{ senderId: userId, recipientId: req.params.userId }, { senderId: req.params.userId, recipientId: userId }] }).sort({ createdAt: 1 }).limit(500).lean()
    res.json({ success: true, messages: messages.map((message) => ({ id: message._id, text: message.text, time: message.createdAt, sender: message.senderId === userId ? 'me' : 'them' })) })
  } catch (error) { next(error) }
}

export const sendMessage = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const text = req.body.text?.trim()
    if (!text) return res.status(400).json({ success: false, message: 'Message text is required.' })
    if (req.params.userId === userId) return res.status(400).json({ success: false, message: 'You cannot message yourself.' })
    const message = await Message.create({ senderId: userId, recipientId: req.params.userId, text })
    res.status(201).json({ success: true, message: { id: message._id, text: message.text, time: message.createdAt, sender: 'me' } })
  } catch (error) { next(error) }
}

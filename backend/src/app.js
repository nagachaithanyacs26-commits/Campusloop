import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

import userRoutes from './routes/userRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import resourceRoutes from './routes/resourceRoutes.js'
import resourceRequestRoutes from './routes/resourceRequestRoutes.js'
import academicResourceRoutes from './routes/academicResourceRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import postRoutes from './routes/postRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import lostFoundRoutes from './routes/lostFoundRoutes.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Makes Clerk authentication available to Express routes.
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CampusLoop API',
  })
})

app.use('/api/health', healthRoutes)
app.use('/api/users', userRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/resource-requests', resourceRequestRoutes)
app.use('/api/academic-resources', academicResourceRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/lost-found', lostFoundRoutes)

// Not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  })
})

// General error handler
app.use((error, req, res, next) => {
  console.error(error)

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  })
})

export default app

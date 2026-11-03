
import 'dotenv/config'

import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from backend .env')
    }

    if (
      !process.env.CLERK_SECRET_KEY ||
      !process.env.CLERK_PUBLISHABLE_KEY
    ) {
      throw new Error('Clerk keys are missing from backend .env')
    }

    await connectDB()

    app.listen(PORT, () => {
      console.log(`CampusLoop backend running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()

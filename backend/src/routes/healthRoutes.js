
import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusLoop backend is running!',
    database: 'MongoDB',
  })
})

export default router

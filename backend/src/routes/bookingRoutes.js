import express from 'express'
import clerkAuth from '../middleware/clerkAuth.js'
import { listBookings, createBooking, cancelBooking } from '../controllers/campusServiceController.js'
const router = express.Router()
router.use(clerkAuth)
router.get('/', listBookings)
router.post('/', createBooking)
router.patch('/:id/cancel', cancelBooking)
export default router

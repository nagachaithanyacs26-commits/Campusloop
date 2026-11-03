import express from 'express'
import clerkAuth from '../middleware/clerkAuth.js'
import { listEvents, createEvent, registerEvent } from '../controllers/eventController.js'
const router = express.Router()
router.get('/', listEvents)
router.post('/', clerkAuth, createEvent)
router.patch('/:id/register', clerkAuth, registerEvent)
export default router

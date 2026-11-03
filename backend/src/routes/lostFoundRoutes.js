import express from 'express'
import clerkAuth from '../middleware/clerkAuth.js'
import { listLostFound, createLostFound, resolveLostFound } from '../controllers/campusServiceController.js'
const router = express.Router()
router.get('/', clerkAuth, listLostFound)
router.post('/', clerkAuth, createLostFound)
router.patch('/:id/resolve', clerkAuth, resolveLostFound)
export default router

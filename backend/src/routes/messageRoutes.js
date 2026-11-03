import express from 'express'
import clerkAuth from '../middleware/clerkAuth.js'
import { listConversations, getConversation, sendMessage } from '../controllers/messageController.js'

const router = express.Router()
router.use(clerkAuth)
router.get('/', listConversations)
router.get('/:userId', getConversation)
router.post('/:userId', sendMessage)
export default router

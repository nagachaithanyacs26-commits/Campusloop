import express from 'express'
import clerkAuth from '../middleware/clerkAuth.js'
import { listGroups, createGroup, toggleGroupMembership } from '../controllers/groupController.js'
const router = express.Router()
router.get('/', listGroups)
router.post('/', clerkAuth, createGroup)
router.patch('/:id/membership', clerkAuth, toggleGroupMembership)
export default router

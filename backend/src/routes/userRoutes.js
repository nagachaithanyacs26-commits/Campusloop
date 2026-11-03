
import express from 'express'

import clerkAuth from '../middleware/clerkAuth.js'

import {
  getMyProfile,
  updateMyProfile,
  getMySettings,
  updateMySettings,
} from '../controllers/userController.js'

const router = express.Router()

router.get('/me', clerkAuth, getMyProfile)

router.put('/me', clerkAuth, updateMyProfile)
router.get('/settings', clerkAuth, getMySettings)
router.put('/settings', clerkAuth, updateMySettings)

export default router

import express from 'express'
import clerkAuth from '../middleware/clerkAuth.js'

import {
  createResourceRequest,
  getMyResourceRequests,
  updateResourceRequestStatus,
} from '../controllers/resourceRequestController.js'

const router = express.Router()

// Send a resource request
router.post('/', clerkAuth, createResourceRequest)

// Get requests sent and received by the logged-in user
router.get('/my-requests', clerkAuth, getMyResourceRequests)

// Approve or reject a request
router.patch('/:id/status', clerkAuth, updateResourceRequestStatus)

export default router
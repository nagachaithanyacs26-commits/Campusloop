
import express from 'express'

import clerkAuth from '../middleware/clerkAuth.js'

import {
  getAcademicResources,
  createAcademicResource,
  deleteAcademicResource,
  downloadAcademicResource,
} from '../controllers/academicResourceController.js'

const router = express.Router()

// Get all academic resources (public to signed-in or anonymous visitors)
router.get('/', getAcademicResources)

// Add an academic resource
router.post('/', clerkAuth, createAcademicResource)

// Delete an uploaded academic resource
router.delete('/:id', clerkAuth, deleteAcademicResource)

// Track a resource download
router.post('/:id/download', downloadAcademicResource)

export default router

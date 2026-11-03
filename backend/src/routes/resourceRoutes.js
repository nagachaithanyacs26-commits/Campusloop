import express from 'express'

import clerkAuth from '../middleware/clerkAuth.js'

import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js'

const router = express.Router()

// Get all resources (public)
router.get('/', getResources)

// Add a resource (login required)
router.post('/', clerkAuth, createResource)

// Update a resource (login required)
router.put('/:id', clerkAuth, updateResource)

// Delete a resource (login required)
router.delete('/:id', clerkAuth, deleteResource)

export default router
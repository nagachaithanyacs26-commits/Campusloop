import express from 'express'

import clerkAuth from '../middleware/clerkAuth.js'

import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
} from '../controllers/postController.js'

const router = express.Router()

// Get all posts (public)
router.get('/', getPosts)

// Create a post (login required)
router.post('/', clerkAuth, createPost)

// Like or unlike a post (login required)
router.patch('/:id/like', clerkAuth, toggleLike)

// Add a comment (login required)
router.post('/:id/comments', clerkAuth, addComment)

export default router
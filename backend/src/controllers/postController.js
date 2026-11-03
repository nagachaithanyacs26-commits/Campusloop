import { getAuth } from '@clerk/express'
import mongoose from 'mongoose'

import Post from '../models/Post.js'
import User from '../models/User.js'

// GET all posts
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean()

    const formattedPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      liked: req.auth?.userId
        ? post.likes.includes(req.auth.userId)
        : false,
      comments: post.comments.length,
    }))

    res.status(200).json({
      success: true,
      posts: formattedPosts,
    })
  } catch (error) {
    next(error)
  }
}

// CREATE a post
export const createPost = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to create a post.',
      })
    }

    const { title, content, category } = req.body

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      })
    }

    const allowedCategories = [
      'Academic',
      'Announcement',
      'General',
    ]

    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post category.',
      })
    }

    const user = await User.findOne({ clerkId: userId })

    const authorName = user?.name || 'Student'

    const initials = authorName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const post = await Post.create({
      authorClerkId: userId,
      author: authorName,
      initials: initials || 'ST',
      department: user?.department || 'Campus Member',
      avatar: user?.avatar || '',
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
    })

    res.status(201).json({
      success: true,
      message: 'Post published successfully.',
      post: {
        ...post.toObject(),
        likes: 0,
        liked: false,
        comments: 0,
      },
    })
  } catch (error) {
    next(error)
  }
}

// LIKE OR UNLIKE a post
export const toggleLike = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to like a post.',
      })
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID.',
      })
    }

    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    const alreadyLiked = post.likes.includes(userId)

    if (alreadyLiked) {
      post.likes.pull(userId)
    } else {
      post.likes.addToSet(userId)
    }

    await post.save()

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: post.likes.length,
      message: alreadyLiked
        ? 'Like removed.'
        : 'Post liked successfully.',
    })
  } catch (error) {
    next(error)
  }
}

// ADD a comment
export const addComment = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const { id } = req.params
    const { content } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to comment.',
      })
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID.',
      })
    }

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty.',
      })
    }

    const user = await User.findOne({ clerkId: userId })

    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    post.comments.push({
      authorClerkId: userId,
      authorName: user?.name || 'Student',
      content: content.trim(),
    })

    await post.save()

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comments: post.comments.length,
      comment: post.comments[post.comments.length - 1],
    })
  } catch (error) {
    next(error)
  }
}
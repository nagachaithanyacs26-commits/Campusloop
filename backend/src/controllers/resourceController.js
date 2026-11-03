import { getAuth } from '@clerk/express'
import mongoose from 'mongoose'
import Resource from '../models/Resource.js'
import User from '../models/User.js'

// Get all resources
export const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      resources,
    })
  } catch (error) {
    next(error)
  }
}

// Add a new resource
export const createResource = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to add a resource.',
      })
    }

    const {
      title,
      description,
      category,
      type,
      condition,
      dueInfo,
    } = req.body

    if (!title || !description || !category || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required resource details.',
      })
    }

    const user = await User.findOne({ clerkId: userId })

    const ownerName = user?.name || 'Student'
    const department = user?.department || 'Student'

    const initials = ownerName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      condition: condition || 'Good',
      dueInfo: dueInfo || 'Available now',
      owner: ownerName,
      ownerClerkId: userId,
      department,
      initials: initials || 'ST',
    })

    res.status(201).json({
      success: true,
      message: 'Resource added successfully',
      resource,
    })
  } catch (error) {
    next(error)
  }
}

// Update a resource
export const updateResource = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in.',
      })
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID.',
      })
    }

    const allowedFields = [
      'title',
      'description',
      'category',
      'type',
      'status',
      'condition',
      'dueInfo',
    ]

    const updates = {}

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    const resource = await Resource.findOneAndUpdate(
      {
        _id: id,
        ownerClerkId: userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or you cannot update it.',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      resource,
    })
  } catch (error) {
    next(error)
  }
}

// Delete a resource
export const deleteResource = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in.',
      })
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID.',
      })
    }

    const resource = await Resource.findOneAndDelete({
      _id: id,
      ownerClerkId: userId,
    })

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or you cannot delete it.',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

import { getAuth } from '@clerk/express'
import mongoose from 'mongoose'

import AcademicResource from '../models/AcademicResource.js'
import User from '../models/User.js'

// GET all academic resources
export const getAcademicResources = async (req, res, next) => {
  try {
    const {
      category,
      subject,
      department,
      semester,
      search,
    } = req.query

    const filter = {}

    if (category) filter.category = category

    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' }
    }

    if (department) {
      filter.department = { $regex: department, $options: 'i' }
    }

    if (semester) filter.semester = semester

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ]
    }

    const resources = await AcademicResource.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    })
  } catch (error) {
    next(error)
  }
}

// CREATE an academic resource
export const createAcademicResource = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to add an academic resource.',
      })
    }

    const {
      title,
      description,
      category,
      subject,
      department,
      semester,
      resourceUrl,
      fileName,
    } = req.body

    if (!title || !category || !subject || !resourceUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, subject, and resource URL are required.',
      })
    }

    const allowedCategories = [
      'Notes',
      'Previous Papers',
      'Assignments',
      'Books',
      'Presentations',
      'Study Guides',
      'Other',
    ]

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid academic resource category.',
      })
    }

    let parsedUrl

    try {
      parsedUrl = new URL(resourceUrl)
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resource URL.',
      })
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: 'Resource URL must use HTTP or HTTPS.',
      })
    }

    // Find the MongoDB user profile if it exists.
    // A profile is not required to publish a resource.
    const user = await User.findOne({ clerkId: userId })

    const uploaderName = user?.name || 'Student'

    const resource = await AcademicResource.create({
      title: title.trim(),
      description: description?.trim() || '',
      category,
      subject: subject.trim(),
      department: department?.trim() || '',
      semester: semester?.trim() || '',
      resourceUrl: resourceUrl.trim(),
      fileName: fileName?.trim() || '',
      uploaderClerkId: userId,
      uploaderName,
    })

    res.status(201).json({
      success: true,
      message: 'Academic resource added successfully.',
      resource,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE an academic resource
export const deleteAcademicResource = async (req, res, next) => {
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

    const resource = await AcademicResource.findById(id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Academic resource not found.',
      })
    }

    if (resource.uploaderClerkId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete resources uploaded by you.',
      })
    }

    await resource.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Academic resource deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

// INCREMENT resource download count
export const downloadAcademicResource = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID.',
      })
    }

    const resource = await AcademicResource.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true },
    )

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Academic resource not found.',
      })
    }

    res.status(200).json({
      success: true,
      resourceUrl: resource.resourceUrl,
      downloads: resource.downloads,
    })
  } catch (error) {
    next(error)
  }
}

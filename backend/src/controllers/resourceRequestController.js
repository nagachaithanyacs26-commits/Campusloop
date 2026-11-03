import { getAuth } from '@clerk/express'
import mongoose from 'mongoose'

import Resource from '../models/Resource.js'
import ResourceRequest from '../models/ResourceRequest.js'
import User from '../models/User.js'

// POST: Send a request for a resource
export const createResourceRequest = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const { resourceId, message } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to request a resource.',
      })
    }

    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID.',
      })
    }

    const resource = await Resource.findById(resourceId)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      })
    }

    if (resource.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'This resource is currently unavailable.',
      })
    }

    if (resource.ownerClerkId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request your own resource.',
      })
    }

    const user = await User.findOne({ clerkId: userId })

    const requesterName = user?.name || 'Student'

    const request = await ResourceRequest.create({
      resourceId: resource._id,
      requesterClerkId: userId,
      requesterName,
      ownerClerkId: resource.ownerClerkId,
      message: message || '',
    })

    res.status(201).json({
      success: true,
      message: 'Resource request sent successfully.',
      request,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already requested this resource.',
      })
    }

    next(error)
  }
}

// GET: View requests sent and received by the logged-in user
export const getMyResourceRequests = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in.',
      })
    }

    const [sentRequests, receivedRequests] = await Promise.all([
      ResourceRequest.find({
        requesterClerkId: userId,
      })
        .populate('resourceId')
        .sort({ createdAt: -1 }),

      ResourceRequest.find({
        ownerClerkId: userId,
      })
        .populate('resourceId')
        .sort({ createdAt: -1 }),
    ])

    res.status(200).json({
      success: true,
      sentRequests,
      receivedRequests,
    })
  } catch (error) {
    next(error)
  }
}

// PATCH: Approve or reject a received request
export const updateResourceRequestStatus = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    const { id } = req.params
    const { status } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in.',
      })
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID.',
      })
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Approved or Rejected.',
      })
    }

    const request = await ResourceRequest.findOne({
      _id: id,
      ownerClerkId: userId,
    })

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or you are not its owner.',
      })
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed.',
      })
    }

    request.status = status
    await request.save()

    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully.`,
      request,
    })
  } catch (error) {
    next(error)
  }
}
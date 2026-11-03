import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// PROFILE APIs
export const getMyProfile = async (token) => {
  const response = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateMyProfile = async (profileData, token) => {
  const response = await api.put('/users/me', profileData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const getMySettings = async (token) => (await api.get('/users/settings', { headers: { Authorization: `Bearer ${token}` } })).data
export const updateMySettings = async (settings, token) => (await api.put('/users/settings', settings, { headers: { Authorization: `Bearer ${token}` } })).data

// RESOURCE EXCHANGE APIs
export const getResources = async () => {
  const response = await api.get('/resources')
  return response.data
}

export const createResource = async (resourceData, token) => {
  const response = await api.post('/resources', resourceData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateResource = async (id, resourceData, token) => {
  const response = await api.put(`/resources/${id}`, resourceData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const deleteResource = async (id, token) => {
  const response = await api.delete(`/resources/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// RESOURCE REQUEST APIs
export const createResourceRequest = async (requestData, token) => {
  const response = await api.post('/resource-requests', requestData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const getMyResourceRequests = async (token) => {
  const response = await api.get('/resource-requests/my-requests', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateResourceRequestStatus = async (id, status, token) => {
  const response = await api.patch(
    `/resource-requests/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return response.data
}

// ACADEMIC RESOURCES APIs
export const getAcademicResources = async (filters = {}) => {
  const response = await api.get('/academic-resources', {
    params: filters,
  })
  return response.data
}

export const createAcademicResource = async (resourceData, token) => {
  const response = await api.post('/academic-resources', resourceData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const deleteAcademicResource = async (id, token) => {
  const response = await api.delete(`/academic-resources/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const downloadAcademicResource = async (id) => {
  const response = await api.post(`/academic-resources/${id}/download`)
  return response.data
}

// AI CHATBOT API
export const sendChatMessage = async (message, history = []) => {
  const response = await api.post('/chat', { message, history })
  return response.data
}

// CAMPUS FEED APIs

// Fetch all posts
export const getCampusPosts = async (token) => {
  const response = await api.get('/posts', {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  })
  return { ...response.data, posts: (response.data.posts || []).map((post) => ({ ...post, id: post.id || post._id })) }
}

// Create a post
export const createCampusPost = async (postData, token) => {
  const response = await api.post('/posts', postData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return { ...response.data, post: { ...response.data.post, id: response.data.post?.id || response.data.post?._id } }
}

// Like or unlike a post
export const toggleCampusPostLike = async (postId, token) => {
  const response = await api.patch(
    `/posts/${postId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

// Add a comment
export const addCampusPostComment = async (postId, content, token) => {
  const response = await api.post(
    `/posts/${postId}/comments`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

export const getEvents = async (token) => (await api.get('/events', { headers: token ? { Authorization: `Bearer ${token}` } : {} })).data
export const createEvent = async (data, token) => (await api.post('/events', data, { headers: { Authorization: `Bearer ${token}` } })).data
export const toggleEventRegistration = async (id, token) => (await api.patch(`/events/${id}/register`, {}, { headers: { Authorization: `Bearer ${token}` } })).data
export const getStudyGroups = async (token) => (await api.get('/groups', { headers: token ? { Authorization: `Bearer ${token}` } : {} })).data
export const createStudyGroup = async (data, token) => (await api.post('/groups', data, { headers: { Authorization: `Bearer ${token}` } })).data
export const toggleStudyGroupMembership = async (id, token) => (await api.patch(`/groups/${id}/membership`, {}, { headers: { Authorization: `Bearer ${token}` } })).data
export const getConversations = async (token) => (await api.get('/messages', { headers: { Authorization: `Bearer ${token}` } })).data
export const getConversationMessages = async (userId, token) => (await api.get(`/messages/${userId}`, { headers: { Authorization: `Bearer ${token}` } })).data
export const sendDirectMessage = async (userId, text, token) => (await api.post(`/messages/${userId}`, { text }, { headers: { Authorization: `Bearer ${token}` } })).data
export const getBookings = async (token) => (await api.get('/bookings', { headers: { Authorization: `Bearer ${token}` } })).data
export const createBooking = async (data, token) => (await api.post('/bookings', data, { headers: { Authorization: `Bearer ${token}` } })).data
export const cancelBooking = async (id, token) => (await api.patch(`/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })).data
export const getLostFoundItems = async (token) => (await api.get('/lost-found', { headers: { Authorization: `Bearer ${token}` } })).data
export const createLostFoundItem = async (data, token) => (await api.post('/lost-found', data, { headers: { Authorization: `Bearer ${token}` } })).data
export const resolveLostFoundItem = async (id, token) => (await api.patch(`/lost-found/${id}/resolve`, {}, { headers: { Authorization: `Bearer ${token}` } })).data

export default api

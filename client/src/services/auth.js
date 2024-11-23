import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
console.log('API URL:', API_URL)

const register = async (data) => {
  try {
    const formData = new FormData()

    // Add form data to formData (both text and file)
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })

    // Send the formData as multipart/form-data
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log('response:', response)
    return response.data
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : 'Registration failed'
    )
  }
}

const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : 'Login failed'
    )
  }
}

const authenticate = async (data, isRegister) => {
  return isRegister ? await register(data) : await login(data)
}

const setUserToken = (token) => {
  localStorage.setItem('token', token)
}

const getUserToken = () => {
  return localStorage.getItem('token')
}

const setUserData = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

const getUserData = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      // Decode the JWT to extract the user_id
      const decodedToken = jwt_decode(token)
      console.log('Decoded Token:', decodedToken)
      const user_id = decodedToken.user_id // Adjust this according to the token's structure

      // Fetch user profile from backend using the extracted user_id
      const response = await axios.get(`${API_URL}/user/${user_id}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token for authorization
        }
      })

      console.log('User Profile:', response.data)
      return response.data // This will be the user profile from the backend
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }
  return null
}

const isLoggedIn = () => {
  return !!getUserToken()
}

const isAdmin = () => {
  const user = getUserData()
  return user ? user.is_admin : false
}

export {
  register,
  login,
  authenticate,
  setUserToken,
  getUserToken,
  setUserData,
  getUserData,
  isLoggedIn,
  isAdmin
}

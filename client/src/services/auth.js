import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
console.log('API URL:', API_URL)
const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data)
    console.log('resonse:', response)
    return response.data
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : 'Registration failed'
    )
  }
}

const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data)
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

const getUserData = () => {
  return JSON.parse(localStorage.getItem('user'))
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

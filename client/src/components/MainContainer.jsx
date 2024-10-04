import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import Login from '../pages/Login'
import HomePage from '../pages/HomePage'
import NavBar from '../pages/NavBar'
import Register from '../pages/Register'
import Profile from '../pages/Profile'

const MainContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <Router>
      <Box>
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onSuccess={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onSuccess={handleLogin} />}
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default MainContainer

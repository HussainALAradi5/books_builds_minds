import { Box, Heading, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getUserToken, getUserData } from '../services/auth'

const Profile = () => {
  const [user, setUser] = useState(null)
  const token = getUserToken()

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          // Fetch the user data by using the user's ID
          const userData = await getUserData(token) // Assuming user ID is in token or saved user data
          if (userData) {
            setUser(userData)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    fetchUserData()
  }, [token])

  if (!user) {
    return (
      <Box p={6}>
        <Heading as="h2">Profile</Heading>
        <Text>No user information available.</Text>
      </Box>
    )
  }

  return (
    <Box p={6}>
      <Heading as="h2" mb={4}>
        Hi {user.user_name} 😁
      </Heading>
      <Text fontWeight="bold">User Name:</Text>
      <Text mb={4}>{user.user_name}</Text>
      <Text fontWeight="bold">Email:</Text>
      <Text mb={4}>{user.email}</Text>
    </Box>
  )
}

export default Profile

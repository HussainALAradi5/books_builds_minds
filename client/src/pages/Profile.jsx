import { Box, Heading, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getUserData } from '../services/auth'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = getUserData()
    if (userData) {
      setUser(userData)
    }
  }, [])

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
        Hi {user.user_name}😁
      </Heading>
      <Text fontWeight="bold">User Name:</Text>
      <Text mb={4}>{user.user_name}</Text>
      <Text fontWeight="bold">Email:</Text>
      <Text mb={4}>{user.email}</Text>
    </Box>
  )
}

export default Profile

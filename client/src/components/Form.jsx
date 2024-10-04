import {
  Box,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  useColorMode
} from '@chakra-ui/react'
import { useState } from 'react'
import { authenticate, setUserToken, setUserData } from '../services/auth'
import Button from '../components/Button'

const Form = ({ isRegister }) => {
  const toast = useToast()
  const { colorMode } = useColorMode()
  const [formData, setFormData] = useState({
    user_name_or_email: '',
    password: '',
    email: '',
    user_name: ''
  })

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await authenticate(formData, isRegister)
      toast({
        title: response.message,
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      if (isRegister) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 4000)
      } else {
        window.location.href = '/profile'
      }

      setUserToken(response.token)
      setUserData(response.user)
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      p={6}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      mt={8}
      bg={
        colorMode === 'dark'
          ? 'rgba(30, 30, 30, 0.8)'
          : 'rgba(255, 255, 255, 0.1)'
      }
      borderColor={
        colorMode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
      }
    >
      <Heading
        as="h3"
        size="lg"
        textAlign="center"
        mb={4}
        color={colorMode === 'dark' ? 'white' : 'black'}
      >
        {isRegister ? 'Register' : 'Login'}
      </Heading>
      <FormControl as="form" onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <FormLabel color={colorMode === 'dark' ? 'white' : 'black'}>
              User Name
            </FormLabel>
            <Input
              name="user_name"
              onChange={handleChange}
              required
              mb={4}
              variant="flushed"
              placeholder="Enter your username"
              color={colorMode === 'dark' ? 'white' : 'black'}
            />
            <FormLabel color={colorMode === 'dark' ? 'white' : 'black'}>
              Email
            </FormLabel>
            <Input
              name="email"
              type="email"
              onChange={handleChange}
              required
              mb={4}
              variant="flushed"
              placeholder="Enter your email"
              color={colorMode === 'dark' ? 'white' : 'black'}
            />
          </>
        )}
        {!isRegister && (
          <>
            <FormLabel color={colorMode === 'dark' ? 'white' : 'black'}>
              User Name or Email
            </FormLabel>
            <Input
              name="user_name_or_email"
              onChange={handleChange}
              required
              mb={4}
              variant="flushed"
              placeholder="Enter your username or email"
              color={colorMode === 'dark' ? 'white' : 'black'}
            />
          </>
        )}
        <FormLabel color={colorMode === 'dark' ? 'white' : 'black'}>
          Password
        </FormLabel>
        <Input
          name="password"
          type="password"
          onChange={handleChange}
          required
          mb={4}
          variant="flushed"
          placeholder="Enter your password"
          color={colorMode === 'dark' ? 'white' : 'black'}
        />
        <Button mt={4} type="submit" width="full">
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </FormControl>
    </Box>
  )
}

export default Form

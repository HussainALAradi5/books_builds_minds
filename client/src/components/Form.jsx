import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useColorMode,
  Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { authenticate, setUserToken, setUserData } from '../services/auth'
import Button from '../components/Button'
import Notifications from './Notifications'
import UserAvatar from './UserAvatar'

const Form = ({ isRegister }) => {
  const { colorMode } = useColorMode()
  const [formData, setFormData] = useState({
    user_name_or_email: '',
    password: '',
    email: '',
    user_name: '',
    user_image: null
  })

  const [notification, setNotification] = useState({
    title: '',
    description: '',
    status: ''
  })

  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleImageUpload = (file) => {
    setFormData((prevState) => ({
      ...prevState,
      user_image: file
    }))
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const dataToSend = new FormData()

    // Append form data to FormData object if there's a file
    for (const key in formData) {
      dataToSend.append(key, formData[key])
    }

    for (const [key, value] of dataToSend.entries()) {
      console.log(key, value)
    }

    try {
      // Determine whether to send FormData or JSON based on presence of file
      const response = await authenticate(formData, isRegister) // Pass formData directly here
      setNotification({
        title: isRegister ? 'Registration Successful' : 'Login Successful',
        description: '',
        status: 'success'
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
      setNotification({
        title: 'An error occurred',
        description: error.message || 'Something went wrong.',
        status: 'error'
      })
    }
  }
  const boxStyle = {
    maxWidth: '400px',
    mx: 'auto',
    p: 6,
    borderWidth: 1,
    borderRadius: 'md',
    boxShadow: 'md',
    mt: 8,
    bg:
      colorMode === 'dark'
        ? 'rgba(30, 30, 30, 0.8)'
        : 'rgba(255, 255, 255, 0.1)',
    borderColor:
      colorMode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
  }

  const headingStyle = {
    as: 'h3',
    size: 'lg',
    textAlign: 'center',
    mb: 4,
    color: colorMode === 'dark' ? 'white' : 'black'
  }

  const formLabelStyle = {
    color: colorMode === 'dark' ? 'white' : 'black'
  }

  const inputStyle = {
    color: colorMode === 'dark' ? 'white' : 'black',
    mb: 4,
    variant: 'flushed'
  }

  return (
    <Box {...boxStyle}>
      <Heading {...headingStyle}>{isRegister ? 'Register' : 'Login'}</Heading>
      <FormControl as="form" onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <FormLabel {...formLabelStyle}>User Name</FormLabel>
            <Input
              name="user_name"
              onChange={handleChange}
              required
              placeholder="Enter your username"
              {...inputStyle}
            />
            <FormLabel {...formLabelStyle}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              onChange={handleChange}
              required
              placeholder="Enter your email"
              {...inputStyle}
            />
            <FormLabel {...formLabelStyle}>
              User Image (this is optional)
            </FormLabel>
            <UserAvatar
              name={formData.user_name || 'User'}
              onImageUpload={handleImageUpload}
            />

            {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          </>
        )}
        {!isRegister && (
          <>
            <FormLabel {...formLabelStyle}>User Name or Email</FormLabel>
            <Input
              name="user_name_or_email"
              onChange={handleChange}
              required
              placeholder="Enter your username or email"
              {...inputStyle}
            />
          </>
        )}
        <FormLabel {...formLabelStyle}>Password</FormLabel>
        <Input
          name="password"
          type="password"
          onChange={handleChange}
          required
          placeholder="Enter your password"
          {...inputStyle}
        />
        <Button mt={4} type="submit" width="full">
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </FormControl>

      {notification.title && (
        <Notifications
          title={notification.title}
          description={notification.description}
          status={notification.status}
          position="top"
          duration={3000}
          isClosable
          clearNotification={() =>
            setNotification({ title: '', description: '', status: '' })
          }
        />
      )}
    </Box>
  )
}

export default Form

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useColorMode
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { authenticate, setUserToken, setUserData } from '../services/auth'
import Button from '../components/Button'
import Notifications from './Notifications'

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

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    setFormData((prevState) => ({
      ...prevState,
      user_image: file // Store the file in form data
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Create a FormData object to send the file
    const dataToSend = new FormData()
    for (const key in formData) {
      dataToSend.append(key, formData[key])
    }

    try {
      const response = await authenticate(dataToSend, isRegister)
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

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
            <FormLabel {...formLabelStyle}>User Image</FormLabel>
            <Box
              {...getRootProps()}
              border="2px dashed"
              p={4}
              textAlign="center"
              mb={4}
            >
              <input {...getInputProps()} />
              <p>
                Drag 'n' drop your profile image here, or click to select one
              </p>
            </Box>
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

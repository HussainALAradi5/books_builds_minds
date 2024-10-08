import { Avatar, Box, Text } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'

const UserAvatar = ({ name, onImageUpload }) => {
  const [image, setImage] = useState(null)
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setImage(file)
      onImageUpload(file) // Call the parent handler to upload image
    }
  })

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        {...getRootProps()}
        border="2px dashed"
        p={4}
        textAlign="center"
        mb={4}
        cursor="pointer"
      >
        <input {...getInputProps()} />
        <Avatar
          size="xl"
          name={name || 'User'}
          src={image ? URL.createObjectURL(image) : undefined}
        />
        <Text mt={2}>
          {image ? 'Re-upload image' : 'Click or drag and drop to upload image'}
        </Text>
      </Box>
    </Box>
  )
}

export default UserAvatar

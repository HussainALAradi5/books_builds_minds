import { Box, Text } from '@mantine/core'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <Box
      py="lg"
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, #141E30, #243B55)',
        color: 'white',
        textAlign: 'center',
        fontSize: '1.2rem',
        borderTop: '4px solid #0a1422',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Text>&copy; {currentYear} Book Explorer. All rights reserved.</Text>
    </Box>
  )
}

export default Footer

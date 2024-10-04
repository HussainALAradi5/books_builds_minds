import { Button as ChakraButton } from '@chakra-ui/react'

const Button = ({ transparent, children, ...props }) => {
  const styles = {
    base: {
      colorScheme: 'blue',
      variant: 'outline',
      mr: 2,
      border: '2px',
      transition: 'background 0.2s, color 0.2s'
    },
    transparent: {
      bg: 'transparent',
      color: 'blue.500',
      borderColor: 'blue.500',
      _hover: { bg: 'blue.500', color: 'white' }
    },
    filled: {
      bg: 'blue.500',
      color: 'white',
      _hover: { bg: 'blue.600', color: 'white' }
    }
  }

  return (
    <ChakraButton
      {...styles}
      {...(transparent ? styles.transparent : styles.filled)}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}

export default Button

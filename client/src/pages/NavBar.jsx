import { Flex, Spacer, useColorMode, Switch } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

const NavBar = ({ isLoggedIn, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      bg={colorMode === 'light' ? 'teal.500' : 'teal.700'}
      color="white"
      p={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link to="/">Home</Link>
      <Spacer />
      <Flex alignItems="center">
        {isLoggedIn && (
          <Link to="/profile">
            <Button mr={2}>Profile</Button>
          </Link>
        )}
        <Link to="/register">
          <Button mr={2}>Register</Button>
        </Link>
        <Link to="/login">
          <Button mr={2}>Login</Button>
        </Link>
        <Link to="/about">
          <Button>About</Button>
        </Link>
        <Spacer />
        <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
      </Flex>
    </Flex>
  )
}

export default NavBar

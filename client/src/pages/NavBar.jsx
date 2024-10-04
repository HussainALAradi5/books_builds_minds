import {
  Flex,
  Spacer,
  useColorMode,
  Switch,
  IconButton,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  useDisclosure
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  FaUser,
  FaUserPlus,
  FaSignInAlt,
  FaInfoCircle,
  FaMoon,
  FaSun,
  FaHome
} from 'react-icons/fa'
import Button from '../components/Button'

const NavBar = ({ isLoggedIn }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      bg={colorMode === 'light' ? 'teal.500' : 'teal.700'}
      color="white"
      p={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Spacer />

      <IconButton
        icon={<HamburgerIcon />}
        variant="outline"
        aria-label="Open menu"
        onClick={onOpen}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg={colorMode === 'light' ? 'teal.500' : 'teal.700'}>
            <Flex justifyContent="space-between" alignItems="center">
              <Box fontWeight="bold" fontSize="lg">
                Menu
              </Box>
              <IconButton
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Close menu"
                onClick={onClose}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              <Link to="/" onClick={onClose}>
                <Button width="full" leftIcon={<FaHome />}>
                  Home
                </Button>
              </Link>
              {isLoggedIn && (
                <Link to="/profile" onClick={onClose}>
                  <Button width="full" leftIcon={<FaUser />}>
                    Profile
                  </Button>
                </Link>
              )}
              <Link to="/register" onClick={onClose}>
                <Button width="full" leftIcon={<FaUserPlus />}>
                  Register
                </Button>
              </Link>
              <Link to="/login" onClick={onClose}>
                <Button width="full" leftIcon={<FaSignInAlt />}>
                  Login
                </Button>
              </Link>
              <Link to="/about" onClick={onClose}>
                <Button width="full" leftIcon={<FaInfoCircle />}>
                  About
                </Button>
              </Link>
              <HStack spacing={2} width="full" mt={4} justifyContent="center">
                <Switch
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                />
                {colorMode === 'dark' ? <FaSun /> : <FaMoon />}
                <Box>{colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</Box>
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default NavBar

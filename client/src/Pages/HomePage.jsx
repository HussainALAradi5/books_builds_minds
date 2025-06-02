import React from 'react'
import {
  Title,
  Text,
  Image,
  Flex,
  Stack,
  MantineProvider,
  createTheme
} from '@mantine/core'

const theme = createTheme({
  primaryColor: 'grape' // rich purple
})

const HomePage = () => {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#4B0082', // Indigo (rich, eye-catching purple)
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem'
        }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          w="100%"
          maw={1200}
        >
          <Stack spacing="md" flex={1}>
            <Title order={1} size="3rem" fw={900}>
              Bold. Elegant. You.
            </Title>
            <Text size="lg">
              Experience the power of solid design with vibrant color and clean
              layout.
            </Text>
          </Stack>
        </Flex>
      </div>
    </MantineProvider>
  )
}

export default HomePage

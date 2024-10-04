import { ChakraProvider } from '@chakra-ui/react'
import MainContainer from './components/MainContainer'

function App() {
  return (
    <ChakraProvider>
      <MainContainer />
    </ChakraProvider>
  )
}

export default App

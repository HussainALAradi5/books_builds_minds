import { useToast, useBreakpointValue } from '@chakra-ui/react'
import { useEffect } from 'react'

const Notifications = ({
  title,
  description,
  status,
  duration = 3000,
  isClosable = true,
  clearNotification
}) => {
  const toast = useToast()

  const position = useBreakpointValue({
    base: 'bottom',
    md: { marginRight: '200px' },
    lg: 'top'
  })

  useEffect(() => {
    if (title) {
      toast.closeAll()

      toast({
        title,
        description,
        status,
        duration,
        isClosable,
        position: typeof position === 'string' ? position : 'top',
        containerStyle: typeof position === 'object' ? position : {}
      })

      const timer = setTimeout(() => {
        clearNotification()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [
    title,
    description,
    status,
    duration,
    isClosable,
    position,
    toast,
    clearNotification
  ])

  return null
}

export default Notifications

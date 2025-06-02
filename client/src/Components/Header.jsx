import { Box, Group, Title } from '@mantine/core'

const Header = () => {
  return (
    <Box
      py="md"
      style={{
       width: '100%', 
        background: 'linear-gradient(90deg, #003973, #0074cc)',
        color: 'white',
        borderBottom: '4px solid #00254d',
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
        overflowX: 'hidden' 
      }}
    >
      <Group position="apart" px="lg">
        <Title
          order={2}
          style={{
            fontWeight: 'bold',
            letterSpacing: '1.2px',
            fontSize: '2rem',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            color: '#99d9ea'
          }}
        >
          📚 Book Explorer
        </Title>
      </Group>
    </Box>
  )
}

export default Header

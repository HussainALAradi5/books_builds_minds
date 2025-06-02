import HomePage from '../Pages/HomePage'
import Footer from './Footer'
import Header from './Header'

const MainContainer = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw', // Ensures full width
        overflowX: 'hidden' // Prevent horizontal scroll
      }}
      className="mainContainer"
    >
      <Header />

      {/* Main content area that stretches */}
      <div style={{ flex: 1 }}>
        <HomePage />
      </div>

      <Footer />
    </div>
  )
}

export default MainContainer

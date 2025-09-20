import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home.jsx'
import BookingDetail from './pages/BookingDetails.jsx'
import AddBooking from './pages/AddBooking.jsx'
import EditBooking from './pages/EditBooking.jsx'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/add-booking" element={<AddBooking />} />
        <Route path="/edit-booking/:id" element={<EditBooking />} />
      </Routes>
    </Layout>
  )
}

export default App
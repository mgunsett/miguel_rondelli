import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './components/UI/Navbar'
import Hero from './components/Hero/Hero'
import { PhilosophySection } from './sections/PhilosophySection'
import { CareerSection } from './sections/CareerSection'
import { HonorsSection } from './sections/HonorsSection'
import { ManagementStatsSection } from './sections/ManagementStatsSection'
import { StaffSection } from './sections/StaffSection'
import PressSection from './components/Press/PressSection'
import GallerySection from './components/Gallery/GallerySection'
import ContactSection from './components/Contact/ContactSection'
import Footer from './components/UI/Footer'
import AdminPage from './pages/AdminPage'

function Landing() {
  return (
    <Box as="main" bg="brand.negro" overflowX="hidden">
      <Navbar />
      <Hero />
      <Box mt="-100vh" position="relative" zIndex={21}>
        <PhilosophySection />
        <CareerSection />
        <HonorsSection />
        <ManagementStatsSection />
        <StaffSection />
        <PressSection />
        <GallerySection />
        <ContactSection />
        <Footer />
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"      element={<Landing />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

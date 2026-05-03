import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Journal from './pages/Journal'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Cursor />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </SmoothScroll>
    </BrowserRouter>
  )
}

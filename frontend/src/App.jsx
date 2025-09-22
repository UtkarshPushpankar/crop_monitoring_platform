import { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Footer from './components/Footer'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import AboutPage from './pages/AboutPage'
import DashboardPage from './pages/DashboardPage'
import AgriAi from './pages/AgriAi'
import Contact from './components/Contact'
import PrivacyPolicy from './components/PrivacyPolicy'
import CropDiseaseDetection from './pages/CropDiseaseDetection'
import AgriTools from './components/AgriTools'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PestControlMonitoring from './components/PestControlPage'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation()

  // Full screen routes (no navbar/footer)
  const fullScreenRoutes = ['/agriai']
  const isFullScreen = fullScreenRoutes.includes(location.pathname)

  return (
    <>
      <div>
        {!isFullScreen && <Navbar />}

        <Routes>
          <Route path='/' element={
            <>
              <HomePage />
            </>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/agriai' element={<AgriAi />} />
          <Route path='/contact' element={<Contact />}/>
          <Route path='/privacypolicy' element={<PrivacyPolicy />}/>
          <Route path='/crop-disease-detection' element={<CropDiseaseDetection />}/>
          <Route path='/agritools' element={<AgriTools />}/>
          <Route path='/pestcontrol' element={<PestControlMonitoring />}/>

        </Routes>
        <ToastContainer />  

        {!isFullScreen && <Footer />}
      </div>
    </>
  )
}

export default App
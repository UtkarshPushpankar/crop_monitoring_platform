import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Navbar /> 
        <Routes>
          <Route path='/' element=
            {<>
              <HomePage />
            </>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/about' element={<AboutPage/>} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/agriai' element={<AgriAi />} />
          <Route path='/contact' element={<Contact />}/>
          <Route path='/privacypolicy' element={<PrivacyPolicy />}/>
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App

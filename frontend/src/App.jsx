import { useState } from 'react'
import './App.css'
import Upload from './uploadImage/uplaod'
import Chatbot from './Chatbot/Chatbutton'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
<<<<<<< Updated upstream
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
=======
import Login from './components/Login'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Footer from './components/Footer'
>>>>>>> Stashed changes

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App

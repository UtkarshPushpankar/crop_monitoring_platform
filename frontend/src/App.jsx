import { useState } from 'react'
import './App.css'
import Upload from './uploadImage/uplaod'
import Chatbot from './Chatbot/Chatbutton'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Footer from './components/Footer'

import Login from './components/Login'
import Navbar from './components/Navbar'
import Signup from './components/Signup'

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
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App

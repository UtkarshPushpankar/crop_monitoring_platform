import { useState } from 'react'
import './App.css'
import Upload from './uploadImage/uplaod'
import Chatbot from './Chatbot/Chatbutton'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App

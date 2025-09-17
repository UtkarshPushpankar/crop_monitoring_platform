import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Upload from './uploadImage/uplaod'
import Chatbot from './Chatbot/Chatbutton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='text-red-400'>
        Hello, Crop Monitoring Platform is live.
        <Upload/>
        <Chatbot/>
      </div>
    </>
  )
}

export default App

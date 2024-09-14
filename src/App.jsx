import { useState } from 'react'
import './App.css'
import FastFinder from './Component/FastFinder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className = "container"> 
        <h1>Fast Finder Search Bar</h1>
        <FastFinder/>
      </div>
        
    </>
  )
}

export default App

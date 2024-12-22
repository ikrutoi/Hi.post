import { useState } from 'react'
import './App.scss'
import Form from './components/Form/Form'
import Logo from './components/Logo/Logo'
import Nav from './components/Nav/Nav'
import Status from './components/Status/Status'

function App() {
  const [nameNav, setNameNav] = useState('')

  const [btnNavHover, setBtnNavHover] = useState('')

  const handleMouseEnter = (e) => {
    setBtnNavHover(e.target.textContent)
  }
  const handleMouseLeave = () => {
    setBtnNavHover('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <Logo />
        <Status />
      </header>
      <main className="app-main">
        <Nav
          onClick={setNameNav}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <Form name={nameNav} hover={btnNavHover} />
      </main>
    </div>
  )
}

export default App

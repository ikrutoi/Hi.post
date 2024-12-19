import { useState } from 'react'
import './App.css'
import CardNav from './components/CardNav/CardNav'
import Form from './components/Form/Form'
import Logo from './components/Logo/Logo'
import Nav from './components/Nav/Nav'
import Status from './components/Status/Status'

function App() {
  const [nameNav, setNameNav] = useState('1')
  return (
    <div className="app">
      <header className="app-header">
        <Logo />
        <Status />
      </header>
      <Nav onClick={setNameNav} />
      <main className="app-main">
        <CardNav name={nameNav} />
        <Form />
      </main>
    </div>
  )
}

export default App

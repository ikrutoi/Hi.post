import './App.css'
import CardNav from './components/CardNav/CardNav'
import Form from './components/Form/Form'
import Logo from './components/Logo/Logo'
import Nav from './components/Nav/Nav'
import Status from './components/Status/Status'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Logo />
        <Status />
      </header>
      <Nav />
      <main className="app-main">
        <CardNav />
        <Form />
      </main>
    </div>
  )
}

export default App

// import { useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { useRef, useState, useLayoutEffect } from 'react'
import './App.scss'
import Logo from './components/Logo/Logo'
import Status from './components/Status/Status'
import CardsNav from './components/CardsNav/CardsNav'
import CardForm from './components/CardForm/CardForm'
import CardsList from './components/CardsList/CardsList'

function App() {
  const [nameNav, setNameNav] = useState('')

  const [btnNavHover, setBtnNavHover] = useState('')

  const handleMouseEnter = (e) => {
    setBtnNavHover(e.target.textContent)
  }
  const handleMouseLeave = () => {
    setBtnNavHover('')
  }

  const useSize = (target) => {
    const [size, setSize] = useState()

    useLayoutEffect(() => {
      setSize(target.current.getBoundingClientRect())
    }, [target])

    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  }

  const target = useRef(null)
  const size = useSize(target)

  return (
    <div className="app">
      <header className="app-header">
        <Logo />
        <Status />
      </header>
      <main className="app-main">
        <CardsNav
          onClick={setNameNav}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <div className="form" ref={target}>
          {size && (
            <CardsList
              name={nameNav}
              hover={btnNavHover}
              dimensionHeight={size.height}
              dimensionWidth={size.width}
            />
          )}
          {size && (
            <CardForm
              name={nameNav}
              hover={btnNavHover}
              dimensionHeight={size.height}
              dimensionWidth={size.width}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App

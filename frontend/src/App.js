// import { useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import './App.scss'
import Logo from './components/Logo/Logo'
import Status from './components/Status/Status'
import CardsNav from './components/CardsNav/CardsNav'
import CardForm from './components/CardForm/CardForm'
import CardsList from './components/CardsList/CardsList'

function App() {
  const [nameNav, setNameNav] = useState('')
  const appRef = useRef()

  const [btnNavHover, setBtnNavHover] = useState('')
  const [toolbarColor, setToolbarColor] = useState(false)
  const [toolbarColorActive, setToolbarColorActive] = useState(false)

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

  useEffect(() => {
    if (toolbarColorActive) {
      setToolbarColor(true)
    }
    console.log('toolbarColorActive', toolbarColorActive)
  }, [toolbarColorActive])

  const handleAppClick = () => {
    console.log('app')
    // console.log('app2', toolbarColorActive)
  }

  const target = useRef(null)
  const size = useSize(target)

  return (
    <div ref={appRef} className="app" onClick={handleAppClick}>
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
              toolbarColor={toolbarColor}
              setToolbarColorActive={setToolbarColorActive}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App

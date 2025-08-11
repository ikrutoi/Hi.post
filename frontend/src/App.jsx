import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { useDispatch, useSelector } from 'react-redux'
import './App.scss'
import { authReducer, logout } from '@features/auth/store/authSlice'
// import { setAuth } from './slices/authSlice'
import ErrorBoundary from './components/ErrorBoundary'
import Logo from './components/Logo/Logo'
import Status from './components/Status/Status'
import CardsNav from './components/CardsNav/CardsNav'
import CardForm from './components/CardForm/CardForm'
import CardsList from './components/CardsList/CardsList'
import scaleBase from './data/main/scaleCardAndCardMini.json'
import {
  addRemSize,
  addSizeCard,
  addSizeMiniCard,
  setMaxCardsList,
} from './store/slices/layoutSlice'
// } from './redux/layout/actionCreators'
import { setBtnToolbar } from './store/slices/layoutSlice'

function App() {
  const remSize = useSelector((state) => state.layout.remSize)
  const appRef = useRef()
  const dispatch = useDispatch()
  const [colorToolbar, setColorToolbar] = useState(null)

  const useSize = (target) => {
    const [size, setSize] = useState()

    useLayoutEffect(() => {
      setSize(target.current.getBoundingClientRect())
    }, [target])

    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loginStart())
      const user = { id: '123', name: 'Ihar', email: 'ihar@email.com' }
      dispatch(loginSuccess({ user, token }))
    }
  }, [])

  const handleAppClick = (evt) => {
    if (colorToolbar) {
      if (
        !evt.target.classList.contains('toolbar-color') &&
        !evt.target.classList.contains('toolbar-more')
      ) {
        setColorToolbar(false)
        dispatch(
          addBtnToolbar({ firstBtn: null, secondBtn: null, section: null })
        )
      }
    }
  }

  useEffect(() => {
    const root = document.documentElement
    const remSizeInPx = getComputedStyle(root).getPropertyValue('--rem-size')
    const tempDiv = document.createElement('div')
    tempDiv.style.width = remSizeInPx
    tempDiv.style.visibility = 'hidden'
    document.body.appendChild(tempDiv)
    const computedRem = tempDiv.getBoundingClientRect().width
    dispatch(addRemSize(computedRem))
    document.body.removeChild(tempDiv)
  }, [])

  const formRef = useRef(null)
  const size = useSize(formRef)

  useEffect(() => {
    // console.log('size:', size)
    if (size) {
      // console.log('size.height:', size.height, 'scaleBase', scaleBase)
      dispatch(
        addSizeCard({
          height: Number((size.height * scaleBase.card).toFixed(2)),
          width: Number((size.height * scaleBase.card * 1.42).toFixed(2)),
        })
      )
      dispatch(
        addSizeMiniCard({
          height: Number((size.height * scaleBase.miniCard).toFixed(2)),
          width: Number((size.height * scaleBase.miniCard * 1.42).toFixed(2)),
        })
      )
      if (remSize && formRef.current) {
        dispatch(
          setMaxCardsList(
            Math.floor(
              (formRef.current.clientWidth - 2 * remSize) /
                (Number((size.height * scaleBase.miniCard * 1.42).toFixed(2)) +
                  1.2 * remSize)
            )
          )
        )
      }
    }
  }, [size, remSize, dispatch])

  return (
    <div ref={appRef} className="app" onClick={handleAppClick}>
      <header className="app-header">
        <Logo />
        <Status />
      </header>
      <main className="app-main">
        <CardsNav />
        <div className="form" ref={formRef}>
          <ErrorBoundary>{size && <CardsList />}</ErrorBoundary>
          {size && <CardForm />}
        </div>
      </main>
    </div>
  )
}

export default App

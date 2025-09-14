import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { useDispatch, useSelector } from 'react-redux'
import './App.scss'

import '@app/styles/reset.scss'
import '@app/styles/variables.scss'
import '@app/styles/typography.scss'
import '@app/styles/global.scss'

import type { RootState } from '@app/state/store'
import { loginStart, loginSuccess } from '@features/auth/store/authSlice'
import ErrorBoundary from './components/ErrorBoundary'
import Logo from './components/Logo/Logo'
import Status from './components/Status/Status'
import CardsNav from './components/CardsNav/CardsNav'
import CardForm from './components/CardForm/CardForm'
import CardsList from './components/CardsList/CardsList'
import { computeLayoutSizes } from 'shared-legacy/lib/layout'
import {
  addRemSize,
  addSizeCard,
  addSizeMiniCard,
  setMaxCardsList,
  setBtnToolbar,
} from './features/layout/application/state/layout'
import { calculateSizeCard } from 'shared-legacy/lib/layout/calculateSizeCard'
import { calculateMaxCardsList } from 'shared-legacy/lib/layout/calculateMaxCardsList'
// import type { RootState } from './store/store'

const useSize = (target: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRect | undefined>()

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect())
    }
  }, [target])

  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

const App = () => {
  const remSize = useSelector((state: RootState) => state.layout.remSize)
  const dispatch = useDispatch()
  const appRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  const size = useSize(formRef)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loginStart())
      const user = { id: '123', name: 'Ihar', email: 'ihar@email.com' }
      dispatch(loginSuccess({ user, token }))
    }
  }, [dispatch])

  const handleAppClick = (evt: MouseEvent) => {
    if (
      colorToolbar &&
      !(
        (evt.target as HTMLElement).classList.contains('toolbar-color') ||
        (evt.target as HTMLElement).classList.contains('toolbar-more')
      )
    ) {
      setColorToolbar(false)
      dispatch(
        setBtnToolbar({ firstBtn: null, secondBtn: null, section: null })
      )
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
  }, [dispatch])

  useEffect(() => {
    if (size && remSize && formRef.current) {
      const { cardSize, miniCardSize, maxCardsList } = computeLayoutSizes({
        containerHeight: size.height,
        containerWidth: formRef.current.clientWidth,
        remSize,
      })

      dispatch(addSizeCard(cardSize))
      dispatch(addSizeMiniCard(miniCardSize))
      dispatch(setMaxCardsList(maxCardsList))
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

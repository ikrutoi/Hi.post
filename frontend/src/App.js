import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { useDispatch, useSelector } from 'react-redux'
import './App.scss'
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
} from './redux/layout/actionCreators'
import { addBtnToolbar } from './redux/layout/actionCreators'

function App() {
  const appRef = useRef()
  const layoutBtnToolbar = useSelector((state) => state.layout.btnToolbar)
  const dispatch = useDispatch()
  const [colorToolbar, setColorToolbar] = useState(null)

  useEffect(() => {
    if (layoutBtnToolbar.firstBtn === 'color') {
      setColorToolbar(true)
    }
  }, [layoutBtnToolbar])

  const useSize = (target) => {
    const [size, setSize] = useState()

    useLayoutEffect(() => {
      setSize(target.current.getBoundingClientRect())
    }, [target])

    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  }

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

  const target = useRef(null)
  const size = useSize(target)

  useEffect(() => {
    if (size) {
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
    }
  }, [size, dispatch])

  return (
    <div ref={appRef} className="app" onClick={handleAppClick}>
      <header className="app-header">
        <Logo />
        <Status />
      </header>
      <main className="app-main">
        <CardsNav />
        <div className="form" ref={target}>
          {size && <CardsList />}
          {size && <CardForm />}
        </div>
      </main>
    </div>
  )
}

export default App

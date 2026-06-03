import { useEffect } from 'react'
import { calcAppUiScale } from '@shared/utils/layout'
import { useSizeFacade } from '../facades/useSizeFacade'
import {
  applyAppUiScale,
  getRemSize,
  getViewportBreakpoint,
} from '../../helpers'

const getWindowSize = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  height: typeof window !== 'undefined' ? window.innerHeight : 768,
})

export const useViewportInit = () => {
  const { setViewportSize, setRemSize } = useSizeFacade()

  useEffect(() => {
    const updateLayoutScale = () => {
      const { width, height } = getWindowSize()
      const uiScale = calcAppUiScale(width, height)

      applyAppUiScale(uiScale)
      setRemSize(getRemSize())
      setViewportSize({
        width,
        height,
        viewportSize: getViewportBreakpoint(width),
      })
    }

    updateLayoutScale()

    window.addEventListener('resize', updateLayoutScale)
    return () => window.removeEventListener('resize', updateLayoutScale)
  }, [setRemSize, setViewportSize])
}

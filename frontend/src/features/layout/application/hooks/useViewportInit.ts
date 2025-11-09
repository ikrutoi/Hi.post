import { useEffect } from 'react'
import { useViewportSize } from '@shared/hooks/useViewportSize'
import { useSizeFacade } from '../facades/useSizeFacade'

export const useViewportInit = () => {
  const { width, height, viewportSize } = useViewportSize()
  const { actions } = useSizeFacade()

  useEffect(() => {
    actions.setViewportSize({ width, height, viewportSize })
  }, [width, height, viewportSize, actions.setViewportSize])
}

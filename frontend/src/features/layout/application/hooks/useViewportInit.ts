import { useEffect } from 'react'
import { useSizeFacade } from '../facades/useSizeFacade'

const getWindowSize = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  height: typeof window !== 'undefined' ? window.innerHeight : 768,
})

export const useViewportInit = () => {
  const { actions } = useSizeFacade()

  useEffect(() => {
    const updateSize = () => {
      const { width, height } = getWindowSize()

      const viewportSize =
        width < 576
          ? 'xs'
          : width < 768
            ? 'sm'
            : width < 992
              ? 'md'
              : width < 1200
                ? 'lg'
                : 'xl'

      actions.setViewportSize({ width, height, viewportSize })
    }

    updateSize()

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [actions])
}

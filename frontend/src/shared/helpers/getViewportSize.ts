import type { ViewportSize } from '../config/constants'

export const getViewportSize = (width: number): ViewportSize => {
  if (width < 480) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1440) return 'lg'
  return 'xl'
}

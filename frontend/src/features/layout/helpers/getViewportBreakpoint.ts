import type { ViewportSize } from '@shared/config/constants'

export function getViewportBreakpoint(width: number): ViewportSize {
  if (width < 576) return 'xs'
  if (width < 768) return 'sm'
  if (width < 992) return 'md'
  if (width < 1200) return 'lg'
  return 'xl'
}

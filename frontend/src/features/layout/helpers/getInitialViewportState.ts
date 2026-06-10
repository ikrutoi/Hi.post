import type { ViewportSizeState } from '../domain/types'
import { getShellLayoutMode } from './getShellLayoutMode'
import { getViewportBreakpoint } from './getViewportBreakpoint'

export function getInitialViewportState(): ViewportSizeState {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080

  return {
    width,
    height,
    viewportSize: getViewportBreakpoint(width),
    shellLayoutMode: getShellLayoutMode(width),
  }
}

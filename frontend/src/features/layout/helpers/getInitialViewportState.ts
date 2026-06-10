import type { ViewportSizeState } from '../domain/types'
import { applyShellLayoutMode } from './applyShellLayoutMode'
import { getShellLayoutMode } from './getShellLayoutMode'
import { getViewportBreakpoint } from './getViewportBreakpoint'

export function getInitialViewportState(): ViewportSizeState {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080
  const shellLayoutMode = getShellLayoutMode(width)

  applyShellLayoutMode(shellLayoutMode)

  return {
    width,
    height,
    viewportSize: getViewportBreakpoint(width),
    shellLayoutMode,
  }
}

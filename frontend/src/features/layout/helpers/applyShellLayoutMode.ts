import type { ShellLayoutMode } from '@shared/config/constants'

const SHELL_LAYOUT_DATA_ATTR = 'data-shell-layout'

export function applyShellLayoutMode(mode: ShellLayoutMode): void {
  if (typeof document === 'undefined') return

  document.documentElement.setAttribute(SHELL_LAYOUT_DATA_ATTR, mode)
}

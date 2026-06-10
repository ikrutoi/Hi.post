import {
  SHELL_LAYOUT_MOBILE_MAX_WIDTH,
  type ShellLayoutMode,
} from '@shared/config/constants'

export function getShellLayoutMode(width: number): ShellLayoutMode {
  return width <= SHELL_LAYOUT_MOBILE_MAX_WIDTH ? 'mobile' : 'desktop'
}

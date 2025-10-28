import type { IconState } from '../constants'

export const stateColors: Record<IconState, string> = {
  disabled: 'hsl(0, 0%, 64%)',
  enabled: 'hsl(0, 0%, 28%)',
  active: 'hsl(200, 100%, 40%)',
}

export const hoverColor = 'hsl(200, 100%, 48%)'

export const transparentColor = 'hsla(0, 0%, 0%, 0)'

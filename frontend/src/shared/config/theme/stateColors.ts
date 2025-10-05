export type State = 'disabled' | 'enabled' | 'active'

export const stateColors: Record<State, string> = {
  disabled: 'rgb(163, 163, 163)',
  enabled: 'rgb(71, 71, 71)',
  active: 'rgb(0, 122, 172)',
}

export type LegacyState = 'true' | 'false' | 'hover' | 'active' | 'default'

export const stateColorsLegacy: Record<LegacyState, string> = {
  true: 'rgb(71, 71, 71)',
  false: 'rgb(163, 163, 163)',
  hover: 'rgb(0, 122, 172)',
  active: 'rgb(71, 71, 71)',
  default: 'rgb(200, 150, 50)',
}

export const transparentColor = 'rgba(0, 0, 0, 0)'

export const stateColors = {
  true: 'rgb(71, 71, 71)',
  active: 'rgb(71, 71, 71)',
  false: 'rgb(163, 163, 163)',
  hover: 'rgb(0, 122, 172)',
  trueTransparent: 'rgba(71, 71, 71, 0)',
  falseTransparent: 'rgba(163, 163, 163, 0)',
  default: 'rgb(200, 150, 50)
} as const

export type StateColorKey = keyof typeof stateColors
export type StateColorValue = (typeof stateColors)[StateColorKey]

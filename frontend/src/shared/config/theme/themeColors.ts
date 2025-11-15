export const themeColors = {
  color: {
    disabled: 'hsl(0, 0%, 96%)',
    enabled: 'hsl(0, 0%, 88%)',
    font: 'hsl(0, 0%, 11)',
  },
  text: {
    primary: 'rgb(71, 71, 71)',
    secondary: 'rgb(163, 163, 163)',
    inverted: 'rgb(255, 255, 255)',
  },
  background: {
    default: 'rgb(240, 240, 240)',
    active: 'rgb(0, 125, 215)',
  },
  border: {
    default: 'rgb(163, 163, 163)',
  },
} as const

export const theme = {
  colors: themeColors,
  spacing: { sm: 4, md: 8, lg: 16 },
  fontSizes: { base: 14, heading: 24 },
} as const

export type ThemeColors = typeof themeColors
export type ThemeColorCategory = keyof ThemeColors
export type ThemeColorKey<C extends ThemeColorCategory> = keyof ThemeColors[C]

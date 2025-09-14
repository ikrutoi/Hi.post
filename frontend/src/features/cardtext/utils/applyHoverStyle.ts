import { stateColors } from 'shared-legacy/theme'

export const applyHoverStyle = (button: HTMLElement) => {
  button.style.color = stateColors.hover
  button.style.cursor = 'pointer'
}

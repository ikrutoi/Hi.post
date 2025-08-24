import { stateColors } from '@shared/theme'

export const applyHoverStyle = (button: HTMLElement) => {
  button.style.color = stateColors.hover
  button.style.cursor = 'pointer'
}

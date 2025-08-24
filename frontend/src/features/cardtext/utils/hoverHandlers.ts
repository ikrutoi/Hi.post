import { stateColors } from '@shared/theme'
import { applyHoverStyle } from '../utils'
import type { toolbarDataset, textAlignTooltip, buttonMap } from '../types'

const textAlignTooltips: textAlignTooltip[] = [
  'left',
  'center',
  'right',
  'justify',
]

export const handleMouseEnterBtn = (evt: MouseEvent, btns: buttonMap): void => {
  const target = evt.target as HTMLElement
  const parentButton = target.closest('.toolbar-btn') as HTMLElement
  const { section, tooltip } = parentButton.dataset

  if (!section || !tooltip) return

  if (btns[section]?.[tooltip]) {
    const isTextAlign = textAlignTooltips.includes(tooltip as textAlignTooltip)
    const isCardTextHover = btns.cardtext?.[tooltip] === 'hover'

    if (!isTextAlign || !isCardTextHover) {
      applyHoverStyle(parentButton)
    }
  }
}

export const handleMouseLeaveBtn = (evt: MouseEvent, btns: buttonMap): void => {
  const target = evt.target as HTMLElement
  const parentButton = target.closest('.toolbar-btn') as HTMLElement
  const { section, tooltip } = parentButton.dataset

  if (!section || !tooltip) return

  const state = btns[section]?.[tooltip] ?? 'default'
  parentButton.style.color = stateColors[state]
  parentButton.style.cursor = 'default'
}

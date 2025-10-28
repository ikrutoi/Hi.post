import { stateColors, transparentColor } from '@shared/config/theme'
import type { IconState, CardMenuSection } from '../../config/constants'
import type { CardtextToolbarKey } from '@toolbar/domain/types'

const styleCursor: Record<IconState, string> = {
  disabled: 'default',
  enabled: 'pointer',
  active: 'pointer',
}

type ButtonState = Record<string, IconState>
type IconRefs = Record<string, HTMLButtonElement | null>

type PartialSectionState = Partial<Record<CardMenuSection, ButtonState>>

export const applyIconStylesByStatus = (
  buttons: PartialSectionState,
  buttonIconRefs: IconRefs
): void => {
  Object.entries(buttons).forEach(([section, sectionButtons]) => {
    Object.entries(sectionButtons).forEach(([key, state]) => {
      const refKey = `${section}-${key}`
      const ref = buttonIconRefs[refKey]
      if (!ref) return

      if (section === 'fullCard') {
        ref.style.color = transparentColor
        const timer = setTimeout(() => {
          ref.classList.add('full')
          ref.style.color = stateColors[state]
          ref.style.cursor = styleCursor[state]
        }, 0)
        return () => clearTimeout(timer)
      }

      ref.style.color = stateColors[state]

      const isTextAlignButton = ['left', 'center', 'right', 'justify'].includes(
        key
      )
      const typedKey = key as CardtextToolbarKey
      const isActive = sectionButtons[typedKey] === 'active'

      if (!isTextAlignButton || !isActive) {
        ref.style.cursor = styleCursor[state]
      }
    })
  })
}

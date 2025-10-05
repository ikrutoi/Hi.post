import { stateColors, transparentColor } from '@shared/config/theme'
import type { State } from '@shared/config/theme'
import type { CardSectionName } from '@shared/types'
import type { CardtextToolbarKey } from '@toolbar/domain/types'

const styleCursor: Record<State, string> = {
  disabled: 'default',
  enabled: 'pointer',
  active: 'pointer',
}

type ButtonState = Record<string, State>
type SectionState = Record<CardSectionName, ButtonState>
type IconRefs = Record<string, HTMLButtonElement | null>

export const applyIconStylesByStatus = (
  buttons: SectionState,
  buttonIconRefs: IconRefs
): void => {
  Object.entries(buttons).forEach(([section, buttons]) => {
    Object.entries(buttons).forEach(([key, state]) => {
      const refKey = `${section}-${key}`
      const ref = buttonIconRefs[refKey]
      if (!ref) return

      if (section === 'fullCard') {
        ref.style.color = transparentColor
        const timer = setTimeout(() => {
          ref.classList.add('full')
          ref.style.color = stateColors[state]
          if (state in styleCursor) {
            ref.style.cursor = styleCursor[state as keyof typeof styleCursor]
          }
        }, 0)
        return () => clearTimeout(timer)
      }

      ref.style.color = stateColors[state]

      const isTextAlignButton = ['left', 'center', 'right', 'justify'].includes(
        key
      )
      const typedKey = key as CardtextToolbarKey
      const isActive = buttons.cardtext?.[typedKey] === 'active'

      if (!isTextAlignButton || !isActive) {
        if (state in styleCursor) {
          ref.style.cursor = styleCursor[state as keyof typeof styleCursor]
        }
      }
    })
  })
}

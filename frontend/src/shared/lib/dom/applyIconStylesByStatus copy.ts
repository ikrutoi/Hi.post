import { stateColors, transparentColor } from '@shared/config/theme'
import type { State } from '@shared/config/theme'

const styleCursor: Record<'true' | 'false' | 'hover', string> = {
  true: 'pointer',
  false: 'default',
  hover: 'pointer',
}

type ButtonState = Record<string, State>
type SectionState = Record<string, ButtonState>
type IconRefs = Record<string, HTMLButtonElement | null>

export const applyIconStylesByStatus = (
  btns: SectionState,
  btnIconRefs: IconRefs
): void => {
  Object.entries(btns).forEach(([section, buttons]) => {
    Object.entries(buttons).forEach(([btn, state]) => {
      const refKey = `${section}-${btn}`
      const ref = btnIconRefs[refKey]
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

      const isTextAlignBtn = ['left', 'center', 'right', 'justify'].includes(
        btn
      )
      const isHover = btns.cardtext?.[btn] === 'hover'

      if (!isTextAlignBtn || !isHover) {
        if (state in styleCursor) {
          ref.style.cursor = styleCursor[state as keyof typeof styleCursor]
        }
      }
    })
  })
}

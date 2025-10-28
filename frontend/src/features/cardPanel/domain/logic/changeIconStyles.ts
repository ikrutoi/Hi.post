import { themeColors } from '@shared/config/theme'

export function changeIconStyles(
  btnsState: { fullCard: Record<string, boolean> },
  refs: Record<string, HTMLElement | null>
): void {
  const icons = Object.keys(btnsState.fullCard)

  icons.forEach((key) => {
    const ref = refs[key]
    if (!ref) return

    const isActive = btnsState.fullCard[key]

    ref.style.transition =
      'background-color 300ms ease-in-out, color 300ms ease-in-out'

    if (isActive) {
      ref.style.backgroundColor = themeColors.background.default
      ref.style.color = themeColors.text.primary
    } else {
      ref.style.backgroundColor = 'transparent'
      ref.style.color = 'transparent'
    }
  })
}

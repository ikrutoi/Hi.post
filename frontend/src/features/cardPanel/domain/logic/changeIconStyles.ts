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
      ref.style.backgroundColor = 'rgba(240, 240, 240, 0.75)'
      ref.style.color = 'rgba(71, 71, 71, 1)'
    } else {
      ref.style.backgroundColor = 'rgba(240, 240, 240, 0)'
      ref.style.color = 'rgba(71, 71, 71, 0)'
    }
  })
}

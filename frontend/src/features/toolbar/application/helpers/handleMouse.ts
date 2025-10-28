export const handleMouseEnterBtn = (evt: React.MouseEvent<HTMLElement>) => {
  const parentBtn = evt.currentTarget.closest(
    '.toolbar-btn'
  ) as HTMLElement | null
  if (!parentBtn) return

  const tooltip = parentBtn.dataset.tooltip
  if (!tooltip) return

  const isTextAlign = ['left', 'center', 'right', 'justify'].includes(tooltip)
  const isActive = parentBtn.classList.contains('toolbar__btn--active')

  if (isTextAlign && isActive) return

  parentBtn.classList.add('toolbar__btn--hover')
}

export const handleMouseLeaveBtn = (evt: React.MouseEvent<HTMLElement>) => {
  const parentBtn = evt.currentTarget.closest(
    '.toolbar-btn'
  ) as HTMLElement | null
  if (!parentBtn) return

  parentBtn.classList.remove('toolbar__btn--hover')
}

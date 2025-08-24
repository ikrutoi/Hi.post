export const findParentByClass = (
  el: HTMLElement | null,
  className: string
): HTMLElement | null => {
  if (!el) return null

  if (el.classList.contains(className)) {
    return el
  }

  return el.parentElement
    ? findParentByClass(el.parentElement as HTMLElement, className)
    : null
}

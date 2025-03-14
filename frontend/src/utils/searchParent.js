export const searchParent = (el, className) => {
  if (el.classList.contains(className)) {
    return el
  } else if (el.parentElement) {
    return searchParent(el.parentElement, className)
  }
  return null
}

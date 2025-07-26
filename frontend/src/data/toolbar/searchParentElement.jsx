export const searchParentElement = (el) => {
  if (el.classList.contains('toolbar-btn')) {
    return el
  } else if (el.parentElement) {
    return searchParentElement(el.parentElement)
  }
  return null
}

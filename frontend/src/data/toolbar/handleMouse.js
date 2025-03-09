import { colorScheme } from './colorScheme'
import { searchParentElement } from './searchParentElement'

const hover = (button) => {
  button.style.color = colorScheme.hover
  button.style.cursor = 'pointer'
}

export const handleMouseEnterBtn = (evt, btns) => {
  const parentBtnNav = searchParentElement(evt.target)
  if (btns[parentBtnNav.dataset.section][parentBtnNav.dataset.tooltip]) {
    if (
      !(
        parentBtnNav.dataset.tooltip === 'left' ||
        parentBtnNav.dataset.tooltip === 'center' ||
        parentBtnNav.dataset.tooltip === 'right' ||
        parentBtnNav.dataset.tooltip === 'justify'
      ) ||
      btns.cardtext[parentBtnNav.dataset.tooltip] !== 'hover'
    ) {
      hover(parentBtnNav)
    }
  }
}

export const handleMouseLeaveBtn = (evt, btns) => {
  const parentElement = searchParentElement(evt.target)
  parentElement.style.color =
    colorScheme[
      btns[parentElement.dataset.section][parentElement.dataset.tooltip]
    ]
  parentElement.style.cursor = 'default'
}

import { colorScheme } from './colorScheme'

const hover = (button) => {
  button.style.color = colorScheme.hover
  button.style.cursor = 'pointer'
}

export const handleMouseEnterBtn = (evt, btns) => {
  const parentBtn = evt.target.closest('.toolbar-btn')
  if (btns[parentBtn.dataset.section][parentBtn.dataset.tooltip]) {
    if (
      !(
        parentBtn.dataset.tooltip === 'left' ||
        parentBtn.dataset.tooltip === 'center' ||
        parentBtn.dataset.tooltip === 'right' ||
        parentBtn.dataset.tooltip === 'justify'
      ) ||
      btns.cardtext[parentBtn.dataset.tooltip] !== 'hover'
    ) {
      hover(parentBtn)
    }
  }
}

export const handleMouseLeaveBtn = (evt, btns) => {
  const parentBtn = evt.target.closest('.toolbar-btn')
  parentBtn.style.color =
    colorScheme[btns[parentBtn.dataset.section][parentBtn.dataset.tooltip]]
  parentBtn.style.cursor = 'default'
}

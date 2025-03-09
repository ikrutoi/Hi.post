import { colorScheme } from './colorScheme'

const styleCursor = { true: 'pointer', false: 'default', hover: 'pointer' }

export const changeIconStyles = (btns, btnIconRefs) => {
  Object.keys(btns).forEach((section) => {
    Object.keys(btns[section]).forEach((btn) => {
      const stateBtn = btns[section][btn]
      btnIconRefs[`${section}-${btn}`].style.color = colorScheme[stateBtn]
      if (
        !(
          btn === 'left' ||
          btn === 'center' ||
          btn === 'right' ||
          btn === 'justify'
        ) ||
        btns.cardtext[btn] !== 'hover'
      ) {
        btnIconRefs[`${section}-${btn}`].style.cursor = styleCursor[stateBtn]
      }
    })
  })
}

import { stateColors } from '@/shared/config/theme'

const styleCursor = { true: 'pointer', false: 'default', hover: 'pointer' }

export const changeIconStyles = (btns, btnIconRefs) => {
  Object.keys(btns).forEach((section) => {
    Object.keys(btns[section]).forEach((btn) => {
      const stateBtn = btns[section][btn]
      if (section === 'fullCard') {
        btnIconRefs[`${section}-${btn}`].style.color =
          stateColors[`${stateBtn}Transparent`]
        const timerAddClassList = setTimeout(() => {
          btnIconRefs[`${section}-${btn}`]?.classList.add('full')
          btnIconRefs[`${section}-${btn}`].style.color = colorScheme[stateBtn]
          btnIconRefs[`${section}-${btn}`].style.cursor = styleCursor[stateBtn]
        }, 0)
        return () => clearTimeout(timerAddClassList)
      }
      if (btnIconRefs[`${section}-${btn}`]) {
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
      }
    })
  })
}

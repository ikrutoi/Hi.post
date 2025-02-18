import * as a from './actionTypes'

export const infoButtons = (btn) => {
  return {
    type: a.INFO_BUTTONS,
    payload: btn,
  }
}

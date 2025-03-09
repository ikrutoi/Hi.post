import * as a from './actionTypes'

export const infoButtons = (btn) => {
  return {
    type: a.INFO_BUTTONS,
    payload: btn,
  }
}

// export const infoButtonsCardtext = (btn) => {
//   return {
//     type: a.INFO_BUTTONS_CARDTEXT,
//     payload: btn,
//   }
// }

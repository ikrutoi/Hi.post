import * as a from './actionTypes'

export const addCard = (newCard) => {
  return {
    type: a.ADD_CARD,
    payload: newCard,
  }
}

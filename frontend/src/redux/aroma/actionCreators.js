import * as a from './actionTypes'

export const addAroma = (newCard) => {
  return {
    type: a.ADD_AROMA,
    payload: newCard,
  }
}

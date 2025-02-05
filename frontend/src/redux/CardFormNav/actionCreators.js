import * as a from './actionTypes'

export const addCardtext = (newSection) => {
  return {
    type: a.ADD_CARDTEXT1,
    payload: newSection,
  }
}

export const addCardphoto = (newSection) => {
  return {
    type: a.ADD_CARDPHOTO,
    payload: newSection,
  }
}

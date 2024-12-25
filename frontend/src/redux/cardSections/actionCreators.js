import * as a from './actionTypes'

export const addCardSection = (newSection) => {
  return {
    type: a.ADD_SECTION,
    payload: newSection,
  }
}

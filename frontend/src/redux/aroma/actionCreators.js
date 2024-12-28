import * as a from './actionTypes'

export const addAroma = (newSection) => {
  return {
    type: a.ADD_AROMA,
    payload: newSection,
  }
}

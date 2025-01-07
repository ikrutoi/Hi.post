import * as a from './actionTypes'

export const addDate = (newSection) => {
  return {
    type: a.ADD_DATE,
    payload: newSection,
  }
}

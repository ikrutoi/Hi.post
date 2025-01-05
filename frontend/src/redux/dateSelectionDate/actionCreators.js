import * as a from './actionTypes'

export const addSelectionDate = (newSection) => {
  return {
    type: a.ADD_SELECTION_DATE,
    payload: newSection,
  }
}

export const deleteSelectionDate = (newSection) => {
  return {
    type: a.DELETE_SELECTION_DATE,
    payload: newSection,
  }
}

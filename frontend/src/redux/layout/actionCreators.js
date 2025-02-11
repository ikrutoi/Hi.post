import * as a from './actionTypes'

export const addSizeCard = (newSection) => {
  return {
    type: a.ADD_SIZECARD,
    payload: newSection,
  }
}

export const addRemSize = (newSection) => {
  return {
    type: a.ADD_REMSIZE,
    payload: newSection,
  }
}

export const addBtnNavHover = (newSection) => {
  return {
    type: a.ADD_BTNNAVHOVER,
    payload: newSection,
  }
}

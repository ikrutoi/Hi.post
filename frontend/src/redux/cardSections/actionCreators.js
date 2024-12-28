import * as a from './actionTypes'

export const addCardphoto = (newSection) => {
  return {
    type: a.ADD_CARDPHOTO,
    payload: newSection,
  }
}

export const addCardtext = (newSection) => {
  return {
    type: a.ADD_CARDTEXT,
    payload: newSection,
  }
}

export const addEnvelope = (newSection) => {
  return {
    type: a.ADD_ENVELOPE,
    payload: newSection,
  }
}

export const addDate = (newSection) => {
  return {
    type: a.ADD_DATE,
    payload: newSection,
  }
}

export const addAroma = (newSection) => {
  return {
    type: a.ADD_AROMA,
    payload: newSection,
  }
}

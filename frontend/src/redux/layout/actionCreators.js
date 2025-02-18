import * as a from './actionTypes'

export const addSizeCard = (newSection) => {
  return {
    type: a.ADD_SIZE_CARD,
    payload: newSection,
  }
}

export const addSizeMiniCard = (newSection) => {
  return {
    type: a.ADD_SIZE_MINI_CARD,
    payload: newSection,
  }
}

export const addRemSize = (newSection) => {
  return {
    type: a.ADD_REMSIZE,
    payload: newSection,
  }
}

// export const addBtnNavHover = (newSection) => {
//   return {
//     type: a.ADD_BTN_NAV_HOVER,
//     payload: newSection,
//   }
// }

export const addChoiceSection = (newSection) => {
  return {
    type: a.ADD_CHOICE_SECTION,
    payload: newSection,
  }
}

export const addBtnToolbar = (newSection) => {
  return {
    type: a.ADD_BTN_TOOLBAR,
    payload: newSection,
  }
}

export const addOriginalImage = (newSection) => {
  return {
    type: a.ADD_ORIGINAL_IMAGE,
    payload: newSection,
  }
}

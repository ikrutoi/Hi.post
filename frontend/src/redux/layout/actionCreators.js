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

export const addIndexDb = (newSection) => {
  return {
    type: a.ADD_INDEXDB,
    payload: newSection,
  }
}

export const addMemoryCrop = (newSection) => {
  return {
    type: a.ADD_MEMORY_CROP,
    payload: newSection,
  }
}

// export const setMyAddressLegendRef = (newSection) => {
//   return {
//     type: a.SET_MY_ADDRESS_LEGEND_REF,
//     payload: newSection,
//   }
// }

// export const setToAddressLegendRef = (newSection) => {
//   return {
//     type: a.SET_TO_ADDRESS_LEGEND_REF,
//     payload: newSection,
//   }
// }

// export const setMyAddressFieldsetRef = (newSection) => {
//   return {
//     type: a.SET_MY_ADDRESS_FIELDSET_REF,
//     payload: newSection,
//   }
// }

// export const setToAddressFieldsetRef = (newSection) => {
//   return {
//     type: a.SET_TO_ADDRESS_FIELDSET_REF,
//     payload: newSection,
//   }
// }

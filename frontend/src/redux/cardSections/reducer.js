import * as a from './actionTypes'

const initialState = []

const cardSectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_CARDPHOTO:
      return [action.payload]
    case a.ADD_CARDTEXT:
      return [action.payload]
    case a.ADD_ENVELOPE:
      return [action.payload]
    case a.ADD_DATE:
      return [action.payload]
    case a.ADD_AROMA:
      return [action.payload]
    default:
      return state
  }
}

export default cardSectionsReducer

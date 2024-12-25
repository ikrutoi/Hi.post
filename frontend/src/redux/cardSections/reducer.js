import * as a from './actionTypes'

const initialState = []

const cardSectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_SECTION:
      return [action.payload]
    default:
      return state
  }
}

export default cardSectionsReducer

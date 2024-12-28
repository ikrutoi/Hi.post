import * as a from './actionTypes'

const initialState = []

const aromaReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_AROMA:
      return [action.payload]
    default:
      return state
  }
}

export default aromaReducer

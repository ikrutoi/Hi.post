import * as a from './actionTypes'

const initialState = []

const cardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_CARD:
      return [...state, action.payload]
    default:
      return state
  }
}

export default cardsReducer

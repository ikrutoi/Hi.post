import * as a from './actionTypes'

const initialState = {
  sizeCard: {
    height: null,
    width: null,
  },
  remSize: null,
}

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_SIZECARD:
      return { ...state, sizeCard: { ...state.sizeCard, ...action.payload } }
    case a.ADD_REMSIZE:
      return { ...state, remSize: action.payload }
    default:
      return state
  }
}

export default layoutReducer

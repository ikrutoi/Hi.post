import * as a from './actionTypes'

const initialState = {
  aroma: null,
  date: null,
  photo: null,
  text: null,
  envelope: null,
}

const cardEditReducer = (state = initialState, action) => {
  console.log('*', action)
  switch (action.type) {
    // case a.ADD_CARDPHOTO:
    //   return [action.payload]
    // case a.ADD_CARDTEXT:
    //   return [action.payload]
    case a.ADD_ENVELOPE:
      return { ...state, date: action.payload }
    case a.ADD_DATE:
      return { ...state, date: action.payload }
    case a.ADD_AROMA:
      return { ...state, aroma: action.payload }
    default:
      return state
  }
}

export default cardEditReducer

import * as a from './actionTypes'

const initialState = {
  btn: null,
  bold: null,
  italic: null,
  fontSize: null,
  color: 'blue',
  justify: 'left',
}

const cardFormNavReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_CARDPHOTO:
      return { ...state, ...action.payload }
    case a.ADD_CARDTEXT1:
      return { ...state, ...action.payload }
    // case a.ADD_ENVELOPE:
    //   return { ...state, envelope: { ...state.envelope, ...action.payload } }
    // case a.ADD_DATE:
    //   return { ...state, date: action.payload }
    // case a.ADD_AROMA:
    //   return { ...state, aroma: action.payload }
    default:
      return state
  }
}

export default cardFormNavReducer

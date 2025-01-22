import * as a from './actionTypes'

const initialState = {
  aroma: null,
  date: null,
  photo: null,
  cardtext: {
    text: 'Hi )))',
    maxchars: 300,
    color: '#007aac',
    font: '',
    fontsize: 2.2,
    fontstyle: 'italic',
    fontweight: 500,
    lines: 1,
    focus: false,
    focusrow: 1,
  },
  envelope: { myaddress: null, toaddress: null },
}

const cardEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_CARDPHOTO:
      return { ...state, photo: action.payload }
    case a.ADD_CARDTEXT:
      return { ...state, cardtext: action.payload }
    case a.ADD_ENVELOPE:
      return { ...state, envelope: action.payload }
    case a.ADD_DATE:
      return { ...state, date: action.payload }
    case a.ADD_AROMA:
      return { ...state, aroma: action.payload }
    default:
      return state
  }
}

export default cardEditReducer

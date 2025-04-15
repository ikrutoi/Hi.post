import * as a from './actionTypes'

const initialState = {
  aroma: null,
  date: null,
  cardphoto: { url: null, source: null },
  cardtext: {
    text: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
    colorName: 'blueribbon',
    colorType: 'rgba(0, 122, 255, 0.8)',
    font: '',
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: 500,
    textAlign: 'left',
    lineHeight: null,
    miniCardtextStyle: { maxLines: null, fontSize: null, lineHeight: null },
  },
  envelope: {
    myaddress: { street: '', index: '', city: '', country: '', name: '' },
    toaddress: { street: '', index: '', city: '', country: '', name: '' },
  },
  // data: { minicardHeight: null },
}

const cardEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_CARDPHOTO:
      return { ...state, cardphoto: { ...state.cardphoto, ...action.payload } }
    case a.ADD_CARDTEXT:
      return { ...state, cardtext: { ...state.cardtext, ...action.payload } }
    case a.ADD_ENVELOPE:
      return { ...state, envelope: { ...state.envelope, ...action.payload } }
    case a.ADD_DATE:
      return { ...state, date: action.payload }
    case a.ADD_AROMA:
      return { ...state, aroma: action.payload }
    default:
      return state
  }
}

export default cardEditReducer

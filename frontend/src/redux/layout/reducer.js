import * as a from './actionTypes'

const initialState = {
  sizeCard: {
    height: null,
    width: null,
  },
  sizeMiniCard: {
    height: null,
    width: null,
  },
  remSize: null,
  // btnNavHover: null,
  choiceSection: { source: null, nameSection: null },
  btnToolbar: {
    firstBtn: null,
    secondBtn: null,
    section: null,
  },
}

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_SIZE_CARD:
      return { ...state, sizeCard: { ...state.sizeCard, ...action.payload } }
    case a.ADD_SIZE_MINI_CARD:
      return {
        ...state,
        sizeMiniCard: { ...state.sizeMiniCard, ...action.payload },
      }
    case a.ADD_BTN_TOOLBAR:
      return {
        ...state,
        btnToolbar: { ...state.btnToolbar, ...action.payload },
      }
    case a.ADD_REMSIZE:
      return { ...state, remSize: action.payload }
    // case a.ADD_BTN_NAV_HOVER:
    //   return { ...state, btnNavHover: action.payload }
    case a.ADD_CHOICE_SECTION:
      return {
        ...state,
        choiceSection: { ...state.choiceSection, ...action.payload },
      }
    default:
      return state
  }
}

export default layoutReducer

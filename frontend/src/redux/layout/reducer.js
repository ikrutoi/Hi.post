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
  indexDb: {
    hiPostImages: {
      originalImage: null,
      workingImage: null,
      miniImage: null,
    },
    userImages: {
      originalImage: null,
      workingImage: null,
      miniImage: null,
    },
  },
  memoryCrop: null,
  // myAddressLegendRef: null,
  // toAddressLegendRef: null,
  // myAddressFieldsetRef: null,
  // toAddressFieldsetRef: null,
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
    case a.ADD_MEMORY_CROP:
      return {
        ...state,
        memoryCrop: action.payload,
      }
    // case a.SET_MY_ADDRESS_LEGEND_REF:
    //   return {
    //     ...state,
    //     myAddressLegendRef: action.payload,
    //   }
    // case a.SET_TO_ADDRESS_LEGEND_REF:
    //   return {
    //     ...state,
    //     toAddressLegendRef: action.payload,
    //   }
    // case a.SET_MY_ADDRESS_FIELDSET_REF:
    //   return {
    //     ...state,
    //     myAddressFieldsetRef: action.payload,
    //   }
    // case a.SET_TO_ADDRESS_FIELDSET_REF:
    //   return {
    //     ...state,
    //     toAddressFieldsetRef: action.payload,
    //   }
    case a.ADD_INDEXDB:
      return {
        ...state,
        indexDb: {
          ...state.indexDb,
          hiPostImages: {
            ...state.indexDb.hiPostImages,
            ...action.payload.hiPostImages,
          },
          userImages: {
            ...state.indexDb.userImages,
            ...action.payload.userImages,
          },
        },
      }
    // return {
    //   ...state,
    //   indexDb: {
    //     ...state.indexDb,
    //     hiPostImages: {
    //       ...state.indexDb.hiPostImages,
    //       ...action.payload.hiPostImages,
    //     },
    //     userImages: {
    //       ...state.indexDb.hiPostImages,
    //       ...action.payload.userImages,
    //     },
    //   },
    // }
    default:
      return state
  }
}

export default layoutReducer

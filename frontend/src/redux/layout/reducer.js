import {
  choiceLetter,
  deleteSection,
  expendShopping,
  fullCard,
  fullCardPersonalId,
  selectedSection,
} from './actionCreators'
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
  choiceSection: { source: null, nameSection: null },
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
  // choiceAddress: {
  //   section: null,
  //   id: null,
  // },
  choiceMemorySection: {
    section: null,
    id: null,
  },
  choiceSave: null,
  choiceClip: null,
  deleteSection: null,
  selectedSection: null,
  activeSections: {
    cardphoto: false,
    cardtext: false,
    envelope: false,
    date: false,
    aroma: false,
  },
  memoryCrop: null,
  currentDate: null,
  fullCard: false,
  fullCardPersonalId: { shopping: null, blanks: null },
  addFullCard: false,
  selectedCard: false,
  expendMemoryCard: false,
  maxCardsList: null,
  sliderLetter: null,
  sliderLine: null,
  deltaEnd: null,
  personalId: null,
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
    case a.ADD_CHOICE_SECTION:
      return {
        ...state,
        choiceSection: { ...state.choiceSection, ...action.payload },
      }
    // case a.CHOICE_ADDRESS:
    //   return {
    //     ...state,
    //     choiceAddress: { ...state.choiceAddress, ...action.payload },
    //   }
    case a.CHOICE_MEMORY_SECTION:
      return {
        ...state,
        choiceMemorySection: {
          ...state.choiceMemorySection,
          ...action.payload,
        },
      }
    case a.FULLCARD_PERSONAL_ID:
      return {
        ...state,
        fullCardPersonalId: {
          ...state.fullCardPersonalId,
          ...action.payload,
        },
      }
    case a.ACTIVE_SECTIONS:
      return {
        ...state,
        activeSections: { ...state.activeSections, ...action.payload },
      }
    case a.ADD_MEMORY_CROP:
      return {
        ...state,
        memoryCrop: action.payload,
      }
    case a.CHOICE_SAVE:
      return {
        ...state,
        choiceSave: action.payload,
      }
    case a.CHOICE_CLIP:
      return {
        ...state,
        choiceClip: action.payload,
      }
    case a.SLIDER_LETTER:
      return {
        ...state,
        sliderLetter: action.payload,
      }
    case a.SLIDER_LINE:
      return {
        ...state,
        sliderLine: action.payload,
      }
    case a.DELTA_END:
      return {
        ...state,
        deltaEnd: action.payload,
      }
    case a.SELECTED_SECTION:
      return {
        ...state,
        selectedSection: action.payload,
      }
    case a.DELETE_SECTION:
      return {
        ...state,
        deleteSection: action.payload,
      }
    case a.ADDRESS_PERSONAL_ID:
      return {
        ...state,
        personalId: action.payload,
      }
    case a.FULL_CARD:
      return {
        ...state,
        fullCard: action.payload,
      }
    case a.ADD_FULL_CARD:
      return {
        ...state,
        addFullCard: action.payload,
      }
    case a.EXPEND_MEMORY_CARD:
      return {
        ...state,
        expendMemoryCard: action.payload,
      }
    case a.MAX_CARDS_LIST:
      return {
        ...state,
        maxCardsList: action.payload,
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

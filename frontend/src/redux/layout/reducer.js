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
  images: [
    { id: 'startImage', image: null },
    { id: 'startImage-save', image: null },
    { id: 'originalImage', image: null },
    { id: 'userImage', image: null },
    { id: 'userImage-save', image: null },
    { id: 'workingImage', image: null },
    { id: 'miniImage', image: null },
  ],
  workingImg: {
    originalImage: null,
    source: null,
    miniImage: null,
    userImage: null,
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
    case a.ADD_WORKING_IMG:
      return {
        ...state,
        workingImg: { ...state.workingImg, ...action.payload },
      }
    case a.ADD_IMAGES:
      return {
        ...state,
        images: state.images.map((image) => {
          const foundImage = action.payload.find((img) => img.id === image.id)
          return foundImage ? { ...image, image: foundImage.image } : image
        }),
      }
    default:
      return state
  }
}

export default layoutReducer

import { INFO_BUTTONS } from './actionTypes'

const initialState = {
  navHistory: false,
  crop: false,
  italic: true,
  left: true,
  download: false,
  envelopeClip: null,
  envelopeSave: null,
  miniAddressClose: null,
  cardphoto: {
    download: true,
    save: false,
    delete: false,
    turn: true,
    maximaze: false,
    crop: true,
  },
  cardphotoClick: null,
  cardtext: {
    italic: 'hover',
    fontSize: true,
    color: true,
    left: 'hover',
    center: true,
    right: true,
    justify: true,
  },
}

const infoButtonsReducer = (state = initialState, action) => {
  switch (action.type) {
    case INFO_BUTTONS:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export default infoButtonsReducer

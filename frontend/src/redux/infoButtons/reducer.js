import { INFO_BUTTONS } from './actionTypes'

const initialState = {
  crop: false,
  italic: true,
  left: true,
  download: false,
  envelopeSaveMyAddress: false,
  envelopeSaveToAddress: false,
  envelopeClip: null,
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

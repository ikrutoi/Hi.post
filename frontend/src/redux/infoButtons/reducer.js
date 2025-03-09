import { INFO_BUTTONS } from './actionTypes'

const initialState = {
  crop: false,
  italic: true,
  left: true,
  download: false,
  envelopeClip: null,
  envelopeSave: null,
  miniAddressClose: null,
  cardtext: {
    italic: 'hover',
    fontSize: true,
    color: 'rgb(0, 122, 172)',
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

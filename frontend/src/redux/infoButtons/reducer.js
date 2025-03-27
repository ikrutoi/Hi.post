import { INFO_BUTTONS } from './actionTypes'

const initialState = {
  navHistory: false,
  crop: false,
  italic: true,
  left: true,
  download: false,
  envelopeSave: null,
  miniAddressClose: null,
  status: { shopping: false },
  fullCard: { plus: false, delete: false },
  envelope: {
    myaddress: { save: false, delete: false, clip: false },
    toaddress: { save: false, delete: false, clip: false },
  },
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
    save: false,
    delete: false,
    clip: false,
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

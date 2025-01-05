import * as a from './actionTypes'

const initialState = []

const dateSelectionDateReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_SELECTION_DATE:
      return [action.payload]
    case a.DELETE_SELECTION_DATE:
      return [action.payload]
    default:
      return state
  }
}

export default dateSelectionDateReducer

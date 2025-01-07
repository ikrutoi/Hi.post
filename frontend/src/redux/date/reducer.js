import * as a from './actionTypes'

const initialState = []

const dateReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ADD_DATE:
      return [action.payload]
    default:
      return state
  }
}

export default dateReducer

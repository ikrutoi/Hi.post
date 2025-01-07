import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardEditReducer from './cardEdit/reducer'
// import dateSelectionDateReducer from './dateSelectionDate/reducer'
// import dateReducer from './date/reducer'
// import aromaReducer from './aroma/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    // date: dateReducer,
    // aroma: aromaReducer,
    cardEdit: cardEditReducer,
    // dateSelectionDate: dateSelectionDateReducer,
  },
})

export default store

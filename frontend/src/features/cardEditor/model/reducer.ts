import { combineReducers } from '@reduxjs/toolkit'
import { aromaReducer } from './slices/aromaSlice'
import { dateReducer } from './slices/dateSlice'
import { cardphotoReducer } from './slices/cardphotoSlice'
import { cardtextReducer } from './slices/cardtextSlice'
import { envelopeReducer } from './slices/envelopeSlice'

export const cardEditorReducer = combineReducers({
  aroma: aromaReducer,
  date: dateReducer,
  cardphoto: cardphotoReducer,
  cardtext: cardtextReducer,
  envelope: envelopeReducer,
})

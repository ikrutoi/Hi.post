import { combineReducers } from '@reduxjs/toolkit'

import { cardSizeReducer } from './model/slices/cardSizeSlice'
import { imageDbReducer } from './model/slices/imageDbSlice'
import { sectionReducer } from './model/slices/sectionSlice'
import { toolbarReducer } from './model/slices/toolbarSlice'
import { activeSectionsReducer } from './model/slices/activeSectionsSlice'
import { memoryReducer } from './model/slices/memorySlice'
import { cardStateReducer } from './model/slices/cardStateSlice'
import { sliderReducer } from './model/slices/sliderSlice'
import { cartReducer } from './model/slices/cartSlice'
import { personalReducer } from './model/slices/personalSlice'

export const layoutLegacyReducer = combineReducers({
  cardSize: cardSizeReducer,
  imageDb: imageDbReducer,
  section: sectionReducer,
  toolbar: toolbarReducer,
  activeSections: activeSectionsReducer,
  memory: memoryReducer,
  cardState: cardStateReducer,
  slider: sliderReducer,
  cart: cartReducer,
  personal: personalReducer,
})

export * from './model/selectors'
export * from './model/types'

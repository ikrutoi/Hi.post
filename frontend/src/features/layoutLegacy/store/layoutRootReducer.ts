import { combineReducers } from '@reduxjs/toolkit'
import * as layoutSlices from './index'

export const layoutRootReducer = combineReducers({
  size: layoutSlices.layoutSizeReducer,
  selection: layoutSlices.layoutSelectionReducer,
  memory: layoutSlices.layoutMemoryReducer,
  toolbar: layoutSlices.layoutToolbarReducer,
  cardState: layoutSlices.layoutCardStateReducer,
  slider: layoutSlices.layoutSliderReducer,
  shopping: layoutSlices.layoutCartReducer,
})

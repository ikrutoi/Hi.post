import { combineReducers } from '@reduxjs/toolkit'

import sizeReducer from './sizeSlice'
import memoryReducer from './memorySlice'
import metaReducer from './metaSlice'
import toolbarReducer from './toolbarSlice'
import statusReducer from './statusSlice'
import layoutUiReducer from './layoutUiSlice'
import fullCardButtonsReducer from './fullCardButtonsSlice'
import sectionReducer from './sectionSlice'
import activeReducer from './activeSectionSlice'

export const layoutReducer = combineReducers({
  size: sizeReducer,
  memory: memoryReducer,
  meta: metaReducer,
  toolbar: toolbarReducer,
  status: statusReducer,
  ui: layoutUiReducer,
  buttons: fullCardButtonsReducer,
  section: sectionReducer,
  active: activeReducer,
})

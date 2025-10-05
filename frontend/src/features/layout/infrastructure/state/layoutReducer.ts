import { combineReducers } from '@reduxjs/toolkit'
import sectionReducer from './section.slice'
import sizeReducer from './size.slice'
import memoryReducer from './memory.slice'
import metaReducer from './meta.slice'
import uiReducer from './ui.slice'

export interface LayoutState {
  section: ReturnType<typeof sectionReducer>
  size: ReturnType<typeof sizeReducer>
  memory: ReturnType<typeof memoryReducer>
  meta: ReturnType<typeof metaReducer>
  ui: ReturnType<typeof uiReducer>
}

export const layoutReducer = combineReducers({
  section: sectionReducer,
  size: sizeReducer,
  memory: memoryReducer,
  meta: metaReducer,
  ui: uiReducer,
})

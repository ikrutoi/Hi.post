import { createSlice } from '@reduxjs/toolkit'
import { initialState } from './layoutInitialState'

import { sizeReducers } from './layoutReducers/sizeReducers'
import * as sectionReducers from './layoutReducers/sectionReducers'
import * as imageReducers from './layoutReducers/imageReducers'
import * as toolbarReducers from './layoutReducers/toolbarReducers'
import * as memoryReducers from './layoutReducers/memoryReducers'
import * as metaReducers from './layoutReducers/metaReducers'

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    ...sizeReducers,
    ...sectionReducers,
    ...imageReducers,
    ...toolbarReducers,
    ...memoryReducers,
    ...metaReducers,
  },
})

export default layoutSlice.reducer
export const layoutActions = layoutSlice.actions

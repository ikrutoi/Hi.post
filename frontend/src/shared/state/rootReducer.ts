import { combineReducers } from '@reduxjs/toolkit'

import cardBuilderReducer from '@features/cardBuilder/state/cardBuilder.slice'

import toolbarReducer from './toolbar/toolbar.slice'

const rootReducer = combineReducers({
  cardBuilder: cardBuilderReducer,
  toolbar: toolbarReducer,
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>

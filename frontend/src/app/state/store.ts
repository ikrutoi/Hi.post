import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from './rootReducer'
import { authListenerMiddleware } from '@middleware/authListener'
import { cardEditorSaga } from '@app/middleware'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .prepend(authListenerMiddleware.middleware)
      .concat(sagaMiddleware),
})

sagaMiddleware.run(cardEditorSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './rootReducer'
import { authListenerMiddleware } from '@middleware/authListener'
import { envelopeToolbarSyncMiddleware } from '@app/middleware/envelopeToolbarSyncMiddleware'
import { rootSaga } from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .prepend(authListenerMiddleware.middleware)
      .prepend(envelopeToolbarSyncMiddleware)
      .concat(sagaMiddleware),
})

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       thunk: false,
//       serializableCheck: {
//         ignoredActions: [
//           'cardphoto/uploadUserImage',
//           'cardphoto/setProcessedImage',
//           'assetRegistry/setAsset',
//           'assetRegistry/setAssets',
//         ],
//         ignoredActionPaths: [
//           'payload.full.blob',
//           'payload.thumbnail.blob',
//           'payload.image.full.blob',
//         ],
//         ignoredPaths: ['cardphoto.state.base.user.image.full.blob'],
//       },
//     })
//       .prepend(authListenerMiddleware.middleware)
//       .concat(sagaMiddleware),
// })

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

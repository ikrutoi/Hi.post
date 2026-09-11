import { createListenerMiddleware } from '@reduxjs/toolkit'
import {
  cancelFileDialog,
  openFileDialog,
  resetFileDialog,
} from '@cardphoto/infrastructure/state'
import { openCardphotoFilePickerFromAction } from '@cardphoto/application/helpers/cardphotoFilePickerBridge'

export const cardphotoFilePickerListenerMiddleware = createListenerMiddleware()

cardphotoFilePickerListenerMiddleware.startListening({
  actionCreator: openFileDialog,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(resetFileDialog())
    if (!openCardphotoFilePickerFromAction()) {
      listenerApi.dispatch(cancelFileDialog())
    }
  },
})

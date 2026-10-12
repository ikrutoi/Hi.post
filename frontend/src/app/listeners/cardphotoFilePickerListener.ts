import { createListenerMiddleware } from '@reduxjs/toolkit'
import {
  cancelFileDialog,
  openFileDialog,
  resetFileDialog,
} from '@cardphoto/infrastructure/state'
import {
  openCardphotoFilePickerFromAction,
  wasCardphotoFilePickerOpenedRecently,
} from '@cardphoto/application/helpers/cardphotoFilePickerBridge'

export const cardphotoFilePickerListenerMiddleware = createListenerMiddleware()

cardphotoFilePickerListenerMiddleware.startListening({
  actionCreator: openFileDialog,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(resetFileDialog())
    /** Click already opened the gallery. Cancelling here closes it on mobile. */
    if (wasCardphotoFilePickerOpenedRecently()) return
    if (!openCardphotoFilePickerFromAction()) {
      listenerApi.dispatch(cancelFileDialog())
    }
  },
})

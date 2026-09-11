import { createListenerMiddleware } from '@reduxjs/toolkit'
import { openFileDialog } from '@cardphoto/infrastructure/state'
import { openCardphotoFilePickerFromAction } from '@cardphoto/application/helpers/cardphotoFilePickerBridge'

export const cardphotoFilePickerListenerMiddleware = createListenerMiddleware()

cardphotoFilePickerListenerMiddleware.startListening({
  actionCreator: openFileDialog,
  effect: () => {
    openCardphotoFilePickerFromAction()
  },
})

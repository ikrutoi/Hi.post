import { AppDispatch } from '@app/state'

import { cardphotoImageHistoryActions } from '../../infrastructure/stateLayout'
import { createImageUrl, generateImageId } from '../../utils'
import { ImageStage, ImageVersion } from '../../domain/typesLayout'

export const cardphotoImageHistoryController = (dispatch: AppDispatch) => ({
  addUserImage: (blob: Blob) => {
    const version: ImageVersion = {
      idImage: generateImageId('user'),
      image: blob,
      stage: 'original',
      url: createImageUrl(blob),
      timestamp: Date.now(),
    }
    dispatch(
      cardphotoImageHistoryActions.addImageVersion({ branch: 'user', version })
    )
  },

  addUserCrop: (blob: Blob) => {
    const version: ImageVersion = {
      idImage: generateImageId('user-crop'),
      image: blob,
      stage: 'crop',
      url: createImageUrl(blob),
      timestamp: Date.now(),
    }
    dispatch(
      cardphotoImageHistoryActions.addImageVersion({ branch: 'user', version })
    )
  },

  addStockCrop: (blob: Blob) => {
    const version: ImageVersion = {
      idImage: generateImageId('stock'),
      image: blob,
      stage: 'crop',
      url: createImageUrl(blob),
      timestamp: Date.now(),
    }
    dispatch(
      cardphotoImageHistoryActions.addImageVersion({ branch: 'stock', version })
    )
    dispatch(cardphotoImageHistoryActions.setActiveBranch('stock'))
    dispatch(cardphotoImageHistoryActions.setActiveIndex(0))
  },

  revertUserToStock: () => {
    dispatch(cardphotoImageHistoryActions.clearUserImages())
    dispatch(cardphotoImageHistoryActions.setActiveBranch('stock'))
    dispatch(cardphotoImageHistoryActions.setActiveIndex(0))
  },

  revertStep: () => {
    dispatch(cardphotoImageHistoryActions.revertToPrevious())
  },

  setActive: (branch: 'stock' | 'user', index: number) => {
    dispatch(cardphotoImageHistoryActions.setActiveBranch(branch))
    dispatch(cardphotoImageHistoryActions.setActiveIndex(index))
  },
})

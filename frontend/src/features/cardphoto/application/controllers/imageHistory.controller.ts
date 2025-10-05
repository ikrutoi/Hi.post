import { AppDispatch } from '@app/state'

import { imageHistoryActions } from '../../infrastructure/state'
import { createImageUrl, generateImageId } from '../../utils'
import { ImageStage, ImageVersion } from '../../domain/types'

export const imageHistoryController = (dispatch: AppDispatch) => ({
  addUserImage: (blob: Blob) => {
    const version: ImageVersion = {
      idImage: generateImageId('user'),
      image: blob,
      stage: 'original',
      url: createImageUrl(blob),
      timestamp: Date.now(),
    }
    dispatch(imageHistoryActions.addImageVersion({ branch: 'user', version }))
  },

  addUserCrop: (blob: Blob) => {
    const version: ImageVersion = {
      idImage: generateImageId('user-crop'),
      image: blob,
      stage: 'crop',
      url: createImageUrl(blob),
      timestamp: Date.now(),
    }
    dispatch(imageHistoryActions.addImageVersion({ branch: 'user', version }))
  },

  addStockCrop: (blob: Blob) => {
    const version: ImageVersion = {
      idImage: generateImageId('stock'),
      image: blob,
      stage: 'crop',
      url: createImageUrl(blob),
      timestamp: Date.now(),
    }
    dispatch(imageHistoryActions.addImageVersion({ branch: 'stock', version }))
    dispatch(imageHistoryActions.setActiveBranch('stock'))
    dispatch(imageHistoryActions.setActiveIndex(0))
  },

  revertUserToStock: () => {
    dispatch(imageHistoryActions.clearUserImages())
    dispatch(imageHistoryActions.setActiveBranch('stock'))
    dispatch(imageHistoryActions.setActiveIndex(0))
  },

  revertStep: () => {
    dispatch(imageHistoryActions.revertToPrevious())
  },

  setActive: (branch: 'stock' | 'user', index: number) => {
    dispatch(imageHistoryActions.setActiveBranch(branch))
    dispatch(imageHistoryActions.setActiveIndex(index))
  },
})

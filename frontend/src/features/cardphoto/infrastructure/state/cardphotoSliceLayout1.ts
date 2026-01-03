import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CARDPHOTO_CONFIG, CARD_SCALE_CONFIG } from '@shared/config/constants'
import {
  calculateInitialCrop,
  calculateCropPosition,
} from '../../application/helpers'
import { applyOperations } from '../selectors'
import type {
  ImageMeta,
  ImageOperation,
  ImageHistory,
  WorkingConfig,
  CropArea,
} from '../../domain/types'

const aspectRatio = CARD_SCALE_CONFIG.aspectRatio

export interface CardphotoState {
  history: ImageHistory | null
  isComplete: boolean
}

const initialState: CardphotoState = {
  history: null,
  isComplete: false,
}

export const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    initCardphoto(state) {
      state.history = null
      state.isComplete = false
    },

    initStockImage(state, action: PayloadAction<ImageMeta>) {
      const meta = action.payload
      state.history = {
        original: meta,
        operations: [{ type: 'initial' }],
        activeIndex: 0,
        workingConfig: { orientation: 0, crop: null },
        lastApplied: null,
        finalImage: meta,
      }
      state.isComplete = false
    },

    setFinalImage(state, action: PayloadAction<ImageMeta>) {
      if (state.history) {
        state.history.finalImage = action.payload
      }
    },

    resetCrop(
      state,
      action: PayloadAction<{
        imageWidth: number
        imageHeight: number
        aspectRatio: number
        imageAspectRatio: number
        imageLeft: number
        imageTop: number
        imageId: string
      }>
    ) {
      if (!state.history) return
      const {
        imageWidth,
        imageHeight,
        aspectRatio,
        imageAspectRatio,
        imageLeft,
        imageTop,
        imageId,
      } = action.payload

      const cropSize = calculateInitialCrop(
        imageWidth,
        imageHeight,
        aspectRatio,
        imageAspectRatio
      )
      const cropPosition = calculateCropPosition(
        cropSize.x,
        cropSize.y,
        aspectRatio,
        imageAspectRatio,
        imageLeft,
        imageTop
      )

      state.history.workingConfig.crop = {
        width: cropSize.width,
        height: cropSize.height,
        x: cropPosition?.x ?? 0,
        y: cropPosition?.y ?? 0,
        aspectRatio,
      }
    },

    updateCrop(state, action: PayloadAction<Partial<CropArea>>) {
      if (!state.history || !state.history.workingConfig.crop) return
      Object.assign(state.history.workingConfig.crop, action.payload)
    },

    clearCrop(state) {
      if (!state.history) return
      state.history.workingConfig.crop = null
    },

    addOperation(state, action: PayloadAction<ImageOperation>) {
      if (!state.history) return
      const op = action.payload

      state.history.operations = state.history.operations.slice(
        0,
        state.history.activeIndex + 1
      )

      switch (op.type) {
        case 'crop': {
          state.history.workingConfig.crop = op.payload.area
          state.history.workingConfig.orientation = op.payload.orientation

          const crops = state.history.operations.filter(
            (o) => o.type === 'crop'
          )
          if (crops.length >= CARDPHOTO_CONFIG.maxCropSteps) {
            const firstCropIndex = state.history.operations.findIndex(
              (o) => o.type === 'crop'
            )
            if (firstCropIndex > 0) {
              state.history.operations.splice(firstCropIndex, 1)
            }
          }

          state.history.operations.push(op)
          break
        }

        case 'apply': {
          state.history.operations = state.history.operations.filter(
            (o) => o.type !== 'apply'
          )

          const snapshot: WorkingConfig = { ...state.history.workingConfig }
          snapshot.orientation = op.payload.orientation

          const newApply: ImageOperation = {
            type: 'apply',
            payload: {
              snapshot,
              orientation: op.payload.orientation,
            },
          }

          state.history.lastApplied = snapshot
          state.history.operations.push(newApply)
          break
        }

        case 'initial': {
          state.history.operations = [{ type: 'initial' }]
          state.history.activeIndex = 0
          state.history.workingConfig = { orientation: 0, crop: null }
          state.history.lastApplied = null
          break
        }

        default: {
          state.history.operations.push(op)
          break
        }
      }

      state.history.activeIndex = state.history.operations.length - 1
      state.history.finalImage = applyOperations(
        state.history.original,
        state.history.operations.slice(0, state.history.activeIndex + 1)
      )
    },

    undo(state) {
      if (!state.history) return
      if (state.history.activeIndex <= 0) return
      state.history.activeIndex -= 1

      const op = state.history.operations[state.history.activeIndex]
      if (op.type === 'crop') {
        state.history.workingConfig.crop = op.payload.area
        state.history.workingConfig.orientation = op.payload.orientation
      }
      if (op.type === 'apply') {
        state.history.workingConfig = { ...op.payload.snapshot }
      }
      state.history.finalImage = applyOperations(
        state.history.original,
        state.history.operations.slice(0, state.history.activeIndex + 1)
      )
    },

    redo(state) {
      if (!state.history) return
      if (state.history.activeIndex >= state.history.operations.length - 1)
        return
      state.history.activeIndex += 1

      const op = state.history.operations[state.history.activeIndex]
      if (op.type === 'crop') {
        state.history.workingConfig.crop = op.payload.area
        state.history.workingConfig.orientation = op.payload.orientation
      }
      if (op.type === 'apply') {
        state.history.workingConfig = { ...op.payload.snapshot }
      }
      state.history.finalImage = applyOperations(
        state.history.original,
        state.history.operations.slice(0, state.history.activeIndex + 1)
      )
    },

    reset(state) {
      if (state.history) {
        state.history.operations = [{ type: 'initial' }]
        state.history.activeIndex = 0
        state.history.workingConfig = { orientation: 0, crop: null }
        state.history.lastApplied = null
        state.history.finalImage = state.history.original
      }
      state.isComplete = false
    },

    markComplete(state) {
      state.isComplete = true
    },

    cancelSelection(state) {
      state.history = null
      state.isComplete = false
    },

    uploadImage(_state, _action: PayloadAction<ImageMeta>) {},
  },
})

export const {
  initCardphoto,
  initStockImage,
  setFinalImage,
  resetCrop,
  updateCrop,
  clearCrop,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
  uploadImage,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer

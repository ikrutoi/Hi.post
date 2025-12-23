import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ImageHistory, ImageVersion } from '../../domain/typesLayout'

const initialState: ImageHistory = {
  stockImages: [],
  userImages: [],
  activeBranch: 'stock',
  activeIndex: 0,
}

export const imageHistorySlice = createSlice({
  name: 'imageHistory',
  initialState,
  reducers: {
    setActiveBranch(state, action: PayloadAction<'stock' | 'user'>) {
      state.activeBranch = action.payload
      state.activeIndex = 0
    },
    setActiveIndex(state, action: PayloadAction<number>) {
      state.activeIndex = action.payload
    },
    addImageVersion(
      state,
      action: PayloadAction<{ branch: 'stock' | 'user'; version: ImageVersion }>
    ) {
      const { branch, version } = action.payload
      const target = branch === 'stock' ? state.stockImages : state.userImages
      target.push(version)
      state.activeBranch = branch
      state.activeIndex = target.length - 1
    },
    revertToPrevious(state) {
      if (state.activeIndex > 0) {
        state.activeIndex -= 1
      }
    },
    clearUserImages(state) {
      state.userImages = []
      state.activeBranch = 'stock'
      state.activeIndex = 0
    },
    clearBranch(state, action: PayloadAction<'stock' | 'user'>) {
      if (action.payload === 'stock') state.stockImages = []
      else state.userImages = []
    },
  },
})

export const {
  setActiveBranch,
  setActiveIndex,
  addImageVersion,
  revertToPrevious,
  clearUserImages,
  clearBranch,
} = imageHistorySlice.actions

export default imageHistorySlice.reducer

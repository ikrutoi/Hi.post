import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { calcSizeCard } from '../../helpers'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { SizeState, SizeCard, LayoutOrientation } from '../../domain/types'

const initialState: SizeState = {
  sizeCard: {
    width: 0,
    height: 0,
    orientation: 'landscape',
    aspectRatio: CARD_SCALE_CONFIG.aspectRatio,
  },
  sizeMiniCard: {
    width: 0,
    height: 0,
    orientation: 'landscape',
    aspectRatio: CARD_SCALE_CONFIG.aspectRatio,
  },
  remSize: null,
  viewportSize: { width: 0, height: 0, viewportSize: null },
  scale: null,
  sectionMenuHeight: null,
}

export const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    setSizeCard(state, action: PayloadAction<Partial<SizeCard>>) {
      console.log('setSizeCard', action.payload, action.type)
      state.sizeCard = {
        ...state.sizeCard,
        ...action.payload,
      }
    },
    setSizeMiniCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeMiniCard = {
        ...state.sizeMiniCard,
        ...action.payload,
      }
    },
    setRemSize(state, action: PayloadAction<number | null>) {
      state.remSize = action.payload
    },
    setScale(state, action: PayloadAction<number | null>) {
      state.scale = action.payload
    },
    setSectionMenuHeight(state, action: PayloadAction<number | null>) {
      state.sectionMenuHeight = action.payload
    },
    setViewportSize(state, action: PayloadAction<Partial<SizeCard>>) {
      state.viewportSize = {
        ...state.viewportSize,
        ...action.payload,
      }
    },

    setCardOrientation(
      state,
      action: PayloadAction<{
        orientation: LayoutOrientation
        viewportHeight: number
      }>,
    ) {
      const { orientation, viewportHeight } = action.payload
      const { width, height } = calcSizeCard(viewportHeight, orientation)

      state.sizeCard = {
        width: width || state.sizeCard.width,
        height: height || state.sizeCard.height,
        orientation,
        aspectRatio: CARD_SCALE_CONFIG.aspectRatio,
      }
    },
  },
})

export const {
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
  setScale,
  setSectionMenuHeight,
  setViewportSize,
  setCardOrientation,
} = sizeSlice.actions

export default sizeSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { calcSizeCard } from '../../helpers'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type {
  SizeState,
  SizeCard,
  LayoutOrientation,
  ViewportSizeState,
  SizeBox,
} from '../../domain/types'
import { number } from 'zod'

const initialState: SizeState = {
  // sizeToolbarContour: {
  //   width: 0,
  //   height: 0,
  // },
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
  // sizeItemCalendar: {
  //   width: 0,
  //   height: 0,
  // },
  remSize: 16,
  viewportSize: { width: 0, height: 0, viewportSize: null },
  // scale: null,
  sectionMenuHeight: null,
}

export const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    setSizeCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeCard = {
        ...state.sizeCard,
        ...action.payload,
      }
    },

    // setSizeItemCalendar(state, action: PayloadAction<Partial<SizeBox>>) {
    //   state.sizeItemCalendar = {
    //     ...state.sizeItemCalendar,
    //     ...action.payload,
    //   }
    // },

    // setSizeToolbarContour(state, action: PayloadAction<Partial<SizeBox>>) {
    //   state.sizeToolbarContour = {
    //     ...state.sizeToolbarContour,
    //     ...action.payload,
    //   }
    // },

    setSizeMiniCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeMiniCard = {
        ...state.sizeMiniCard,
        ...action.payload,
      }
    },

    setRemSize(state, action: PayloadAction<number>) {
      state.remSize = action.payload
    },

    // setScale(state, action: PayloadAction<number | null>) {
    //   state.scale = action.payload
    // },

    setSectionMenuHeight(state, action: PayloadAction<number | null>) {
      state.sectionMenuHeight = action.payload
    },

    setViewportSize(state, action: PayloadAction<Partial<ViewportSizeState>>) {
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
  // setSizeToolbarContour,
  setSizeCard,
  setSizeMiniCard,
  // setSizeItemCalendar,
  setRemSize,
  // setScale,
  setSectionMenuHeight,
  setViewportSize,
  setCardOrientation,
} = sizeSlice.actions

export default sizeSlice.reducer

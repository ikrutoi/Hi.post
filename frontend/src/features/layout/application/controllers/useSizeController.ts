import { AppDispatch } from '@app/state'
import {
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
  setScale,
  setSectionMenuHeight,
  setViewportSize,
  setCardOrientation,
} from '../../infrastructure/state'
import type {
  SizeCard,
  ViewportSizeState,
  LayoutOrientation,
} from '../../domain/types'

export const useSizeController = (dispatch: AppDispatch) => ({
  setSizeCard: (payload: Partial<SizeCard>) => dispatch(setSizeCard(payload)),
  setSizeMiniCard: (payload: Partial<SizeCard>) =>
    dispatch(setSizeMiniCard(payload)),
  setRemSize: (value: number | null) => dispatch(setRemSize(value)),
  setScale: (value: number | null) => dispatch(setScale(value)),
  setSectionMenuHeight: (value: number | null) =>
    dispatch(setSectionMenuHeight(value)),
  setViewportSize: (payload: Partial<ViewportSizeState>) =>
    dispatch(setViewportSize(payload)),

  setCardOrientation: (
    orientation: LayoutOrientation,
    viewportHeight: number
  ) => dispatch(setCardOrientation({ orientation, viewportHeight })),
})

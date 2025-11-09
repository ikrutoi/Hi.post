import { AppDispatch } from '@app/state'
import {
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
  setScale,
  setViewportSize,
} from '../../infrastructure/state'
import type { SizeCard, ViewportSizeState } from '../../domain/types'

export const useSizeController = (dispatch: AppDispatch) => ({
  setSizeCard: (payload: Partial<SizeCard>) => dispatch(setSizeCard(payload)),
  setSizeMiniCard: (payload: Partial<SizeCard>) =>
    dispatch(setSizeMiniCard(payload)),
  setRemSize: (value: number | null) => dispatch(setRemSize(value)),
  setScale: (value: number | null) => dispatch(setScale(value)),
  setViewportSize: (payload: Partial<ViewportSizeState>) =>
    dispatch(setViewportSize(payload)),
})

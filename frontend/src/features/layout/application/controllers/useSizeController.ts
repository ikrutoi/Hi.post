import { AppDispatch } from '@app/state'
import {
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
} from '../../infrastructure/state'
import type { SizeCard } from '../../domain/types'

export const useSizeController = (dispatch: AppDispatch) => ({
  setSizeCard: (payload: Partial<SizeCard>) => dispatch(setSizeCard(payload)),
  setSizeMiniCard: (payload: Partial<SizeCard>) =>
    dispatch(setSizeMiniCard(payload)),
  setRemSize: (value: number | null) => dispatch(setRemSize(value)),
})

import { AppDispatch } from '@app/state'
import {
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
} from '../../infrastructure/state/size.slice'
import type { SizeCard } from '../../domain/types'

export const sizeController = (dispatch: AppDispatch) => ({
  setSizeCard: (payload: Partial<SizeCard>) => dispatch(setSizeCard(payload)),
  setSizeMiniCard: (payload: Partial<SizeCard>) =>
    dispatch(setSizeMiniCard(payload)),
  setRemSize: (value: number | null) => dispatch(setRemSize(value)),
})

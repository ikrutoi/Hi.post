import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateCardtext } from './cardtextSlice'
import { selectCardtext } from './cardtextSelectors'
import type { CardtextState } from '../domain/cardtext.types'

export const useCardtext = () => {
  const dispatch = useAppDispatch()
  const cardtextState = useAppSelector(selectCardtext)

  const updateCardtextState = (payload: Partial<CardtextState>) => {
    dispatch(updateCardtext(payload))
  }

  return {
    cardtextState,
    updateCardtextState,
  }
}

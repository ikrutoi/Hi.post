import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateCardtext } from '../../infrastructure/state/cardtext.slice'
import { selectCardtext } from '../../infrastructure/selectors/cardtext.selectors'
import type { CardtextState } from '../../domain/types'

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

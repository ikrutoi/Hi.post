import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import { selectCardtext } from '../../infrastructure/selectors'
import { setCardtext } from '../../infrastructure/state'
import type { CardtextState } from '../../domain/types'

export const useCardText = () => {
  const dispatch = useAppDispatch()
  const cardtext = useSelector(selectCardtext)

  return {
    cardtext,
    updateCardText: (payload: Partial<CardtextState>) =>
      dispatch(setCardtext(payload)),
  }
}

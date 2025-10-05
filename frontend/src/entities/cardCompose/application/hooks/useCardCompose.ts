import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectCardCompose,
  selectCardComposeIsComplete,
} from '../../infrastructure/selectors'
import { updateCardCompose, resetCardCompose } from '../../infrastructure/state'
import type { CardCompose } from '../../domain/types'
export const useCardCompose = () => {
  const dispatch = useAppDispatch()
  const cardCompose = useSelector(selectCardCompose)
  const isComplete = useSelector(selectCardComposeIsComplete)

  return {
    cardCompose,
    isComplete,
    updateCompose: (payload: Partial<CardCompose>) =>
      dispatch(updateCardCompose(payload)),
    resetCompose: () => dispatch(resetCardCompose()),
  }
}

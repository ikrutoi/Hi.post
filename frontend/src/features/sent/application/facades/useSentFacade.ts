import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { sentActions } from '../state/sentSlice'
import { selectSentCards, selectSentCount } from '../state/sentSelectors'
import type { SentPostcard } from '../../domain/sentModel'

export const useSentFacade = () => {
  const dispatch = useAppDispatch()
  const sentCards = useAppSelector(selectSentCards)
  const countSent = useAppSelector(selectSentCount)

  return {
    sentCards,
    countSent,
    setSentCards: (payload: SentPostcard[]) =>
      dispatch(sentActions.setSentCards(payload)),
    addSentCard: (card: SentPostcard) =>
      dispatch(sentActions.addSentCard(card)),
    clearSentCards: () => dispatch(sentActions.clearSentCards()),
  }
}

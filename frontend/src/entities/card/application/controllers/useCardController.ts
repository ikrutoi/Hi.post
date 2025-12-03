import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  addCard,
  updateCardStatus,
  removeCard,
} from '../../infrastructure/state'
import {
  selectCards,
  selectCardById,
  selectCardsByStatus,
} from '../../infrastructure/selectors'
import type { CardStatus } from '../../domain/types'
import type { CardphotoState } from '@entities/cardphoto/domain/types'
import type { CardtextState } from '@entities/cardtext/domain/types'
import type { EnvelopeState } from '@envelope/domain/types/envelope.types'
import type { AromaItem } from '@entities/aroma'
import type { DispatchDate } from '@entities/date'

export const useCardController = () => {
  const dispatch = useAppDispatch()

  const cards = useAppSelector(selectCards)

  const getCardById = (id: string) =>
    useAppSelector((s) => selectCardById(s, id))

  const getCardsByStatus = (status: CardStatus) =>
    useAppSelector((s) => selectCardsByStatus(s, status))

  const createCard = (
    id: string,
    status: CardStatus,
    cardphoto: CardphotoState,
    cardtext: CardtextState,
    envelope: EnvelopeState,
    aroma: AromaItem,
    date: DispatchDate
  ) => {
    dispatch(
      addCard({ id, status, cardphoto, cardtext, envelope, aroma, date })
    )
  }

  const changeStatus = (id: string, status: CardStatus) => {
    dispatch(updateCardStatus({ id, status }))
  }

  const deleteCard = (id: string) => {
    dispatch(removeCard({ id }))
  }

  return {
    state: {
      cards,
      getCardById,
      getCardsByStatus,
    },
    actions: {
      createCard,
      changeStatus,
      deleteCard,
    },
  }
}

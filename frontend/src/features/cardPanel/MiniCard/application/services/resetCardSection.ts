import { AppDispatch } from '@app/state'
import { emptyEnvelope } from '@entities/envelope/domain/types'
import { useCardphotoFacade } from '@/features/cardphoto/application/facadesLayout'
import { useLayoutFacade } from '@layout/application/facades'
import {
  cardphotoActions,
  cardtextActions,
  envelopeActions,
  aromaActions,
  dateActions,
} from '@features/actions'
import { imageAdapter } from '@db/adapters/storeAdapters'
import type { CardSection } from '@entities/card/domain/types'

export const resetCardSection = async (
  cardSection: CardSection,
  dispatch: AppDispatch
) => {
  const { actions } = useLayoutFacade()
  actions.setActiveSection(null)
  const { update } = useCardphotoFacade()

  switch (cardSection) {
    case 'aroma':
      dispatch(aromaActions.updateAroma(null))
      break

    case 'date':
      dispatch(dateActions.updateDispatchDate({ isSelected: false }))
      break

    case 'envelope':
      dispatch(envelopeActions.setEnvelope(emptyEnvelope))
      break

    case 'cardphoto':
      await Promise.all([
        imageAdapter.stockImages.deleteByLocalId('miniImage'),
        imageAdapter.userImages.deleteByLocalId('miniImage'),
      ])
      update
      dispatch(
        cardphotoActions.updateCardphoto({
          stockImages: { miniImage: false },
          userImages: { miniImage: false },
        })
      )
      break

    case 'cardtext':
      dispatch(
        cardtextActions.updateCardtext({
          text: [
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
        })
      )
      break
  }
}

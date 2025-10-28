import { AppDispatch } from '@app/state'
import { emptyEnvelope } from '@entities/envelope/domain/types'
import { useLayoutFacade } from '@layout/application/facades'
import {
  cardphotoActions,
  cardtextActions,
  envelopeActions,
  aromaActions,
  dateActions,
} from '@features/actions'
import { userImagesAdapter } from '@/db/adapters/storeAdapters/userImagesAdapter'
import { stockImagesAdapter } from '@/db/adapters/storeAdapters/stockImagesAdapter'
import type { CardSectionName } from '@shared/types'

export const resetCardSection = async (
  section: CardSectionName,
  dispatch: AppDispatch
) => {
  const { actions } = useLayoutFacade()
  actions.setActiveSection(null)

  switch (section) {
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
        stockImagesAdapter.deleteById('miniImage'),
        userImagesAdapter.deleteById('miniImage'),
      ])
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

import { AppDispatch } from '@app/state'

import {
  cardphotoActions,
  cardtextActions,
  envelopeActions,
  aromaActions,
  dateActions,
} from '@/features/actions'
import { sectionActions, activeSectionActions } from '@/features/layout/actions'

import { userImagesAdapter } from '@db/adapters/card/userImagesAdapter'
import { stockImagesAdapter } from '@db/adapters/card/stockImagesAdapter'

type SectionName = 'aroma' | 'date' | 'envelope' | 'cardphoto' | 'cardtext'

export const dispatchSectionReset = async (
  section: SectionName,
  dispatch: AppDispatch
) => {
  dispatch(sectionActions.setDeleteSection(section))
  dispatch(activeSectionActions.setActiveSections({ [section]: false }))

  switch (section) {
    case 'aroma':
      dispatch(aromaActions.updateAroma(null))
      break

    case 'date':
      dispatch(dateActions.updateDispatchDate({ isSelected: false }))
      break

    case 'envelope':
      dispatch(
        envelopeActions.setEnvelope({
          sender: {
            street: '',
            zip: '',
            city: '',
            country: '',
            name: '',
          },
          recipient: {
            street: '',
            zip: '',
            city: '',
            country: '',
            name: '',
          },
        })
      )
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

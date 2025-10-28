import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useDispatch } from 'react-redux'
import { useLayoutFacade } from '@layout/application/facades'
import {
  setLockExpendMemoryCard,
  setActiveSections,
  addChoiceSection,
} from '@store/slices/layoutSlice'
import {
  addAroma,
  addDate,
  addEnvelope,
  addCardtext,
} from '@store/slices/cardEditSlice'
import {
  cartTemplatesAdapter,
  draftsTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import { imageAdapter } from '@db/adapters/storeAdapters'
import type { MemoryCardInfo } from '@layout/domain/types'
import type { SectionsToolbar } from '@shared/types'
import { act } from '@testing-library/react'

interface UseExpendCardParams {
  expendCard: MemoryCardInfo | null
  lockExpendCard: boolean
  selectSection: SectionsToolbar | null
  buttonArrowsRef: RefObject<HTMLButtonElement | null>
}

export function useExpendCard({
  expendCard,
  lockExpendCard,
  selectSection,
  buttonArrowsRef,
}: UseExpendCardParams) {
  const { section } = useLayoutFacade()
  const { activeSection } = section
  const dispatch = useDispatch()

  const userImagesAdapter = imageAdapter.userImages

  useEffect(() => {
    const loadCard = async () => {
      if (!expendCard?.source || lockExpendCard) return
      if (!['cart', 'drafts'].includes(expendCard.source)) return

      dispatch(setLockExpendMemoryCard(true))

      const adapter =
        expendCard.source === 'cart'
          ? cartTemplatesAdapter
          : draftsTemplatesAdapter

      const cardExpend = await adapter.getById(Number(expendCard.id))
      if (!cardExpend) return

      await Promise.all([
        userImagesAdapter.addRecordWithId('originalImage', {
          image: cardExpend.cardphoto,
        }),
        userImagesAdapter.addRecordWithId('workingImage', {
          image: cardExpend.cardphoto,
        }),
        userImagesAdapter.addRecordWithId('miniImage', {
          image: cardExpend.cardphoto,
        }),
      ])

      dispatch(addCardtext(cardExpend.cardtext))
      dispatch(addEnvelope(cardExpend.envelope))
      dispatch(addDate(cardExpend.date))
      dispatch(addAroma(cardExpend.aroma))

      dispatch(
        addChoiceSection({
          source: expendCard.source,
          nameSection: 'cardphoto',
        })
      )

      // dispatch(
      //   setActiveSections({
      //     ...activeSection,
      //     cardphoto: !!cardExpend.cardphoto,
      //     cardtext: !!cardExpend.cardtext,
      //     envelope: !!cardExpend.envelope,
      //     date: !!cardExpend.date,
      //     aroma: !!cardExpend.aroma,
      //   })
      // )

      buttonArrowsRef?.current?.classList.add('full')
    }

    loadCard()
  }, [expendCard, lockExpendCard])
}

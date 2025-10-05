import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useDispatch } from 'react-redux'

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

import { cartAdapter } from '@db/adapters/cart'
import { draftsAdapter } from '@db/adapters/drafts'
import { userImagesAdapter } from '@db/adapters/card/userImagesAdapter'

import type { ExpendCard } from '../../domain/types'

interface UseExpendCardParams {
  expendCard: ExpendCard | null
  lockExpendCard: boolean
  activeSections: Record<string, boolean>
  btnArrowsRef: RefObject<HTMLElement | null>
}

export function useExpendCard({
  expendCard,
  lockExpendCard,
  activeSections,
  btnArrowsRef,
}: UseExpendCardParams) {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadCard = async () => {
      if (!expendCard?.source || lockExpendCard) return
      if (!['cart', 'drafts'].includes(expendCard.source)) return

      dispatch(setLockExpendMemoryCard(true))

      const adapter = expendCard.source === 'cart' ? cartAdapter : draftsAdapter

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

      dispatch(
        setActiveSections({
          ...activeSections,
          cardphoto: !!cardExpend.cardphoto,
          cardtext: !!cardExpend.cardtext,
          envelope: !!cardExpend.envelope,
          date: !!cardExpend.date,
          aroma: !!cardExpend.aroma,
        })
      )

      btnArrowsRef?.current?.classList.add('full')
    }

    loadCard()
  }, [expendCard, lockExpendCard])
}

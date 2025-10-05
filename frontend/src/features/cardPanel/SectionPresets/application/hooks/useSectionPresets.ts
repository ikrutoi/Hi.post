import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'

import {
  SectionPreset,
  PresetLetterInfo,
  PresetSource,
} from '../../domain/types'
import { processPresetsCards } from '../helpers'
import { setChoiceClip, setLockDateShoppingCards } from '../state/layoutSlice'

import { cartAdapter } from '@db/adapters/cart/cartAdapter'
import { draftsAdapter } from '@db/adapters/drafts/draftsAdapter'
import { recipientAddressAdapter } from '@db/adapters/card/recipientAddressAdapter'
import { senderAddressAdapter } from '@db/adapters/card/senderAddressAdapter'

export const useSectionPresets = (source: PresetSource) => {
  const dispatch = useAppDispatch()
  const date = useAppSelector((state) => state.layout.dateShoppingCards)
  const choiceClip = useAppSelector((state) => state.layout.setChoiceClip)

  const [sectionPresets, setSectionPresets] = useState<SectionPreset[]>([])
  const [firstLetterList, setFirstLetterList] = useState<PresetLetterInfo[]>([])
  const [sectionClip, setSectionClip] = useState<PresetSource>()

  useEffect(() => {
    const load = async () => {
      let records: SectionPreset[] = []
      let getName: (card: SectionPreset) => string

      switch (source) {
        case 'recipient': {
          records = await recipientAddressAdapter.getAll()
          getName = (card) => card.address?.name || ''
          break
        }
        case 'sender': {
          records = await senderAddressAdapter.getAll()
          getName = (card) => card.address?.name || ''
          break
        }
        case 'cart': {
          records = await cartAdapter.getAll()
          getName = (card) => card.cart?.envelope.recipient.name || ''
          break
        }
        case 'drafts': {
          records = await draftsAdapter.getAll()
          getName = (card) => card.drafts?.envelope.recipient.name || ''
          break
        }
        case 'date': {
          const all = await cartAdapter.getAll()
          records = all.filter(
            (card) =>
              card.cart?.date?.year === date.year &&
              card.cart?.date?.month === date.month &&
              card.cart?.date?.day === date.day
          )
          getName = (card) => card.cart?.envelope.recipient.name || ''
          break
        }
      }

      const { sortedRecords, firstLetterList } = processPresetsCards(
        records,
        getName
      )
      setSectionPresets(sortedRecords)
      setFirstLetterList(firstLetterList)

      setSectionClip(source === 'date' ? 'cart' : choiceClip)

      if (source === 'date') {
        dispatch(setLockDateShoppingCards(false))
      }

      if (source === 'sender' || source === 'recipient') {
        dispatch(setChoiceClip(source))
      }
    }

    load()
  }, [source, date, choiceClip, dispatch])

  return {
    sectionPresets,
    firstLetterList,
    sectionClip,
  }
}

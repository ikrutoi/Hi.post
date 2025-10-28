import { useEffect, useState } from 'react'
import { preparePresets } from '../helpers'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'

import {
  cartTemplatesAdapter,
  draftsTemplatesAdapter,
  senderTemplatesAdapter,
  recipientTemplatesAdapter,
} from '@db/adapters/templateAdapters'

import type { PresetLetterItem } from '../../domain/types'
import type { Template } from '@shared/config/constants'

type PresetItem = any

export const useSectionPresets = (template: Template) => {
  const { state } = useLayoutNavFacade()
  const { selectedTemplate } = state

  const {
    meta: { dateCartCards },
  } = useLayoutFacade()

  const [sectionPresets, setSectionPresets] = useState<PresetItem[]>([])
  const [letterIndexList, setFirstLetterList] = useState<PresetLetterItem[]>([])

  useEffect(() => {
    const load = async () => {
      let records: PresetItem[] = []
      let getName: (item: PresetItem) => string = () => ''

      switch (template) {
        case 'recipient': {
          records = await recipientTemplatesAdapter.getAll()
          getName = (item) => item.recipient?.name || ''
          break
        }
        case 'sender': {
          records = await senderTemplatesAdapter.getAll()
          getName = (item) => item.address?.name || ''
          break
        }
        case 'cart': {
          records = await cartTemplatesAdapter.getAll()
          getName = (item) => item.cart?.envelope.recipient.name || ''
          break
        }
        case 'drafts': {
          records = await draftsTemplatesAdapter.getAll()
          getName = (item) => item.drafts?.envelope.recipient.name || ''
          break
        }
        // case 'date': {
        //   const all = await cartTemplatesAdapter.getAll()

        //   if (!dateCartCards?.isSelected) {
        //     setSectionPresets([])
        //     setFirstLetterList([])
        //     setSectionClip('cart')
        //     setLockDateCartCards(false)
        //     return
        //   }

        //   records = all.filter((item) => {
        //     const date = item.cart?.date
        //     return (
        //       date?.year === dateCartCards.year &&
        //       date?.month === dateCartCards.month &&
        //       date?.day === dateCartCards.day
        //     )
        //   })

        //   getName = (item) => item.cart?.envelope.recipient.name || ''
        //   break
        // }
      }

      const { sortedRecords, letterIndexList } = preparePresets(
        records,
        getName
      )
      setSectionPresets(sortedRecords)
      setFirstLetterList(letterIndexList)

      // const clip = template === 'date' ? 'cart' : choiceClip
      // setSectionClip(clip)

      // if (template === 'date') {
      //   setLockDateCartCards(false)
      // }
    }

    load()
  }, [template, dateCartCards, selectedTemplate])

  return {
    sectionPresets,
    letterIndexList,
  }
}

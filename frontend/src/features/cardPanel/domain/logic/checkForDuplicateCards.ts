import { cartAdapter } from '@db/adapters/cart'
import { draftsAdapter } from '@db/adapters/drafts'

import { SOURCES } from '../constants'
import type { Source, Section, DuplicateResult, CardData } from '../types'
import type {
  AddressRole,
  AddressField,
} from '@/features/envelope/domain/types'

export async function checkForDuplicateCards(
  card: CardData
): Promise<DuplicateResult> {
  const sources = SOURCES

  const cards = {
    cart: await cartAdapter.getAll(),
    drafts: await draftsAdapter.getAll(),
  }

  const result: DuplicateResult = {
    cart: { aroma: [], date: [], envelope: [], cardtext: [], cardphoto: [] },
    drafts: { aroma: [], date: [], envelope: [], cardtext: [], cardphoto: [] },
  }

  for (const source of sources) {
    for (const sourceCard of cards[source]) {
      if (
        card.aroma &&
        sourceCard.aroma &&
        card.aroma.name === sourceCard.aroma.name &&
        card.aroma.make === sourceCard.aroma.make
      ) {
        result[source].aroma.push(sourceCard.personalId)
      }

      if (
        card.date?.isSelected &&
        sourceCard.date?.isSelected &&
        card.date.year === sourceCard.date.year &&
        card.date.month === sourceCard.date.month &&
        card.date.day === sourceCard.date.day
      ) {
        result[source].date.push(sourceCard.personalId)
      }

      const sectionsEnvelope: AddressRole[] = ['sender', 'recipient']
      const envelopeMatch = sectionsEnvelope.every((sectionEnv) =>
        (
          Object.keys(card.envelope?.[sectionEnv] || {}) as AddressField[]
        ).every(
          (key) =>
            card.envelope?.[sectionEnv]?.[key] ===
            sourceCard.envelope?.[sectionEnv]?.[key]
        )
      )

      if (envelopeMatch) {
        result[source].envelope.push(sourceCard.personalId)
      }

      if (
        card.cardtext?.text?.length === sourceCard.cardtext?.text?.length &&
        card.cardtext?.text?.every(
          (text, i) =>
            text.children[0].text ===
            sourceCard.cardtext?.text[i]?.children[0]?.text
        )
      ) {
        result[source].cardtext.push(sourceCard.personalId)
      }

      // if (card.cardphoto?.size === sourceCard.cardphoto?.size) {
      //   result[source].cardphoto.push(sourceCard.personalId)
      // }
    }
  }

  return result
}

export async function getDuplicateFlags(card: CardData): Promise<{
  addCart: boolean
  save: boolean
}> {
  const result = await checkForDuplicateCards(card)
  return {
    addCart: result.cart.aroma.length === 0,
    save: result.drafts.aroma.length === 0,
  }
}

export async function getDuplicateSummary(card: CardData): Promise<{
  cart: boolean
  drafts: boolean
}> {
  const result = await checkForDuplicateCards(card)
  return {
    cart: result.cart.aroma.length > 0,
    drafts: result.drafts.aroma.length > 0,
  }
}

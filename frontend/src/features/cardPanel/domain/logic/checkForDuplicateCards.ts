import {
  cartTemplatesAdapter,
  draftsTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import { SOURCES } from '@shared/config/constants'
import type {
  Template,
  CardMenuSection,
  EnvelopeRole,
  AddressField,
} from '@shared/config/constants'
import type { CardItem } from '@entities/card/domain/types'
import type { DuplicateResult } from '../types'

export async function checkForDuplicateCards(
  card: CardItem
): Promise<DuplicateResult> {
  const sources = SOURCES

  const cards = {
    cart: await cartTemplatesAdapter.getAll(),
    drafts: await draftsTemplatesAdapter.getAll(),
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
        result[source].aroma.push(sourceCard.id)
      }

      if (
        card.date?.isSelected &&
        sourceCard.date?.isSelected &&
        card.date.year === sourceCard.date.year &&
        card.date.month === sourceCard.date.month &&
        card.date.day === sourceCard.date.day
      ) {
        result[source].date.push(sourceCard.id)
      }

      const envelopeRole: EnvelopeRole[] = ['sender', 'recipient']
      const envelopeMatch = envelopeRole.every((role) =>
        (Object.keys(card.envelope?.[role] || {}) as AddressField[]).every(
          (key) =>
            card.envelope?.[role]?.[key] === sourceCard.envelope?.[role]?.[key]
        )
      )

      if (envelopeMatch) {
        result[source].envelope.push(sourceCard.id)
      }

      if (
        card.cardtext?.text?.length === sourceCard.cardtext?.text?.length &&
        card.cardtext?.text?.every(
          (text, i) =>
            text.children[0].text ===
            sourceCard.cardtext?.text[i]?.children[0]?.text
        )
      ) {
        result[source].cardtext.push(sourceCard.id)
      }

      // if (card.cardphoto?.size === sourceCard.cardphoto?.size) {
      //   result[source].cardphoto.push(sourceCard.id)
      // }
    }
  }

  return result
}

export async function getDuplicateFlags(card: CardItem): Promise<{
  addedCart: boolean
  save: boolean
}> {
  const result = await checkForDuplicateCards(card)
  return {
    addedCart: result.cart.aroma.length === 0,
    save: result.drafts.aroma.length === 0,
  }
}

export async function getDuplicateSummary(card: CardItem): Promise<{
  cart: boolean
  drafts: boolean
}> {
  const result = await checkForDuplicateCards(card)
  return {
    cart: result.cart.aroma.length > 0,
    drafts: result.drafts.aroma.length > 0,
  }
}

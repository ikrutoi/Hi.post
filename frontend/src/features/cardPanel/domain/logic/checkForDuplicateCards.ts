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
import type { Card } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { DuplicateResult } from '../types/duplicate.types'

function templateSourceId(row: PostcardHydrated | DraftsItem): string {
  if ('localId' in row && typeof row.localId === 'number') {
    return String(row.localId)
  }
  return String((row as PostcardHydrated).id)
}

export async function checkForDuplicateCards(
  card: Card,
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
      const sc =
        'card' in sourceCard && (sourceCard as PostcardHydrated).card
          ? (sourceCard as PostcardHydrated).card
          : (sourceCard as unknown as Card)

      if (
        card.aroma &&
        sc.aroma &&
        card.aroma.name === sc.aroma.name &&
        card.aroma.make === sc.aroma.make
      ) {
        result[source].aroma.push(templateSourceId(sourceCard))
      }

      if (
        card.date &&
        sc.date &&
        card.date.year === sc.date.year &&
        card.date.month === sc.date.month &&
        card.date.day === sc.date.day
      ) {
        result[source].date.push(templateSourceId(sourceCard))
      }

      const envelopeRole: EnvelopeRole[] = ['sender', 'recipient']
      const envelopeMatch = envelopeRole.every((role) => {
        const a = card.envelope?.[role] as Record<string, unknown> | undefined
        const b = sc.envelope?.[role] as Record<string, unknown> | undefined
        return (Object.keys(a ?? {}) as AddressField[]).every(
          (key) => String(a?.[key] ?? '') === String(b?.[key] ?? ''),
        )
      })

      if (envelopeMatch) {
        result[source].envelope.push(templateSourceId(sourceCard))
      }

      const ctA = card.cardtext?.appliedData?.value ?? card.cardtext?.assetData?.value
      const ctB = sc.cardtext?.appliedData?.value ?? sc.cardtext?.assetData?.value
      if (
        ctA &&
        ctB &&
        ctA.length === ctB.length &&
        ctA.every(
          (block, i) =>
            block.children[0]?.text === ctB[i]?.children[0]?.text,
        )
      ) {
        result[source].cardtext.push(templateSourceId(sourceCard))
      }

      // if (card.cardphoto?.size === sourceCard.cardphoto?.size) {
      //   result[source].cardphoto.push(sourceCard.id)
      // }
    }
  }

  return result
}

export async function getDuplicateFlags(card: Card): Promise<{
  addedCart: boolean
  save: boolean
}> {
  const result = await checkForDuplicateCards(card)
  return {
    addedCart: result.cart.aroma.length === 0,
    save: result.drafts.aroma.length === 0,
  }
}

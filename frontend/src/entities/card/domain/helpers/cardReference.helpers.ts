import type {
  CardReference,
  CardPreview,
  CardTemplateReferences,
} from '../types/cardReference.types'
import type { Card } from '../types/card.types'
import type { PostcardHydrated } from '@entities/postcard'
import { cardImageMetaLookupIds } from './listPreviewDisplay'

function listPreviewUrlCandidate(url: string | null | undefined): string | null {
  const t = typeof url === 'string' ? url.trim() : ''
  if (!t) return null
  /** Persisted blob: strings in postcard JSON — resolve via IDB/registry, not inline. */
  if (t.startsWith('blob:')) return null
  return t
}

/** URL для списков / календаря (http/data only; blobs via registry / calendarPreview cache). */
export function cardListPreviewUrlFromCard(card: Card): string | null {
  const fromThumb = listPreviewUrlCandidate(card.thumbnailUrl)
  if (fromThumb) return fromThumb
  const meta = card.cardphoto?.appliedData ?? card.cardphoto?.assetData
  return listPreviewUrlCandidate(
    meta?.thumbnail?.url || meta?.full?.url || meta?.url || null,
  )
}

/** После hydrate: свежие blob: из IDB для assetRegistry / calendar cache. */
export function cardImageMetaLookupIdsFromCard(
  card: Card,
  postcardRefs?: { cardphoto?: string } | null,
): string[] {
  const applied = card.cardphoto?.appliedData?.id
  const ids = new Set(cardImageMetaLookupIds(card.id, applied))
  const refId = postcardRefs?.cardphoto?.trim()
  if (refId) ids.add(refId)
  return [...ids]
}

export function cardRuntimePreviewUrlFromCard(card: Card): string | null {
  const persisted = cardListPreviewUrlFromCard(card)
  if (persisted) return persisted
  const meta = card.cardphoto?.appliedData ?? card.cardphoto?.assetData
  const runtime = (
    meta?.thumbnail?.url ||
    meta?.url ||
    meta?.full?.url ||
    card.thumbnailUrl ||
    ''
  ).trim()
  return runtime !== '' ? runtime : null
}

function cardphotoPreviewFromCard(card: Card): string {
  return cardListPreviewUrlFromCard(card) ?? ''
}

export function createCardReferenceFromPostcard(
  postcard: PostcardHydrated,
  templateRefs: CardTemplateReferences,
): CardReference {
  const card = postcard.card
  return {
    id: card.id,
    userId: '',
    status: postcard.status,
    templates: templateRefs,
    aromaId: card.aroma.index,
    date: card.date,
    thumbnailUrl: card.thumbnailUrl,
    preview: {
      cardphotoPreview: cardphotoPreviewFromCard(card),
      cardtextPreview: (card.cardtext.assetData?.plainText ?? '').substring(
        0,
        100,
      ),
      recipientPreview: formatAddressPreview(card.envelope.recipient.viewDraft),
      senderPreview: card.envelope.sender.enabled
        ? formatAddressPreview(card.envelope.sender.viewDraft)
        : undefined,
      aromaPreview:
        card.aroma.index === 0 ? '' : `Slot ${card.aroma.index}`,
      datePreview: formatDatePreview(card.date),
    },
    meta: {
      price: postcard.price,
      createdAt: postcard.createdAt,
      updatedAt: postcard.updatedAt,
    },
  }
}

function formatAddressPreview(address: Record<string, string>): string {
  const parts: string[] = []
  if (address.name) parts.push(address.name)
  if (address.city) parts.push(address.city)
  return parts.join(', ')
}

function formatDatePreview(date: unknown): string {
  return String(date)
}

export function createEmptyTemplateReferences(): CardTemplateReferences {
  return {
    cardphotoId: null,
    cardtextId: null,
    recipientId: null,
    senderId: null,
  }
}

export function areTemplatesComplete(refs: CardTemplateReferences): boolean {
  return (
    refs.cardphotoId !== null &&
    refs.cardtextId !== null &&
    refs.recipientId !== null
  )
}

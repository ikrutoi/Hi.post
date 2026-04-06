import type {
  CardReference,
  CardPreview,
  CardTemplateReferences,
} from '../types/cardReference.types'
import type { Card } from '../types/card.types'
import type { Postcard } from '@entities/postcard'

function cardphotoPreviewFromCard(card: Card): string {
  if (card.thumbnailUrl) return card.thumbnailUrl
  const meta = card.cardphoto.appliedData ?? card.cardphoto.assetData
  return (
    meta?.thumbnail?.url ||
    meta?.full?.url ||
    meta?.url ||
    ''
  )
}

export function createCardReferenceFromPostcard(
  postcard: Postcard,
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
      aromaPreview: card.aroma.name,
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

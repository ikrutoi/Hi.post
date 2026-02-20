import type { CardReference, CardPreview, CardTemplateReferences } from '../types/cardReference.types'
import type { Card } from '../types/card.types'
import type { AromaImageIndex } from '@entities/aroma/domain/types'

/**
 * Создать CardReference из полной Card
 * Используется при сохранении открытки на бэкенд
 */
export function createCardReferenceFromCard(
  card: Card,
  templateRefs: CardTemplateReferences,
): CardReference {
  return {
    id: card.id,
    userId: '', // Будет заполнено из контекста пользователя
    status: card.status,
    templates: templateRefs,
    aromaId: card.aroma.index,
    date: card.date,
    thumbnailUrl: card.thumbnailUrl,
    preview: {
      cardphotoPreview: card.cardphoto.previewUrl,
      cardtextPreview: card.cardtext.plainText.substring(0, 100),
      recipientPreview: formatAddressPreview(card.envelope.recipient.data),
      senderPreview: card.envelope.sender.enabled
        ? formatAddressPreview(card.envelope.sender.data)
        : undefined,
      aromaPreview: card.aroma.name,
      datePreview: formatDatePreview(card.date),
    },
    meta: {
      price: card.meta.price,
      createdAt: card.meta.createdAt,
      updatedAt: card.meta.updatedAt,
    },
  }
}

/**
 * Форматировать адрес для превью
 */
function formatAddressPreview(address: Record<string, string>): string {
  const parts: string[] = []
  if (address.name) parts.push(address.name)
  if (address.city) parts.push(address.city)
  return parts.join(', ')
}

/**
 * Форматировать дату для превью
 */
function formatDatePreview(date: any): string {
  // TODO: Реализовать форматирование даты
  return String(date)
}

/**
 * Создать пустые ссылки на шаблоны
 */
export function createEmptyTemplateReferences(): CardTemplateReferences {
  return {
    cardphotoId: null,
    cardtextId: null,
    recipientId: null,
    senderId: null,
  }
}

/**
 * Проверить, заполнены ли все обязательные шаблоны
 */
export function areTemplatesComplete(refs: CardTemplateReferences): boolean {
  return (
    refs.cardphotoId !== null &&
    refs.cardtextId !== null &&
    refs.recipientId !== null
  )
}

import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCropIds } from '@cardphoto/infrastructure/selectors'
import { useAddressTemplates } from '@entities/templates/application/hooks'
import { useCardtextTemplates } from '@entities/templates/application/hooks'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { CardSection } from '@shared/config/constants'
import type { PreviewStripItem } from '../../domain/types'

const MAX_ITEMS = CARD_SCALE_CONFIG.maxPreviewToolbarRight

/**
 * Возвращает список элементов для полосы превью справа.
 * При переключении секции данные берутся заново из store/API (cropIds, cardtext, sender+recipient).
 */
export function usePreviewStripItems(
  activeSection: CardSection | null,
): PreviewStripItem[] {
  const cropIds = useAppSelector(selectCropIds)
  const sender = useAddressTemplates('sender')
  const recipient = useAddressTemplates('recipient')
  const cardtext = useCardtextTemplates()

  return useMemo(() => {
    if (!activeSection) return []

    if (activeSection === 'cardphoto') {
      const list: PreviewStripItem[] = [...cropIds].reverse().map((imageId, i) => ({
        kind: 'cardphoto' as const,
        id: imageId,
        imageId,
        updatedAt: cropIds.length - 1 - i,
      }))
      return list.slice(0, MAX_ITEMS)
    }

    if (activeSection === 'cardtext') {
      const sorted = [...cardtext.templates].sort(
        (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0),
      )
      return sorted.slice(0, MAX_ITEMS).map((t) => ({
        kind: 'cardtext' as const,
        id: t.id,
        templateId: t.id,
        plainText: t.plainText ?? '',
        updatedAt: t.updatedAt ?? 0,
      }))
    }

    if (activeSection === 'envelope') {
      const withType = [
        ...sender.templates.map((t) => ({ ...t, addressType: 'sender' as const })),
        ...recipient.templates.map((t) => ({ ...t, addressType: 'recipient' as const })),
      ]
      const sorted = withType.sort(
        (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0),
      )
      return sorted.slice(0, MAX_ITEMS).map((t) => ({
        kind: 'address' as const,
        id: `${t.addressType}-${t.id}`,
        templateId: t.id,
        addressType: t.addressType,
        name: t.address?.name ?? '',
        updatedAt: t.updatedAt ?? 0,
      }))
    }

    return []
  }, [
    activeSection,
    cropIds,
    sender.templates,
    recipient.templates,
    cardtext.templates,
  ])
}

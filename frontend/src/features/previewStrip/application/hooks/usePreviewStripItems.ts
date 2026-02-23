import { useMemo, useCallback, useEffect } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCropIds } from '@cardphoto/infrastructure/selectors'
import { useTemplates } from '@entities/templates/application/hooks'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { CardSection } from '@shared/config/constants'
import type { PreviewStripItem } from '../../domain/types'

const MAX_ITEMS = CARD_SCALE_CONFIG.maxPreviewToolbarRight

const selectPreviewStripOrder = (state: {
  previewStripOrder: {
    cardtextTemplateIds: string[]
    addressTemplateRefs: { type: 'sender' | 'recipient'; id: string }[]
    addressTemplatesReloadVersion: number
  }
}) => state.previewStripOrder

/**
 * Возвращает список элементов для полосы превью справа и функцию обновления.
 * Порядок cardtext и envelope задаётся массивом id в Redux (как cropIds для cardphoto).
 */
export function usePreviewStripItems(
  activeSection: CardSection | null,
): { items: PreviewStripItem[]; reload: () => Promise<void> } {
  const cropIds = useAppSelector(selectCropIds)
  const {
    cardtextTemplateIds,
    addressTemplateRefs,
    addressTemplatesReloadVersion,
  } = useAppSelector(selectPreviewStripOrder)
  const {
    senderTemplates,
    recipientTemplates,
    cardtextTemplates,
    loadSenderTemplates,
    loadRecipientTemplates,
    loadCardtextTemplates,
  } = useTemplates()

  useEffect(() => {
    if (activeSection === 'cardtext') {
      loadCardtextTemplates()
    } else if (activeSection === 'envelope') {
      loadSenderTemplates()
      loadRecipientTemplates()
    }
  }, [
    activeSection,
    addressTemplatesReloadVersion,
    loadCardtextTemplates,
    loadSenderTemplates,
    loadRecipientTemplates,
  ])

  const items = useMemo(() => {
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
      const byId = new Map(cardtextTemplates.map((t) => [t.id, t]))
      const orderedIds =
        cardtextTemplateIds.length > 0
          ? cardtextTemplateIds.filter((id) => byId.has(id))
          : [...cardtextTemplates]
              .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
              .map((t) => t.id)
      const idsNewestFirst = [...orderedIds].reverse().slice(0, MAX_ITEMS)
      return idsNewestFirst.map((id) => {
        const t = byId.get(id)!
        return {
          kind: 'cardtext' as const,
          id: t.id,
          templateId: t.id,
          plainText: t.plainText ?? '',
          updatedAt: t.updatedAt ?? 0,
        }
      })
    }

    if (activeSection === 'envelope') {
      const senderById = new Map(senderTemplates.map((t) => [t.id, t]))
      const recipientById = new Map(recipientTemplates.map((t) => [t.id, t]))
      // Показываем только избранные адреса (звёздочка); при пустом списке — пустая панель
      const refsWithData = addressTemplateRefs.filter((ref) => {
        const map = ref.type === 'sender' ? senderById : recipientById
        return map.has(ref.id)
      })
      const refsNewestFirst = [...refsWithData].reverse().slice(0, MAX_ITEMS)
      return refsNewestFirst.map((ref) => {
        const map = ref.type === 'sender' ? senderById : recipientById
        const t = map.get(ref.id)!
        return {
          kind: 'address' as const,
          id: `${ref.type}-${t.id}`,
          templateId: t.id,
          addressType: ref.type,
          name: t.address?.name ?? '',
          updatedAt: t.updatedAt ?? 0,
        }
      })
    }

    return []
  }, [
    activeSection,
    cropIds,
    cardtextTemplateIds,
    addressTemplateRefs,
    senderTemplates,
    recipientTemplates,
    cardtextTemplates,
  ])

  const reload = useCallback(async () => {
    if (activeSection === 'cardphoto') return
    if (activeSection === 'cardtext') {
      await loadCardtextTemplates()
      return
    }
    if (activeSection === 'envelope') {
      await Promise.all([loadSenderTemplates(), loadRecipientTemplates()])
    }
  }, [
    activeSection,
    loadCardtextTemplates,
    loadSenderTemplates,
    loadRecipientTemplates,
  ])

  return { items, reload }
}

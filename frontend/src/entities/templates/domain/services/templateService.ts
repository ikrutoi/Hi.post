import { nanoid } from 'nanoid'
import {
  recipientTemplatesAdapter,
  senderTemplatesAdapter,
  cardtextTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type {
  AddressTemplate,
  CreateAddressTemplatePayload,
  UpdateAddressTemplatePayload,
  AddressType,
} from '../types/addressTemplate.types'
import type {
  CreateCardtextPayload,
  UpdateCardtextPayload,
  CardtextContent,
  CardtextStatus,
  CardtextStyle,
  CardtextValue,
} from '@cardtext/domain/types'
import type { TemplateOperationResult } from '../types/template.types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import { isEmptyCardtextValue } from '@cardtext/domain/helpers/isEmptyCardtextValue'

function defaultCardtextStyleFallback(): CardtextStyle {
  return {
    fontFamily: '',
    fontSizeStep: 0,
    color: 'deepBlack',
    align: 'left',
  }
}

/** Нормализация сохранённого `state` шаблона (в т.ч. миграция с `applied` / `appliedData`). */
function cardtextContentFromPersistedState(raw: unknown, now: number) {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Record<
    string,
    unknown
  >
  const legacyApplied = s.applied as string | null | undefined
  const legacyAppliedData = s.appliedData as
    | { value: CardtextValue; style: CardtextStyle }
    | null
    | undefined
  const legacyAssetData = s.assetData as
    | { value: CardtextValue; style: CardtextStyle }
    | null
    | undefined
  const legacyComplete = s.isComplete as boolean | undefined

  let value = (s.value as CardtextValue) || []
  let style = (s.style as CardtextStyle) || defaultCardtextStyleFallback()

  if (isEmptyCardtextValue(value) && legacyAppliedData?.value) {
    value = legacyAppliedData.value
    style = { ...style, ...legacyAppliedData.style }
  } else if (isEmptyCardtextValue(value) && legacyAssetData?.value) {
    value = legacyAssetData.value
    style = { ...style, ...legacyAssetData.style }
  }

  let status =
    (s.status as CardtextStatus | undefined) ??
    (s.assetStatus as CardtextStatus | undefined) ??
    'inLine'

  if (
    s.status === undefined &&
    s.assetStatus === undefined &&
    (legacyComplete === true ||
      (legacyApplied != null && legacyApplied !== ''))
  ) {
    status = 'processed'
  }

  return {
    id: (s.id as string | null | undefined) ?? null,
    value,
    style,
    title: (s.title as string) ?? '',
    plainText: (s.plainText as string) || '',
    cardtextLines: (s.cardtextLines as number) || 0,
    favorite: (s.favorite as boolean | null | undefined) ?? null,
    timestamp: typeof s.timestamp === 'number' ? s.timestamp : now,
    status,
  }
}

/** Одна запись стора `cardtext`: плоский `CardtextContent` или legacy `{ id, state, status? }`. */
function readCardtextStoreRecord(record: unknown, now: number): CardtextContent {
  const r = (record && typeof record === 'object' ? record : {}) as Record<
    string,
    unknown
  >
  const nested = r.state
  const inner =
    nested != null && typeof nested === 'object' ? nested : r
  const content = cardtextContentFromPersistedState(inner, now)
  const topId = r.id != null ? String(r.id) : null
  const rowStatus = r.status as CardtextStatus | undefined
  return {
    ...content,
    id: topId ?? content.id,
    status: rowStatus ?? content.status,
  }
}

export const templateService = {
  async hasCardtextTemplateByStatus(
    status: 'draft' | 'processed',
  ): Promise<boolean> {
    const records = await cardtextTemplatesAdapter.getAll()
    const now = Date.now()
    return records.some((record) => {
      const content = readCardtextStoreRecord(record, now)
      return content.status === status
    })
  },

  async getSingleCardtextByStatus(
    status: 'draft' | 'processed',
  ): Promise<CardtextContent | null> {
    const records = await cardtextTemplatesAdapter.getAll()
    const now = Date.now()
    const byStatus = records
      .map((record) => readCardtextStoreRecord(record, now))
      .filter((item) => item.status === status)
      .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
    return byStatus[0] ?? null
  },

  async upsertSingleCardtextByStatus(
    status: 'draft' | 'processed',
    payload: CreateCardtextPayload,
  ): Promise<TemplateOperationResult> {
    try {
      const records = await cardtextTemplatesAdapter.getAll()
      const now = Date.now()
      const byStatus = records
        .map((record) => readCardtextStoreRecord(record, now))
        .filter((item) => item.status === status && item.id != null) as Array<
        CardtextContent & { id: string }
      >

      const [primary, ...duplicates] = byStatus.sort(
        (a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0),
      )

      if (primary) {
        const updated: UpdateCardtextPayload = {
          value: payload.value,
          style: payload.style,
          plainText: payload.plainText,
          cardtextLines: payload.cardtextLines,
          title: payload.title,
          favorite: payload.favorite,
        }
        const result = await this.updateCardtextTemplate(primary.id, updated)
        if (!result.success) return result

        for (const dup of duplicates) {
          await cardtextTemplatesAdapter.deleteById(dup.id)
        }

        return {
          success: true,
          templateId: primary.id,
        }
      }

      return await this.createCardtextTemplate({
        ...payload,
        status,
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async deleteSingleCardtextByStatus(
    status: 'draft' | 'processed',
  ): Promise<void> {
    const records = await cardtextTemplatesAdapter.getAll()
    const now = Date.now()
    const byStatus = records
      .map((record) => readCardtextStoreRecord(record, now))
      .filter((item) => item.status === status && item.id != null) as Array<
      CardtextContent & { id: string }
    >
    for (const item of byStatus) {
      await cardtextTemplatesAdapter.deleteById(item.id)
    }
  },

  async getAddressTemplates(type: AddressType): Promise<AddressTemplate[]> {
    const adapter =
      type === 'recipient' ? recipientTemplatesAdapter : senderTemplatesAdapter

    const records = await adapter.getAll()

    return records.map((record) => ({
      id: record.id,
      localId: record.localId,
      address: record.address,
      type,
      cardId: record.id,
      serverId: null,
      syncedAt: null,
      isDirty: false,
    }))
  },

  async getAddressTemplateById(
    type: AddressType,
    id: number | string,
  ): Promise<AddressTemplate | null> {
    const adapter =
      type === 'recipient' ? recipientTemplatesAdapter : senderTemplatesAdapter

    const record = await adapter.getById(id)
    if (!record) return null

    return {
      id: record.id,
      localId: record.localId,
      address: record.address,
      type,
      cardId: record.id,
      serverId: null,
      syncedAt: null,
      isDirty: false,
    }
  },

  async createAddressTemplate(
    payload: CreateAddressTemplatePayload,
  ): Promise<TemplateOperationResult> {
    try {
      const adapter =
        payload.type === 'recipient'
          ? recipientTemplatesAdapter
          : senderTemplatesAdapter

      const maxLocalId = await adapter.getMaxLocalId()
      const localId = maxLocalId + 1
      const id = payload.id ?? payload.cardId ?? nanoid()

      const listStatus = payload.listStatus ?? 'outList'
      const favorite = listStatus === 'outList' ? null : false
      const templateData: Omit<AddressTemplateItem, 'localId'> = {
        id,
        address: payload.address,
        listStatus,
        favorite,
      }

      await adapter.addUniqueRecord(templateData)

      return {
        success: true,
        templateId: id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async updateAddressTemplate(
    type: AddressType,
    id: number | string,
    payload: UpdateAddressTemplatePayload,
  ): Promise<TemplateOperationResult> {
    try {
      const adapter =
        type === 'recipient'
          ? recipientTemplatesAdapter
          : senderTemplatesAdapter

      const record = await adapter.getById(id)
      if (!record) {
        return {
          success: false,
          error: 'Template not found',
        }
      }

      const updatedRecord: AddressTemplateItem = {
        ...record,
        address: payload.address ?? record.address,
      }

      await adapter.put(updatedRecord as AddressTemplateItem & { id: string })

      return {
        success: true,
        templateId: id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async deleteAddressTemplate(
    type: AddressType,
    id: number | string,
  ): Promise<TemplateOperationResult> {
    try {
      const adapter =
        type === 'recipient'
          ? recipientTemplatesAdapter
          : senderTemplatesAdapter

      await adapter.deleteById(id)

      return {
        success: true,
        templateId: id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async getCardtextTemplates(): Promise<CardtextContent[]> {
    const records = await cardtextTemplatesAdapter.getAll()
    const now = Date.now()

    return records
      .map((record) => {
        const content = readCardtextStoreRecord(record, now)
        return {
          ...content,
          favorite:
            content.favorite ??
            (record as { favorite?: boolean | null }).favorite ??
            null,
        }
      })
      .filter((item) => item.status === 'inLine')
  },

  async getCardtextTemplateById(id: string): Promise<CardtextContent | null> {
    const record = await cardtextTemplatesAdapter.getById(id)
    if (!record) return null

    const now = Date.now()
    const content = readCardtextStoreRecord(record, now)
    return {
      ...content,
      favorite: content.favorite ?? (record as { favorite?: boolean | null }).favorite ?? null,
    }
  },

  async createCardtextTemplate(
    payload: CreateCardtextPayload,
  ): Promise<TemplateOperationResult> {
    try {
      const id = payload.id ?? nanoid()
      const now = Date.now()

      const templateData: CardtextContent = {
        id,
        value: payload.value,
        style: payload.style,
        title: payload.title ?? '',
        plainText: payload.plainText,
        cardtextLines: payload.cardtextLines,
        status: payload.status ?? 'inLine',
        favorite: payload.favorite ?? null,
        timestamp: now,
      }

      await cardtextTemplatesAdapter.addTemplate(templateData)

      return {
        success: true,
        templateId: id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async updateCardtextTemplate(
    id: string,
    payload: UpdateCardtextPayload,
  ): Promise<TemplateOperationResult> {
    try {
      const record = await cardtextTemplatesAdapter.getById(id)
      if (!record) {
        return {
          success: false,
          error: 'Template not found',
        }
      }

      const now = Date.now()
      const prev = readCardtextStoreRecord(record, now)
      const birth = typeof prev.timestamp === 'number' ? prev.timestamp : now
      const updatedRecord: CardtextContent = {
        ...prev,
        id: String(record.id),
        value: payload.value ?? prev.value,
        style: payload.style
          ? { ...prev.style, ...payload.style }
          : prev.style,
        title: payload.title ?? prev.title ?? '',
        plainText: payload.plainText ?? prev.plainText,
        cardtextLines: payload.cardtextLines ?? prev.cardtextLines,
        status: prev.status,
        favorite:
          payload.favorite !== undefined ? payload.favorite : prev.favorite,
        timestamp: birth,
      }

      await cardtextTemplatesAdapter.put(
        updatedRecord as CardtextContent & { id: string },
      )

      return {
        success: true,
        templateId: id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async deleteCardtextTemplate(id: string): Promise<TemplateOperationResult> {
    try {
      await cardtextTemplatesAdapter.deleteById(id)

      return {
        success: true,
        templateId: id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  async hasProcessedCardtextTemplate(): Promise<boolean> {
    return this.hasCardtextTemplateByStatus('processed')
  },
}

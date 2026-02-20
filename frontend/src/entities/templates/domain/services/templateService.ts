import { nanoid } from 'nanoid'
import {
  recipientTemplatesAdapter,
  senderTemplatesAdapter,
  cardtextTemplatesAdapter,
  userImagesTemplatesAdapter,
  stockImagesTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type {
  AddressTemplate,
  CreateAddressTemplatePayload,
  UpdateAddressTemplatePayload,
  AddressType,
} from '../types/addressTemplate.types'
import type {
  CardtextTemplate,
  CreateCardtextTemplatePayload,
  UpdateCardtextTemplatePayload,
} from '../types/cardtextTemplate.types'
import type {
  CardphotoTemplate,
  CreateCardphotoTemplatePayload,
  UpdateCardphotoTemplatePayload,
  ImageSourceType,
} from '../types/cardphotoTemplate.types'
import type { TemplateOperationResult } from '../types/template.types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { ImageTemplateItem } from '@cardphoto/domain/typesLayout'

export const templateService = {
  async getAddressTemplates(type: AddressType): Promise<AddressTemplate[]> {
    const adapter =
      type === 'recipient' ? recipientTemplatesAdapter : senderTemplatesAdapter

    const records = await adapter.getAll()
    const now = Date.now()

    return records.map((record) => ({
      id: record.id,
      localId: record.localId,
      address: record.address,
      type,
      cardId: record.id,
      createdAt: now,
      updatedAt: now,
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

    const now = Date.now()
    return {
      id: record.id,
      localId: record.localId,
      address: record.address,
      type,
      cardId: record.id,
      createdAt: now,
      updatedAt: now,
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

      const templateData: Omit<AddressTemplateItem, 'localId'> = {
        id,
        address: payload.address,
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

  async getCardtextTemplates(): Promise<CardtextTemplate[]> {
    const records = await cardtextTemplatesAdapter.getAll()
    const now = Date.now()

    return records.map((record) => ({
      id: record.id,
      localId: Number.parseInt(record.id, 10) || 0,
      value: record.state?.text || [],
      style: record.state?.style || {
        fontFamily: '',
        fontSizeStep: 0,
        color: 'deepBlack',
        align: 'left',
      },
      plainText: record.state?.plainText || '',
      cardtextLines: record.state?.cardtextLines || 0,
      createdAt: now,
      updatedAt: now,
      serverId: null,
      syncedAt: null,
      isDirty: false,
    }))
  },

  async getCardtextTemplateById(id: string): Promise<CardtextTemplate | null> {
    const record = await cardtextTemplatesAdapter.getById(id)
    if (!record) return null

    const now = Date.now()
    return {
      id: record.id,
      localId: Number.parseInt(record.id, 10) || 0,
      value: record.state?.text || [],
      style: record.state?.style || {
        fontFamily: '',
        fontSizeStep: 0,
        color: 'deepBlack',
        align: 'left',
      },
      plainText: record.state?.plainText || '',
      cardtextLines: record.state?.cardtextLines || 0,
      createdAt: now,
      updatedAt: now,
      serverId: null,
      syncedAt: null,
      isDirty: false,
    }
  },

  async createCardtextTemplate(
    payload: CreateCardtextTemplatePayload,
  ): Promise<TemplateOperationResult> {
    try {
      const id = payload.id ?? nanoid()

      const templateData: CardtextTemplateItem = {
        id,
        state: {
          text: payload.value,
          style: payload.style,
          plainText: payload.plainText,
          cardtextLines: payload.cardtextLines,
        },
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
    payload: UpdateCardtextTemplatePayload,
  ): Promise<TemplateOperationResult> {
    try {
      const record = await cardtextTemplatesAdapter.getById(id)
      if (!record) {
        return {
          success: false,
          error: 'Template not found',
        }
      }

      const updatedRecord: CardtextTemplateItem = {
        ...record,
        state: {
          ...record.state,
          text: payload.value ?? record.state?.text,
          style: payload.style
            ? { ...record.state?.style, ...payload.style }
            : record.state?.style,
          plainText: payload.plainText ?? record.state?.plainText,
          cardtextLines: payload.cardtextLines ?? record.state?.cardtextLines,
        },
      }

      await cardtextTemplatesAdapter.put(updatedRecord)

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

  async getCardphotoTemplates(
    source: ImageSourceType,
  ): Promise<CardphotoTemplate[]> {
    const adapter =
      source === 'user'
        ? userImagesTemplatesAdapter
        : stockImagesTemplatesAdapter

    const records = await adapter.getAll()
    const now = Date.now()

    return records.map((record) => ({
      id: record.id,
      localId: record.localId,
      image: record.image as any,
      source,
      theme: record.theme,
      imageBlob: record.image,
      createdAt: now,
      updatedAt: now,
      serverId: null,
      syncedAt: null,
      isDirty: false,
      userId: '',
      visibility: 'private' as const,
      isPublic: false,
      isModerated: false,
      isApproved: false,
      monetization: {
        enabled: false,
        totalEarnings: 0,
        totalUses: 0,
      },
      stats: {
        views: 0,
        uses: 0,
      },
    }))
  },

  async getCardphotoTemplateById(
    source: ImageSourceType,
    id: number | string,
  ): Promise<CardphotoTemplate | null> {
    const adapter =
      source === 'user'
        ? userImagesTemplatesAdapter
        : stockImagesTemplatesAdapter

    const record = await adapter.getById(id)
    if (!record) return null

    const now = Date.now()
    return {
      id: record.id,
      localId: record.localId,
      image: record.image as any,
      source,
      theme: record.theme,
      imageBlob: record.image,
      createdAt: now,
      updatedAt: now,
      serverId: null,
      syncedAt: null,
      isDirty: false,
      userId: '',
      visibility: 'private' as const,
      isPublic: false,
      isModerated: false,
      isApproved: false,
      monetization: {
        enabled: false,
        totalEarnings: 0,
        totalUses: 0,
      },
      stats: {
        views: 0,
        uses: 0,
      },
    }
  },

  async createCardphotoTemplate(
    payload: CreateCardphotoTemplatePayload,
  ): Promise<TemplateOperationResult> {
    try {
      const adapter =
        payload.source === 'user'
          ? userImagesTemplatesAdapter
          : stockImagesTemplatesAdapter

      const maxLocalId = await adapter.getMaxLocalId()
      const localId = maxLocalId + 1
      const id = payload.id ?? nanoid()

      const templateData: ImageTemplateItem = {
        localId,
        id,
        image: payload.imageBlob || new Blob(),
        theme: payload.theme || '',
      }

      await adapter.addTemplate(templateData)

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

  async updateCardphotoTemplate(
    source: ImageSourceType,
    id: number | string,
    payload: UpdateCardphotoTemplatePayload,
  ): Promise<TemplateOperationResult> {
    try {
      const adapter =
        source === 'user'
          ? userImagesTemplatesAdapter
          : stockImagesTemplatesAdapter

      const record = await adapter.getById(id)
      if (!record) {
        return {
          success: false,
          error: 'Template not found',
        }
      }

      const updatedRecord: ImageTemplateItem = {
        ...record,
        image: payload.imageBlob ?? record.image,
        theme: payload.theme ?? record.theme,
      }

      await adapter.put(updatedRecord as ImageTemplateItem & { id: string })

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

  async deleteCardphotoTemplate(
    source: ImageSourceType,
    id: number | string,
  ): Promise<TemplateOperationResult> {
    try {
      const adapter =
        source === 'user'
          ? userImagesTemplatesAdapter
          : stockImagesTemplatesAdapter

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
}

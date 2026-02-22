import { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { addCardtextTemplateId } from '@features/previewStrip/infrastructure/state'
import { templateService } from '../../domain/services/templateService'
import type {
  CreateAddressTemplatePayload,
  UpdateAddressTemplatePayload,
} from '../../domain/types/addressTemplate.types'
import type {
  CreateCardtextTemplatePayload,
  UpdateCardtextTemplatePayload,
} from '../../domain/types/cardtextTemplate.types'
import type {
  CreateCardphotoTemplatePayload,
  UpdateCardphotoTemplatePayload,
} from '../../domain/types/cardphotoTemplate.types'
import type { AddressType, ImageSourceType } from '../../domain/types'
import type { TemplateOperationResult } from '../../domain/types/template.types'

export const useTemplateActions = () => {
  const dispatch = useAppDispatch()

  const createAddressTemplate = useCallback(
    async (
      payload: CreateAddressTemplatePayload,
    ): Promise<TemplateOperationResult> => {
      return await templateService.createAddressTemplate(payload)
    },
    [],
  )

  const updateAddressTemplate = useCallback(
    async (
      type: AddressType,
      id: number | string,
      payload: UpdateAddressTemplatePayload,
    ): Promise<TemplateOperationResult> => {
      return await templateService.updateAddressTemplate(type, id, payload)
    },
    [],
  )

  const deleteAddressTemplate = useCallback(
    async (
      type: AddressType,
      id: number | string,
    ): Promise<TemplateOperationResult> => {
      return await templateService.deleteAddressTemplate(type, id)
    },
    [],
  )

  const createCardtextTemplate = useCallback(
    async (
      payload: CreateCardtextTemplatePayload,
    ): Promise<TemplateOperationResult> => {
      const result = await templateService.createCardtextTemplate(payload)
      if (result.success && result.templateId) {
        dispatch(addCardtextTemplateId(String(result.templateId)))
      }
      return result
    },
    [dispatch],
  )

  const updateCardtextTemplate = useCallback(
    async (
      id: string,
      payload: UpdateCardtextTemplatePayload,
    ): Promise<TemplateOperationResult> => {
      return await templateService.updateCardtextTemplate(id, payload)
    },
    [],
  )

  const deleteCardtextTemplate = useCallback(
    async (id: string): Promise<TemplateOperationResult> => {
      return await templateService.deleteCardtextTemplate(id)
    },
    [],
  )

  const createCardphotoTemplate = useCallback(
    async (
      payload: CreateCardphotoTemplatePayload,
    ): Promise<TemplateOperationResult> => {
      return await templateService.createCardphotoTemplate(payload)
    },
    [],
  )

  const updateCardphotoTemplate = useCallback(
    async (
      source: ImageSourceType,
      id: number | string,
      payload: UpdateCardphotoTemplatePayload,
    ): Promise<TemplateOperationResult> => {
      return await templateService.updateCardphotoTemplate(source, id, payload)
    },
    [],
  )

  const deleteCardphotoTemplate = useCallback(
    async (
      source: ImageSourceType,
      id: number | string,
    ): Promise<TemplateOperationResult> => {
      return await templateService.deleteCardphotoTemplate(source, id)
    },
    [],
  )

  return {
    createAddressTemplate,
    updateAddressTemplate,
    deleteAddressTemplate,

    createCardtextTemplate,
    updateCardtextTemplate,
    deleteCardtextTemplate,

    createCardphotoTemplate,
    updateCardphotoTemplate,
    deleteCardphotoTemplate,
  }
}

export const useAddressTemplateActions = (type: AddressType) => {
  const {
    createAddressTemplate,
    updateAddressTemplate,
    deleteAddressTemplate,
  } = useTemplateActions()

  const create = useCallback(
    async (payload: Omit<CreateAddressTemplatePayload, 'type'>) => {
      return await createAddressTemplate({ ...payload, type })
    },
    [createAddressTemplate, type],
  )

  const update = useCallback(
    async (id: number | string, payload: UpdateAddressTemplatePayload) => {
      return await updateAddressTemplate(type, id, payload)
    },
    [updateAddressTemplate, type],
  )

  const remove = useCallback(
    async (id: number | string) => {
      return await deleteAddressTemplate(type, id)
    },
    [deleteAddressTemplate, type],
  )

  return {
    create,
    update,
    delete: remove,
  }
}

export const useCardphotoTemplateActions = (source: ImageSourceType) => {
  const {
    createCardphotoTemplate,
    updateCardphotoTemplate,
    deleteCardphotoTemplate,
  } = useTemplateActions()

  const create = useCallback(
    async (payload: Omit<CreateCardphotoTemplatePayload, 'source'>) => {
      return await createCardphotoTemplate({ ...payload, source })
    },
    [createCardphotoTemplate, source],
  )

  const update = useCallback(
    async (id: number | string, payload: UpdateCardphotoTemplatePayload) => {
      return await updateCardphotoTemplate(source, id, payload)
    },
    [updateCardphotoTemplate, source],
  )

  const remove = useCallback(
    async (id: number | string) => {
      return await deleteCardphotoTemplate(source, id)
    },
    [deleteCardphotoTemplate, source],
  )

  return {
    create,
    update,
    delete: remove,
  }
}

import { useState, useCallback } from 'react'
import {
  useAddressTemplates,
  useAddressTemplateActions,
} from '@entities/templates'
import type { AddressTemplate } from '@entities/templates'
import type { EnvelopeRole } from '@shared/config/constants'
import type {
  CreateAddressTemplatePayload,
  UpdateAddressTemplatePayload,
} from '@entities/templates'

interface UseAddressTemplatesViewOptions {
  /** Тип адреса (recipient/sender) */
  type: EnvelopeRole
  /** Обработчик успешного сохранения */
  onSaveSuccess?: () => void
  /** Обработчик ошибок */
  onError?: (error: string) => void
}

/**
 * Хук для управления представлением шаблонов адресов
 * Объединяет загрузку данных и действия с шаблонами
 */
export const useAddressTemplatesView = ({
  type,
  onSaveSuccess,
  onError,
}: UseAddressTemplatesViewOptions) => {
  const { templates, isLoading, reload } = useAddressTemplates(type)
  const { create, update, delete: deleteTemplate } = useAddressTemplateActions(type)
  
  const [selectedTemplate, setSelectedTemplate] = useState<AddressTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Выбрать шаблон
   */
  const handleSelect = useCallback((template: AddressTemplate) => {
    setSelectedTemplate(template)
  }, [])

  /**
   * Создать новый шаблон
   */
  const handleCreate = useCallback(
    async (payload: Omit<CreateAddressTemplatePayload, 'type'>) => {
      setIsSaving(true)
      try {
        const result = await create(payload)
        if (result.success) {
          await reload()
          onSaveSuccess?.()
        } else {
          onError?.(result.error || 'Ошибка при создании адреса')
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Неизвестная ошибка')
      } finally {
        setIsSaving(false)
      }
    },
    [create, reload, onSaveSuccess, onError],
  )

  /**
   * Обновить шаблон
   */
  const handleUpdate = useCallback(
    async (templateId: number | string, payload: UpdateAddressTemplatePayload) => {
      setIsSaving(true)
      try {
        const result = await update(templateId, payload)
        if (result.success) {
          await reload()
          onSaveSuccess?.()
        } else {
          onError?.(result.error || 'Ошибка при обновлении адреса')
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Неизвестная ошибка')
      } finally {
        setIsSaving(false)
      }
    },
    [update, reload, onSaveSuccess, onError],
  )

  /**
   * Удалить шаблон
   */
  const handleDelete = useCallback(
    async (templateId: number | string) => {
      try {
        const result = await deleteTemplate(templateId)
        if (result.success) {
          await reload()
          if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(null)
          }
        } else {
          onError?.(result.error || 'Ошибка при удалении адреса')
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Неизвестная ошибка')
      }
    },
    [deleteTemplate, reload, selectedTemplate, onError],
  )

  /**
   * Редактировать шаблон (открыть форму редактирования)
   */
  const handleEdit = useCallback((template: AddressTemplate) => {
    setSelectedTemplate(template)
    // Здесь можно открыть модальное окно или форму редактирования
  }, [])

  return {
    // Данные
    templates,
    isLoading,
    selectedTemplate,
    isSaving,

    // Действия
    handleSelect,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    reload,
  }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@app/hooks'
import {
  cardtextTemplateAdded,
  clearDraftData,
  setCardtextAddTemplateOpen,
  setCardtextId,
  setStatus,
  setTitle,
  updateCardtextTemplateTitleInList,
} from '@cardtext/infrastructure/state'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { templateService } from '@entities/templates/domain/services/templateService'
import { getUniqueCardtextTemplateTitle } from '@cardtext/application/helpers/getUniqueCardtextTemplateTitle'
import type {
  CardtextContent,
  CardtextStyle,
  CardtextStatus,
  CardtextValue,
} from '@cardtext/domain/editor/editor.types'

export interface UseCardtextTitleStripParams {
  title: string
  id: string | null
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  cardtextAssetStatus: CardtextStatus
  isAddTemplateOpen: boolean
  cardtextTemplates: CardtextContent[] | null
}

export function useCardtextTitleStrip(p: UseCardtextTitleStripParams) {
  const {
    title,
    id,
    value,
    style,
    plainText,
    cardtextLines,
    cardtextAssetStatus,
    isAddTemplateOpen,
    cardtextTemplates,
  } = p

  const dispatch = useAppDispatch()
  const { createCardtextTemplate, updateCardtextTemplate } =
    useTemplateActions()

  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleStripRef = useRef<HTMLDivElement>(null)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isSubmittingTitle, setIsSubmittingTitle] = useState(false)

  useEffect(() => {
    if (!isEditingTitle) return
    const el = titleInputRef.current
    if (!el) return
    el.focus()
    const len = el.value.length
    el.setSelectionRange(len, len)
  }, [isEditingTitle])

  useEffect(() => {
    if (!isAddTemplateOpen) return
    setDraftTitle('')
    setIsEditingTitle(true)
  }, [isAddTemplateOpen])

  const cancelEditTitle = useCallback(() => {
    setDraftTitle('')
    setIsEditingTitle(false)
    if (isAddTemplateOpen) dispatch(setCardtextAddTemplateOpen(false))
  }, [dispatch, isAddTemplateOpen])

  useEffect(() => {
    if (!isAddTemplateOpen || !isEditingTitle) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!titleStripRef.current || !target) return
      if (titleStripRef.current.contains(target)) return

      const listAddButton = (event.target as HTMLElement | null)?.closest(
        '[data-icon-key="listAdd"]',
      )
      if (listAddButton) return

      cancelEditTitle()
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [isAddTemplateOpen, isEditingTitle, cancelEditTitle])

  const startEditTitle = useCallback(() => {
    if (isAddTemplateOpen) return
    if (!title.trim()) return
    setDraftTitle(title)
    setIsEditingTitle(true)
  }, [isAddTemplateOpen, title])

  const commitEditTitle = useCallback(async () => {
    if (isSubmittingTitle) return

    const next = draftTitle.trim().slice(0, 60)

    if (!next) {
      cancelEditTitle()
      return
    }

    if (!isAddTemplateOpen && next === title.trim()) {
      cancelEditTitle()
      return
    }

    setIsSubmittingTitle(true)
    try {
      if (isAddTemplateOpen) {
        const existingTitles = new Set(
          (cardtextTemplates ?? []).map((t) => t.title),
        )
        const uniqueTitle = getUniqueCardtextTemplateTitle(next, existingTitles)
        const processedFromDb =
          await templateService.getSingleCardtextByStatus('processed')
        const processedId =
          (cardtextAssetStatus === 'processed' && id) ||
          (processedFromDb?.id != null ? String(processedFromDb.id) : null)
        const result =
          processedId != null
            ? await updateCardtextTemplate(processedId, {
                value: value ?? [],
                style,
                plainText,
                cardtextLines,
                title: uniqueTitle,
                status: 'inLine',
              })
            : await createCardtextTemplate({
                value: value ?? [],
                style,
                plainText,
                cardtextLines,
                title: uniqueTitle,
              })

        if (result.success) {
          dispatch(cardtextTemplateAdded())
          dispatch(clearDraftData())
          dispatch(setCardtextId(null))
          dispatch(setStatus('inLine'))
        }
      } else {
        if (!id) {
          cancelEditTitle()
          return
        }
        const result = await updateCardtextTemplate(id, { title: next })
        if (result.success) {
          dispatch(setTitle(next))
          dispatch(updateCardtextTemplateTitleInList({ id, title: next }))
        }
      }
    } finally {
      setIsSubmittingTitle(false)
    }

    cancelEditTitle()
  }, [
    cancelEditTitle,
    cardtextAssetStatus,
    cardtextLines,
    cardtextTemplates,
    createCardtextTemplate,
    dispatch,
    draftTitle,
    id,
    isAddTemplateOpen,
    isSubmittingTitle,
    plainText,
    style,
    title,
    updateCardtextTemplate,
    value,
  ])

  const forceEditingTitle = isAddTemplateOpen || isEditingTitle

  return {
    titleInputRef,
    titleStripRef,
    draftTitle,
    setDraftTitle,
    isSubmittingTitle,
    forceEditingTitle,
    startEditTitle,
    cancelEditTitle,
    commitEditTitle,
  }
}

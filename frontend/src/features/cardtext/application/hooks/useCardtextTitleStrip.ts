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
import { resolveCardtextTemplateTitle } from '@cardtext/application/helpers/resolveCardtextTemplateTitle'
import {
  CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH,
  suggestCardtextTemplateTitle,
} from '@cardtext/application/helpers/suggestCardtextTemplateTitle'
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
  const addTemplateSaveStartedRef = useRef(false)

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

  const cancelEditTitle = useCallback(() => {
    setDraftTitle('')
    setIsEditingTitle(false)
    if (isAddTemplateOpen) dispatch(setCardtextAddTemplateOpen(false))
  }, [dispatch, isAddTemplateOpen])

  const saveTemplateToList = useCallback(
    async (baseTitle: string): Promise<boolean> => {
      const existingTitles = (cardtextTemplates ?? []).map((t) => t.title ?? '')
      const uniqueTitle = resolveCardtextTemplateTitle(
        plainText,
        existingTitles,
        baseTitle,
      )
      if (!uniqueTitle) return false

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
        dispatch(setTitle(uniqueTitle))
        dispatch(clearDraftData())
        dispatch(setCardtextId(null))
        dispatch(setStatus('inLine'))
        return true
      }
      return false
    },
    [
      cardtextAssetStatus,
      cardtextLines,
      cardtextTemplates,
      createCardtextTemplate,
      dispatch,
      id,
      plainText,
      style,
      updateCardtextTemplate,
      value,
    ],
  )

  useEffect(() => {
    if (!isAddTemplateOpen) {
      addTemplateSaveStartedRef.current = false
      return
    }
    if (addTemplateSaveStartedRef.current) return
    addTemplateSaveStartedRef.current = true

    let cancelled = false
    void (async () => {
      setIsSubmittingTitle(true)
      try {
        const ok = await saveTemplateToList('')
        if (!cancelled && !ok) {
          dispatch(setCardtextAddTemplateOpen(false))
        }
      } finally {
        if (!cancelled) {
          setIsSubmittingTitle(false)
          dispatch(setCardtextAddTemplateOpen(false))
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch, isAddTemplateOpen, saveTemplateToList])

  const startEditTitle = useCallback(() => {
    if (isAddTemplateOpen) return
    const seed = title.trim() || suggestCardtextTemplateTitle(plainText)
    if (!seed) return
    setDraftTitle(seed)
    setIsEditingTitle(true)
  }, [isAddTemplateOpen, plainText, title])

  const commitEditTitle = useCallback(async () => {
    if (isSubmittingTitle) return

    const next = draftTitle.trim().slice(0, CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH)

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
        await saveTemplateToList(next)
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
    dispatch,
    draftTitle,
    id,
    isAddTemplateOpen,
    isSubmittingTitle,
    saveTemplateToList,
    title,
    updateCardtextTemplate,
  ])

  const forceEditingTitle = isEditingTitle

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

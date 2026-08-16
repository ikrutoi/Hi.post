import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH } from '@cardtext/application/helpers'
import {
  selectCardtextId,
  selectCardtextListCentralTemplateTitle,
  selectCardtextListHighlightTemplateId,
} from '@cardtext/infrastructure/selectors'
import {
  setTitle,
  updateCardtextTemplateTitleInList,
} from '@cardtext/infrastructure/state'

export function useCardtextListToolbarTitleEdit() {
  const dispatch = useAppDispatch()
  const { updateCardtextTemplate } = useTemplateActions()
  const highlightId = useAppSelector(selectCardtextListHighlightTemplateId)
  const displayTitle = useAppSelector(selectCardtextListCentralTemplateTitle)
  const sessionId = useAppSelector(selectCardtextId)

  const inputRef = useRef<HTMLInputElement>(null)
  const editingIdRef = useRef<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cancelEdit = useCallback(() => {
    editingIdRef.current = null
    setDraftTitle('')
    setIsEditing(false)
  }, [])

  useEffect(() => {
    if (!isEditing) return
    if (highlightId == null || highlightId !== editingIdRef.current) {
      cancelEdit()
    }
  }, [cancelEdit, highlightId, isEditing])

  useEffect(() => {
    if (!isEditing) return
    const el = inputRef.current
    if (!el) return
    el.focus()
    const len = el.value.length
    el.setSelectionRange(len, len)
  }, [isEditing])

  const startEdit = useCallback(() => {
    if (isSubmitting || highlightId == null || !displayTitle) return
    editingIdRef.current = highlightId
    setDraftTitle(displayTitle)
    setIsEditing(true)
  }, [displayTitle, highlightId, isSubmitting])

  const commitEdit = useCallback(async () => {
    if (isSubmitting) return

    const templateId = editingIdRef.current
    const next = draftTitle.trim().slice(0, CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH)
    const current = displayTitle?.trim() ?? ''

    if (!templateId || !next || next === current) {
      cancelEdit()
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updateCardtextTemplate(templateId, { title: next })
      if (result.success) {
        dispatch(updateCardtextTemplateTitleInList({ id: templateId, title: next }))
        if (sessionId != null && String(sessionId) === String(templateId)) {
          dispatch(setTitle(next))
        }
      }
    } finally {
      setIsSubmitting(false)
      cancelEdit()
    }
  }, [
    cancelEdit,
    dispatch,
    displayTitle,
    draftTitle,
    isSubmitting,
    sessionId,
    updateCardtextTemplate,
  ])

  return {
    inputRef,
    displayTitle,
    draftTitle,
    setDraftTitle,
    isEditing,
    isSubmitting,
    startEdit,
    cancelEdit,
    commitEdit,
  }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@app/hooks'
import { setCardphotoTitle } from '@cardphoto/infrastructure/state'
import { storeAdapters } from '@db/adapters/storeAdapters/storeAdapters'
import { CARDPHOTO_TEMPLATE_TITLE_MAX_LENGTH } from '@cardphoto/application/helpers/cardphotoTemplateTitle'
import type { ImageStatus } from '@cardphoto/domain/types'

export interface UseCardphotoTitleStripParams {
  title: string
  id: string | null
  imageStatus: ImageStatus | undefined
}

export function useCardphotoTitleStrip(p: UseCardphotoTitleStripParams) {
  const { title, id, imageStatus } = p
  const dispatch = useAppDispatch()

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

  const cancelEditTitle = useCallback(() => {
    setDraftTitle('')
    setIsEditingTitle(false)
  }, [])

  const startEditTitle = useCallback(() => {
    setDraftTitle(title.trim())
    setIsEditingTitle(true)
  }, [title])

  const commitEditTitle = useCallback(async () => {
    if (isSubmittingTitle) return

    const next = draftTitle
      .trim()
      .slice(0, CARDPHOTO_TEMPLATE_TITLE_MAX_LENGTH)

    if (!next) {
      cancelEditTitle()
      return
    }

    if (next === title.trim()) {
      cancelEditTitle()
      return
    }

    if (!id) {
      cancelEditTitle()
      return
    }

    setIsSubmittingTitle(true)
    try {
      const row = await storeAdapters.cardphotoImages.getById(id)
      if (!row) {
        cancelEditTitle()
        return
      }
      const updated = { ...row, title: next }
      await storeAdapters.cardphotoImages.put(updated)
      dispatch(setCardphotoTitle(next))
    } finally {
      setIsSubmittingTitle(false)
    }

    cancelEditTitle()
  }, [
    cancelEditTitle,
    dispatch,
    draftTitle,
    id,
    isSubmittingTitle,
    title,
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
    imageStatus,
  }
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardtextAddTemplateOpen,
  selectCardtextState,
  selectCardtextTemplatesListItems,
} from '@cardtext/infrastructure/selectors'
import {
  setCardtextAddTemplateOpen,
  cardtextTemplateAdded,
  setCardtextShowViewMode,
} from '@cardtext/infrastructure/state'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { getToolbarIcon } from '@/shared/utils/icons'
import { IconX } from '@shared/ui/icons'
import styles from './CardtextSaveTemplateInline.module.scss'

function getUniqueTitle(baseTitle: string, existingTitles: Set<string>): string {
  if (!baseTitle) return baseTitle
  if (!existingTitles.has(baseTitle)) return baseTitle
  let n = 1
  while (existingTitles.has(`${baseTitle} (${n})`)) n++
  return `${baseTitle} (${n})`
}

export const CardtextSaveTemplateInline: React.FC = () => {
  const isOpen = useAppSelector(selectCardtextAddTemplateOpen)
  const cardtextState = useAppSelector(selectCardtextState)
  const cardtextTemplates = useAppSelector(selectCardtextTemplatesListItems)
  const dispatch = useAppDispatch()
  const { createCardtextTemplate } = useTemplateActions()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const existingTitles = useMemo(
    () => new Set(cardtextTemplates.map((t) => t.title)),
    [cardtextTemplates],
  )

  const close = useCallback(() => {
    dispatch(setCardtextAddTemplateOpen(false))
    setTitle('')
  }, [dispatch])

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  const canSubmit = title.trim().length > 0

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      const baseTitle = title.trim()
      if (isSubmitting || !baseTitle) return
      setIsSubmitting(true)
      try {
        const uniqueTitle = getUniqueTitle(baseTitle, existingTitles)
        await createCardtextTemplate({
          value: cardtextState.value,
          style: cardtextState.style,
          plainText: cardtextState.plainText,
          cardtextLines: cardtextState.cardtextLines,
          title: uniqueTitle,
        })
        dispatch(cardtextTemplateAdded())
        dispatch(setCardtextShowViewMode(true))
        close()
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      createCardtextTemplate,
      cardtextState.value,
      cardtextState.style,
      cardtextState.plainText,
      cardtextState.cardtextLines,
      title,
      existingTitles,
      dispatch,
      close,
      isSubmitting,
    ],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Enter') handleSubmit()
    },
    [close, handleSubmit],
  )

  if (!isOpen) return null

  return (
    <div className={styles.strip} role="region" aria-label="Save template">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          disabled={isSubmitting}
          aria-label="Template name"
        />
        <button
          type="submit"
          className={styles.confirmBtn}
          disabled={isSubmitting || !canSubmit}
          aria-label="Save"
          title="Save"
        >
          {getToolbarIcon({ key: 'apply' })}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={close}
          disabled={isSubmitting}
          aria-label="Cancel"
          title="Cancel"
        >
          <IconX />
        </button>
      </form>
    </div>
  )
}

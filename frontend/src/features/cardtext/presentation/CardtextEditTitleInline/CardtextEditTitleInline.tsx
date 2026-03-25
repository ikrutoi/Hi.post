import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardtextEditTitleOpen,
  selectCardtextId,
  selectCardtextTitle,
} from '@cardtext/infrastructure/selectors'
import {
  setCardtextEditTitleOpen,
  setTitle,
  updateCardtextTemplateTitleInList,
} from '@cardtext/infrastructure/state'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { getToolbarIcon } from '@/shared/utils/icons'
import { IconX } from '@shared/ui/icons'
import styles from './CardtextEditTitleInline.module.scss'

export const CardtextEditTitleInline: React.FC = () => {
  const isOpen = useAppSelector(selectCardtextEditTitleOpen)
  const templateId = useAppSelector(selectCardtextId)
  const currentTitle = useAppSelector(selectCardtextTitle)
  const dispatch = useAppDispatch()
  const { updateCardtextTemplate } = useTemplateActions()
  const [title, setTitleLocal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    dispatch(setCardtextEditTitleOpen(false))
    setTitleLocal('')
  }, [dispatch])

  useEffect(() => {
    if (isOpen) {
      setTitleLocal(currentTitle)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen, currentTitle])

  const canSubmit = title.trim().length > 0 && templateId != null

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      const newTitle = title.trim()
      if (isSubmitting || !newTitle || !templateId) return
      setIsSubmitting(true)
      try {
        const result = await updateCardtextTemplate(templateId, {
          title: newTitle,
        })
        if (result.success) {
          dispatch(setTitle(newTitle))
          dispatch(
            updateCardtextTemplateTitleInList({
              id: templateId,
              title: newTitle,
            }),
          )
          close()
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [updateCardtextTemplate, templateId, title, dispatch, close, isSubmitting],
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
    <div className={styles.strip} role="region" aria-label="Edit template name">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitleLocal(e.target.value)}
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

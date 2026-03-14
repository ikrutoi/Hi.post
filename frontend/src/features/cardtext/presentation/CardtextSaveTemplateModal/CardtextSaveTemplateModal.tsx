import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardtextAddTemplateOpen,
  selectCardtextState,
} from '@cardtext/infrastructure/selectors'
import {
  setCardtextAddTemplateOpen,
  cardtextTemplateAdded,
} from '@cardtext/infrastructure/state'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import styles from './CardtextSaveTemplateModal.module.scss'

export const CardtextSaveTemplateModal: React.FC = () => {
  const isOpen = useAppSelector(selectCardtextAddTemplateOpen)
  const cardtextState = useAppSelector(selectCardtextState)
  const dispatch = useAppDispatch()
  const { createCardtextTemplate } = useTemplateActions()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const close = useCallback(() => {
    dispatch(setCardtextAddTemplateOpen(false))
    setTitle('')
  }, [dispatch])

  useEffect(() => {
    if (isOpen) setTitle('')
  }, [isOpen])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (isSubmitting) return
      setIsSubmitting(true)
      try {
        await createCardtextTemplate({
          value: cardtextState.value,
          style: cardtextState.style,
          plainText: cardtextState.plainText,
          cardtextLines: cardtextState.cardtextLines,
          title: title.trim() || 'Без названия',
        })
        dispatch(cardtextTemplateAdded())
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
      close,
      isSubmitting,
      dispatch,
    ],
  )

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) close()
    },
    [close],
  )

  if (!isOpen) return null

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cardtext-save-template-title"
    >
      <div className={styles.panel}>
        <h2 id="cardtext-save-template-title" className={styles.title}>
          Сохранить как шаблон
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="cardtext-template-name" className={styles.label}>
            Название
          </label>
          <input
            id="cardtext-template-name"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название шаблона"
            autoFocus
            disabled={isSubmitting}
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={close}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

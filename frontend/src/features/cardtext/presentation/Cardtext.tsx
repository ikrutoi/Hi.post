import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import { useAppSelector } from '@app/hooks'
import {
  selectCardtextAddTemplateOpen,
  selectCardtextId,
  selectCardtextStatus,
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
} from '@cardtext/infrastructure/selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'
import viewStyles from './CardtextView/CardtextView.module.scss'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { useAppDispatch } from '@app/hooks'
import {
  cardtextTemplateAdded,
  clearDraftData,
  setCardtextAddTemplateOpen,
  setCardtextId,
  setStatus,
  setTitle,
  loadCardtextTemplatesRequest,
  updateCardtextTemplateTitleInList,
} from '@cardtext/infrastructure/state'
import { getToolbarIcon } from '@/shared/utils/icons'
import { IconX } from '@shared/ui/icons'
import { isEmptyCardtextValue } from '@cardtext/domain/helpers'

interface CardtextProps {
  styleLeft: number
}

function getUniqueTitle(
  baseTitle: string,
  existingTitles: Set<string>,
): string {
  if (!baseTitle) return baseTitle
  if (!existingTitles.has(baseTitle)) return baseTitle
  let n = 1
  while (existingTitles.has(`${baseTitle} (${n})`)) n++
  return `${baseTitle} (${n})`
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft }) => {
  const { sizeCard } = useSizeFacade()
  const {
    state,
    currentView,
    value,
    style,
    title,
    id,
    plainText,
    cardtextLines,
  } = useCardtextFacade()
  console.log('Cardtext state', state)
  const currentTemplateId = useAppSelector(selectCardtextId)
  const cardtextStatus = useAppSelector(selectCardtextStatus)
  const isAddTemplateOpen = useAppSelector(selectCardtextAddTemplateOpen)
  const cardtextTemplates = useAppSelector(selectCardtextTemplatesListItems)
  const cardtextTemplatesLoading = useAppSelector(
    selectCardtextTemplatesListLoading,
  )
  const dispatch = useAppDispatch()
  const { createCardtextTemplate, updateCardtextTemplate } =
    useTemplateActions()

  const formRef = useRef<HTMLDivElement>(null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddTemplateOpen, isEditingTitle])

  const startEditTitle = () => {
    if (isAddTemplateOpen) return
    if (!title.trim()) return
    setDraftTitle(title)
    setIsEditingTitle(true)
  }

  const cancelEditTitle = () => {
    setDraftTitle('')
    setIsEditingTitle(false)
    if (isAddTemplateOpen) dispatch(setCardtextAddTemplateOpen(false))
  }

  const commitEditTitle = async () => {
    const next = draftTitle.trim().slice(0, 60)
    if (!next || isSubmittingTitle) {
      cancelEditTitle()
      return
    }

    setIsSubmittingTitle(true)
    try {
      if (isAddTemplateOpen) {
        const existingTitles = new Set(
          (cardtextTemplates ?? []).map((t) => t.title),
        )
        const uniqueTitle = getUniqueTitle(next, existingTitles)
        const result =
          cardtextStatus === 'processed' && id
            ? await updateCardtextTemplate(id, {
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
  }

  const forceEditingTitle = isAddTemplateOpen || isEditingTitle

  const toolbarSection =
    cardtextStatus === 'processed'
      ? 'cardtextProcessed'
      : currentView === 'draft' && currentTemplateId == null
      ? 'cardtextCreate'
      : currentView === 'view'
        ? 'cardtextView'
        : 'cardtextEditor'

  const isCreateNewEmpty =
    currentView === 'draft' &&
    currentTemplateId == null &&
    isEmptyCardtextValue(value) &&
    !isAddTemplateOpen

  const showCardtextToolbarRow = !isCreateNewEmpty

  useEffect(() => {
    if (cardtextTemplatesLoading) return
    // Only request when templates are still unknown (`null`).
    // If server returns empty list, we keep badge hidden without re-fetching.
    if (cardtextTemplates != null) return
    dispatch(loadCardtextTemplatesRequest())
  }, [cardtextTemplatesLoading, dispatch, cardtextTemplates])

  return (
    <div className={styles.cardtextContainer}>
      <div
        ref={formRef}
        className={styles.cardtext}
        style={{
          width: `${sizeCard.width}px`,
          height: `${sizeCard.height}px`,
        }}
      >
        <div className={styles.cardtextViewWrap}>
          <div
            className={clsx(
              styles.cardtextToolbarRow,
              !showCardtextToolbarRow && styles.cardtextToolbarRowEmpty,
            )}
            aria-hidden={showCardtextToolbarRow ? undefined : true}
          >
            {showCardtextToolbarRow ? (
              <Toolbar section={toolbarSection} />
            ) : null}
          </div>
          <div className={styles.cardtextViewContent}>
            {(title.trim() || isAddTemplateOpen) && (
              <>
                {forceEditingTitle ? (
                  <div
                    ref={titleStripRef}
                    className={clsx(
                      viewStyles.viewTitle,
                      viewStyles.viewTitleEditing,
                    )}
                  >
                    <input
                      ref={titleInputRef}
                      type="text"
                      className={viewStyles.viewTitleEditingInput}
                      value={draftTitle}
                      maxLength={60}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onBlur={() => {
                        if (isAddTemplateOpen) cancelEditTitle()
                        else void commitEditTitle()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          cancelEditTitle()
                        }
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          void commitEditTitle()
                        }
                      }}
                      disabled={isSubmittingTitle}
                      aria-label="Template name"
                      title="Edit template name"
                    />
                    <button
                      type="button"
                      className={viewStyles.viewTitleEditingBtn}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => void commitEditTitle()}
                      aria-label="Save title"
                      title="Save"
                      disabled={isSubmittingTitle}
                    >
                      {getToolbarIcon({ key: 'apply' })}
                    </button>
                    <button
                      type="button"
                      className={viewStyles.viewTitleEditingBtn}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={cancelEditTitle}
                      aria-label="Cancel editing title"
                      title="Cancel"
                      disabled={isSubmittingTitle}
                    >
                      <IconX />
                    </button>
                  </div>
                ) : (
                  currentView === 'view' && (
                    <button
                      type="button"
                      className={viewStyles.viewTitle}
                      onClick={startEditTitle}
                      aria-label="Edit template name"
                      title="Edit template name"
                    >
                      <span className={viewStyles.viewTitleText} aria-hidden>
                        {title}
                      </span>
                    </button>
                  )
                )}
              </>
            )}

            {currentView === 'view' ? (
              <CardtextView
                key={id ?? 'no-template'}
                value={value}
                style={style}
              />
            ) : (
              <CardEditor />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

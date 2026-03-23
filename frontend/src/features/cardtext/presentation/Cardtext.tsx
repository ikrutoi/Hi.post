import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import { useAppSelector } from '@app/hooks'
import {
  selectCardtextAddTemplateOpen,
  selectCardtextAssetId,
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
  clearCreateDraft,
  clearCreateReturnSnapshot,
  setCardtextAddTemplateOpen,
  setCardtextCurrentView,
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
  const { state, currentView, value, style, title, assetId } =
    useCardtextFacade()
  const currentAssetId = useAppSelector(selectCardtextAssetId)
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

  console.log('Cardtext state', state)

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

        const result = await createCardtextTemplate({
          value: state.value ?? [],
          style: state.style,
          plainText: state.plainText,
          cardtextLines: state.cardtextLines,
          title: uniqueTitle,
        })

        if (result.success) {
          dispatch(cardtextTemplateAdded())
          dispatch(clearCreateDraft())
          dispatch(clearCreateReturnSnapshot())
          dispatch(setCardtextCurrentView('cardtextView'))
        }
      } else {
        if (!assetId) {
          cancelEditTitle()
          return
        }
        const result = await updateCardtextTemplate(assetId, { title: next })
        if (result.success) {
          dispatch(setTitle(next))
          dispatch(
            updateCardtextTemplateTitleInList({ id: assetId, title: next }),
          )
        }
      }
    } finally {
      setIsSubmittingTitle(false)
    }

    cancelEditTitle()
  }

  const forceEditingTitle = isAddTemplateOpen || isEditingTitle

  /** Новый шаблон без текста: без тулбара cardtextCreate (только иконка-плейсхолдер). */
  const isCreateNewEmpty =
    currentView === 'cardtextEditor' &&
    currentAssetId == null &&
    isEmptyCardtextValue(value) &&
    !isAddTemplateOpen

  const showCardtextToolbarRow = !isCreateNewEmpty

  const toolbarSection =
    currentView === 'cardtextEditor' && currentAssetId == null
      ? 'cardtextCreate'
      : currentView

  // Ensure `listCardtext` badge count is available immediately when entering `cardtext`.
  // Previously templates were loaded only when opening the list panel.
  useEffect(() => {
    const count = cardtextTemplates?.length ?? 0
    if (toolbarSection !== 'cardtext') return
    if (cardtextTemplatesLoading) return
    if (count > 0) return
    dispatch(loadCardtextTemplatesRequest())
  }, [toolbarSection, cardtextTemplatesLoading, dispatch, cardtextTemplates])

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
                  currentView === 'cardtextView' && (
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

            {currentView === 'cardtextView' ? (
              <CardtextView
                key={assetId ?? 'no-template'}
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

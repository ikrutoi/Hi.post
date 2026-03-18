import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import { useAppSelector } from '@app/hooks'
import { selectCardtextAssetId } from '@cardtext/infrastructure/selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'
import viewStyles from './CardtextView/CardtextView.module.scss'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { useAppDispatch } from '@app/hooks'
import { setTitle, updateCardtextTemplateTitleInList } from '@cardtext/infrastructure/state'
import { getToolbarIcon } from '@/shared/utils/icons'
import { IconX } from '@shared/ui/icons'

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft }) => {
  const { sizeCard } = useSizeFacade()
  const { state, currentView, value, style, title, assetId } = useCardtextFacade()
  const currentAssetId = useAppSelector(selectCardtextAssetId)
  const dispatch = useAppDispatch()
  const { updateCardtextTemplate } = useTemplateActions()

  const formRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')

  console.log('Cardtext state', state)

  useEffect(() => {
    if (!isEditingTitle) return
    const el = titleInputRef.current
    if (!el) return
    el.focus()
    const len = el.value.length
    el.setSelectionRange(len, len)
  }, [isEditingTitle])

  const startEditTitle = () => {
    if (!title.trim()) return
    setDraftTitle(title)
    setIsEditingTitle(true)
  }

  const cancelEditTitle = () => {
    setDraftTitle('')
    setIsEditingTitle(false)
  }

  const commitEditTitle = async () => {
    const next = draftTitle.trim()
    if (!next || !assetId) {
      cancelEditTitle()
      return
    }
    const result = await updateCardtextTemplate(assetId, { title: next })
    if (result.success) {
      dispatch(setTitle(next))
      dispatch(updateCardtextTemplateTitleInList({ id: assetId, title: next }))
    }
    cancelEditTitle()
  }

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
          <div className={styles.cardtextToolbarRow}>
            <Toolbar
              section={
                currentView === 'cardtextEditor' && currentAssetId == null
                  ? 'cardtextCreate'
                  : currentView
              }
            />
          </div>
          <div className={styles.cardtextViewContent}>
            {currentView === 'cardtextView' ? (
              <>
                {title.trim() &&
                  (isEditingTitle ? (
                    <div
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
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onBlur={() => void commitEditTitle()}
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
                      >
                        <IconX />
                      </button>
                    </div>
                  ) : (
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
                  ))}
                <CardtextView
                  key={assetId ?? 'no-template'}
                  value={value}
                  style={style}
                />
              </>
            ) : (
              <CardEditor />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useCallback } from 'react'
import clsx from 'clsx'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import {
  useCardtextTitleStrip,
  useLoadCardtextTemplatesWhenUnknown,
} from '../application/hooks'
import {
  resolveCardtextToolbarSection,
  shouldHideEmptyCreateToolbar,
} from '../application/helpers'
import { useAppSelector } from '@app/hooks'
import {
  selectCardtextAddTemplateOpen,
  selectCardtextAssetStatus,
  selectCardtextId,
  selectCardtextSource,
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
} from '@cardtext/infrastructure/selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'
import viewStyles from './CardtextView/CardtextView.module.scss'
import { useAppDispatch } from '@app/hooks'
import {
  setDraftFocus,
  resetCardtextAssetToEmptyDraft,
  restoreCardtextSession,
} from '@cardtext/infrastructure/state'
import { getToolbarIcon } from '@/shared/utils/icons'

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft: _styleLeft }) => {
  const { sizeCard } = useSizeFacade()
  const {
    state,
    value,
    style,
    title,
    id,
    plainText,
    cardtextLines,
  } = useCardtextFacade()

  const currentView = useAppSelector(selectCardtextSource)
  const currentTemplateId = useAppSelector(selectCardtextId)
  const cardtextAssetStatus = useAppSelector(selectCardtextAssetStatus)
  const isAddTemplateOpen = useAppSelector(selectCardtextAddTemplateOpen)
  const cardtextTemplates = useAppSelector(selectCardtextTemplatesListItems)
  const cardtextTemplatesLoading = useAppSelector(
    selectCardtextTemplatesListLoading,
  )

  const dispatch = useAppDispatch()

  const handleViewClose = useCallback(() => {
    const assetId = state.assetData?.id ?? null
    const presetId = state.presetData?.id ?? null
    if (
      state.presetData != null &&
      presetId != null &&
      String(assetId) !== String(presetId)
    ) {
      dispatch(restoreCardtextSession(state.presetData))
      dispatch(setDraftFocus(false))
      return
    }
    dispatch(resetCardtextAssetToEmptyDraft())
    dispatch(setDraftFocus(false))
  }, [dispatch, state.assetData?.id, state.presetData])

  const {
    titleInputRef,
    titleStripRef,
    draftTitle,
    setDraftTitle,
    isSubmittingTitle,
    forceEditingTitle,
    startEditTitle,
    cancelEditTitle,
    commitEditTitle,
  } = useCardtextTitleStrip({
    title,
    id,
    value,
    style,
    plainText,
    cardtextLines,
    cardtextAssetStatus,
    isAddTemplateOpen,
    cardtextTemplates,
  })

  const toolbarSection = resolveCardtextToolbarSection({
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode: state.isCardtextViewEditMode,
  })

  const hideEmptyCreateToolbar = shouldHideEmptyCreateToolbar({
    currentView,
    currentTemplateId,
    value,
    isAddTemplateOpen,
    cardtext: {
      assetData: state.assetData,
      isDraftEngaged: state.isDraftEngaged,
    },
  })

  const showCardtextToolbarRow = !hideEmptyCreateToolbar

  useLoadCardtextTemplatesWhenUnknown(cardtextTemplatesLoading, cardtextTemplates)

  return (
    <div className={styles.cardtextContainer}>
      <div
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
                      aria-label="Save and close"
                      title="Save and close"
                      disabled={isSubmittingTitle}
                    >
                      {getToolbarIcon({ key: 'applyLight' })}
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
                titleStripEditing={forceEditingTitle}
                onClose={handleViewClose}
              />
            ) : (
              <CardEditor titleStripEditing={forceEditingTitle} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

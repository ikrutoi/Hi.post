import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  createInitialCardtextContent,
  cardtextHasRenderableContent,
  cardtextValueForReadOnlyPreview,
} from '@cardtext/domain/editor/editor.types'
import { IconSectionMenuCardtext } from '@shared/ui/icons'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import {
  useCardtextTitleStrip,
  useLoadCardtextTemplatesWhenUnknown,
} from '../application/hooks'
import {
  resolveCardtextInteractionMode,
  resolveCardtextToolbarSection,
  shouldHideEmptyCreateToolbar,
  suggestCardtextTemplateTitle,
  CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH,
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
import { CARDTEXT_VIEW_TOOLBAR } from '@toolbar/domain/types/cardtext.types'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import styles from './Cardtext.module.scss'
import viewStyles from './CardtextView/CardtextView.module.scss'
import cardphotoViewStyles from '@cardphoto/presentation/CardphotoView/CardphotoView.module.scss'
import { useAppDispatch } from '@app/hooks'
import {
  deleteCardtextFromViewRequested,
} from '@cardtext/infrastructure/state'
import { getToolbarIcon } from '@/shared/utils/icons'
import type { CardPieInnerData } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { MobileInlineToolbarRow } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'

interface CardtextProps {
  styleLeft: number
}

/** Левый пирог + клик по cardtext в правом списке: только текст строки, без тулбара. */
const CardtextListRowPeekPreview: React.FC<{
  inner: CardPieInnerData
  rowLocalId: number | null
}> = ({ inner, rowLocalId }) => {
  const ct = inner.cardtext
  const fallback = createInitialCardtextContent()
  const hasText = cardtextHasRenderableContent(ct)
  const value = cardtextValueForReadOnlyPreview(ct)
  const style = ct?.style ?? fallback.style
  const contentKey =
    rowLocalId != null && ct?.id != null
      ? `peek-${rowLocalId}-${ct.id}`
      : rowLocalId != null
        ? `peek-${rowLocalId}`
        : 'peek-pending'

  return (
    <div className={styles.cardtextContainer}>
      <div className={styles.cardtext}>
        <div className={styles.cardtextViewWrap}>
          <MobileInlineToolbarRow
            className={styles.cardtextToolbarRow}
            emptyClassName={styles.cardtextToolbarRowEmpty}
            show={false}
          >
            {null}
          </MobileInlineToolbarRow>
          <div className={styles.cardtextViewContent}>
            {hasText ? (
              <CardtextView
                contentKey={contentKey}
                value={value}
                style={style}
                sectionFrame
              />
            ) : (
              <div
                className={clsx(
                  viewStyles.viewContainer,
                  viewStyles.viewContainerSectionFrame,
                )}
              >
                <div
                  className={clsx(
                    viewStyles.viewBody,
                    viewStyles.viewBodySectionFrame,
                    viewStyles.viewBodySectionFrameEmpty,
                  )}
                >
                  <div
                    className={cardphotoViewStyles.emptyPlaceholderIcon}
                    aria-hidden
                  >
                    <IconSectionMenuCardtext />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CardtextSessionEditor: React.FC<CardtextProps> = ({
  styleLeft: _styleLeft,
}) => {
  const { state, value, style, title, id, plainText, cardtextLines } =
    useCardtextFacade()

  const currentView = useAppSelector(selectCardtextSource)
  const currentTemplateId = useAppSelector(selectCardtextId)
  const cardtextAssetStatus = useAppSelector(selectCardtextAssetStatus)
  const isAddTemplateOpen = useAppSelector(selectCardtextAddTemplateOpen)
  const cardtextTemplates = useAppSelector(selectCardtextTemplatesListItems)
  const cardtextTemplatesLoading = useAppSelector(
    selectCardtextTemplatesListLoading,
  )

  // console.log('CARDTEXT STATE', state)

  const dispatch = useAppDispatch()
  const { isMobileLayout } = useSizeFacade()
  const viewToolbarState = useAppSelector(
    selectToolbarSectionState('cardtextView'),
  )

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

  const interactionMode = resolveCardtextInteractionMode({
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode: state.isCardtextViewEditMode,
  })

  const toolbarSection = resolveCardtextToolbarSection({
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode: state.isCardtextViewEditMode,
  })

  const cardtextViewToolbarGroupsOverride = useMemo(() => {
    if (toolbarSection === 'cardtextView' && isMobileLayout) {
      return CARDTEXT_VIEW_TOOLBAR.map((group) =>
        group.group === 'close'
          ? { ...group, icons: [{ key: 'delete' as const, state: 'enabled' as const }] }
          : group,
      )
    }
    return undefined
  }, [isMobileLayout, toolbarSection])

  const cardtextViewToolbarStateOverride = useMemo(() => {
    if (toolbarSection === 'cardtextView' && isMobileLayout && viewToolbarState?.close) {
      return { delete: viewToolbarState.close }
    }
    return undefined
  }, [isMobileLayout, toolbarSection, viewToolbarState])

  const showReadOnlyCardtext =
    state.assetData != null &&
    (interactionMode === 'postcardTemplateView' ||
      interactionMode === 'processedSlot')

  /** Заголовок шаблона: View и слот processed (после applyLight из Create). */
  const showTemplateTitleStrip =
    interactionMode === 'postcardTemplateView' ||
    interactionMode === 'processedSlot'

  const displayTitle =
    title.trim() || suggestCardtextTemplateTitle(plainText)

  const handleViewDelete = useCallback(() => {
    dispatch(deleteCardtextFromViewRequested())
  }, [dispatch])

  const factorySessionActive =
    state.assetData != null || state.isDraftEngaged === true

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

  /** Плейсхолдер без сессии: не cardtextView/addList, даже если на открытке есть applied. */
  const showCardtextToolbarControls =
    factorySessionActive && !hideEmptyCreateToolbar
  const showCardtextToolbarRow = showCardtextToolbarControls

  useLoadCardtextTemplatesWhenUnknown(
    cardtextTemplatesLoading,
    cardtextTemplates,
  )

  return (
    <div className={styles.cardtextContainer}>
      <div className={styles.cardtext}>
        <div className={styles.cardtextViewWrap}>
          <MobileInlineToolbarRow
            className={styles.cardtextToolbarRow}
            emptyClassName={styles.cardtextToolbarRowEmpty}
            show={showCardtextToolbarControls}
          >
            <Toolbar
              section={toolbarSection}
              groupsOverride={cardtextViewToolbarGroupsOverride}
              stateOverride={cardtextViewToolbarStateOverride}
            />
          </MobileInlineToolbarRow>
          <div className={styles.cardtextViewContent}>
            {displayTitle && showTemplateTitleStrip && (
              <>
                {forceEditingTitle ? (
                  <div
                    ref={titleStripRef}
                    className={clsx(
                      viewStyles.viewTitle,
                      viewStyles.viewTitleStrip,
                      viewStyles.viewTitleEditing,
                    )}
                  >
                    <input
                      ref={titleInputRef}
                      type="text"
                      className={viewStyles.viewTitleEditingInput}
                      value={draftTitle}
                      maxLength={CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onBlur={() => {
                        if (cardtextAssetStatus === 'inLine') cancelEditTitle()
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
                  <div
                    role="button"
                    tabIndex={0}
                    className={clsx(
                      viewStyles.viewTitle,
                      viewStyles.viewTitleStrip,
                      viewStyles.viewTitleDisplay,
                    )}
                    onClick={startEditTitle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        startEditTitle()
                      }
                    }}
                    aria-label="Edit template name"
                    title="Edit template name"
                  >
                    <span className={viewStyles.viewTitleDisplayLabel}>
                      <span className={viewStyles.viewTitleText}>
                        {displayTitle}
                      </span>
                    </span>
                    <span
                      className={viewStyles.viewTitleEditingBtn}
                      aria-hidden
                    >
                      {getToolbarIcon({ key: 'editLight' })}
                    </span>
                  </div>
                )}
              </>
            )}

            {showReadOnlyCardtext ? (
              <div className={styles.cardtextReadOnlyShell}>
                <CardtextView
                  key={id ?? 'no-template'}
                  value={value}
                  style={style}
                  titleStripEditing={forceEditingTitle}
                  onDelete={isMobileLayout ? undefined : handleViewDelete}
                />
              </div>
            ) : (
              <CardEditor titleStripEditing={forceEditingTitle} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Cardtext: React.FC<CardtextProps> = (props) => {
  const {
    activePieSide,
    cardPieEditEngaged,
    mirrorInner,
    mirrorTargetLocalId,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()

  const archiveInner = listRowInner ?? mirrorInner
  const archiveRowLocalId = listRowLocalId ?? mirrorTargetLocalId

  /** Правый режим без cardPieEdit: упрощённый текст архива, не слайс сессии левой открытки. */
  if (!cardPieEditEngaged && activePieSide === 'right' && archiveInner != null) {
    const preview = (
      <CardtextListRowPeekPreview
        key={
          archiveRowLocalId != null
            ? `archive-row-${archiveRowLocalId}`
            : 'archive-row'
        }
        inner={archiveInner}
        rowLocalId={archiveRowLocalId}
      />
    )
    return notebookTabsOuter ? (
      preview
    ) : (
      <NotebookPeekShell>{preview}</NotebookPeekShell>
    )
  }

  return <CardtextSessionEditor {...props} />
}

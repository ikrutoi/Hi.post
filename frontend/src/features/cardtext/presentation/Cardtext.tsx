import React, { useCallback } from 'react'
import clsx from 'clsx'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  createInitialCardtextContent,
  cardtextValueForReadOnlyPreview,
} from '@cardtext/domain/editor/editor.types'
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
import styles from './Cardtext.module.scss'
import viewStyles from './CardtextView/CardtextView.module.scss'
import { useAppDispatch } from '@app/hooks'
import {
  deleteCardtextFromViewRequested,
} from '@cardtext/infrastructure/state'
import { getToolbarIcon } from '@/shared/utils/icons'
import type { CardPieInnerData } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'

interface CardtextProps {
  styleLeft: number
}

/** Левый пирог + клик по cardtext в правом списке: только текст строки, без тулбара. */
const CardtextListRowPeekPreview: React.FC<{
  inner: CardPieInnerData
  rowLocalId: number | null
}> = ({ inner, rowLocalId }) => {
  const { sizeCard } = useSizeFacade()
  const ct = inner.cardtext
  const fallback = createInitialCardtextContent()
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
              styles.cardtextToolbarRowEmpty,
            )}
            aria-hidden
          />
          <div className={styles.cardtextViewContent}>
            <CardtextView
              contentKey={contentKey}
              value={value}
              style={style}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Фабрика в режиме правого списка: текст из `mirrorInner`, не из слайса `cardtext` сессии. */
const CardtextRightListMirror: React.FC = () => {
  const { sizeCard } = useSizeFacade()
  const { mirrorInner, mirrorTargetLocalId } = useRightListArchiveMini()
  const ct = mirrorInner?.cardtext
  const fallback = createInitialCardtextContent()
  const value = ct
    ? cardtextValueForReadOnlyPreview(ct)
    : fallback.value
  const style = ct?.style ?? fallback.style
  const contentKey =
    mirrorTargetLocalId != null && ct?.id != null
      ? `mirror-${mirrorTargetLocalId}-${ct.id}`
      : mirrorTargetLocalId != null
        ? `mirror-${mirrorTargetLocalId}`
        : 'mirror-pending'

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
              styles.cardtextToolbarRowEmpty,
            )}
            aria-hidden
          />
          <div className={styles.cardtextViewContent}>
            <CardtextView
              contentKey={contentKey}
              value={value}
              style={style}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const CardtextSessionEditor: React.FC<CardtextProps> = ({
  styleLeft: _styleLeft,
}) => {
  const { sizeCard } = useSizeFacade()
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
              !showCardtextToolbarControls && styles.cardtextToolbarRowEmpty,
            )}
            aria-hidden={showCardtextToolbarControls ? undefined : true}
          >
            {showCardtextToolbarControls ? (
              <Toolbar section={toolbarSection} />
            ) : null}
          </div>
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
                  onDelete={handleViewDelete}
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
    centerStripListMirrorEnabled,
    rightPieCardtextPeekNoToolbar,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()

  /** Правый режим без cardPieEdit: текст архива, без записи в слайс левой открытки. */
  if (
    centerStripListMirrorEnabled &&
    activePieSide === 'right' &&
    !cardPieEditEngaged
  ) {
    return <CardtextRightListMirror />
  }

  if (
    rightPieCardtextPeekNoToolbar &&
    listRowInner != null &&
    !cardPieEditEngaged
  ) {
    const peek = (
      <CardtextListRowPeekPreview
        key={
          listRowLocalId != null ? `peek-row-${listRowLocalId}` : 'peek-row'
        }
        inner={listRowInner}
        rowLocalId={listRowLocalId}
      />
    )
    return notebookTabsOuter ? peek : <NotebookPeekShell>{peek}</NotebookPeekShell>
  }

  return <CardtextSessionEditor {...props} />
}

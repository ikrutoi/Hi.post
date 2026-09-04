import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import {
  selectCardtextTemplatesListItems,
  selectIsCardtextListPanelOpen,
} from '@cardtext/infrastructure/selectors'
import { CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH } from '@cardtext/application/helpers'
import { useCardtextListToolbarTitleEdit } from '@cardtext/application/hooks'
import clsx from 'clsx'
import { withDisabledToolbarGroups } from '@toolbar/domain/helpers'
import { CARDTEXT_LIST_TOOLBAR } from '@toolbar/domain/types/cardtextList.types'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardtextListMobileFactoryToolbar.module.scss'

function readApplyState(raw: unknown): IconState {
  if (raw == null) return 'disabled'
  if (typeof raw === 'string') return raw as IconState
  if (typeof raw === 'object' && raw !== null && 'state' in raw) {
    return String((raw as { state: unknown }).state) as IconState
  }
  return 'disabled'
}

/**
 * listCardtext opens the list on pointerdown. The title chip can mount under
 * the same finger; swallow that ghost click, then arm.
 */
const TITLE_GESTURE_SAFETY_MS = 350

/** Mobile factory: нижний ряд — cardtextList toolbar в общем shell. */
export const CardtextListMobileFactoryLowerToolbar: React.FC = () => {
  const isOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const activeSection = useAppSelector(selectActiveSection)
  const templates = useAppSelector(selectCardtextTemplatesListItems)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCardtextListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    isOpen &&
    activeSection === 'cardtext' &&
    showMobileCardtextListFactoryChrome

  const listEmpty = (templates?.length ?? 0) === 0

  const content = useMemo(() => {
    if (!enabled) return null
    return (
      <div
        className={styles.cardtextListToolbarRow}
        data-cardtext-list-toolbar
      >
        <Toolbar
          section="cardtextList"
          groupsOverride={
            listEmpty
              ? withDisabledToolbarGroups(CARDTEXT_LIST_TOOLBAR)
              : undefined
          }
        />
      </div>
    )
  }, [enabled, listEmpty])

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory / desktop list header — applyMedium слева, заголовок. */
export const CardtextListMobileFactoryUpperToolbar: React.FC<{
  placement?: 'factory' | 'listHeader'
}> = ({ placement = 'factory' }) => {
  const dispatch = useAppDispatch()
  const templates = useAppSelector(selectCardtextTemplatesListItems)
  const listEmpty = (templates?.length ?? 0) === 0
  const {
    inputRef: titleInputRef,
    displayTitle: centralTemplateTitle,
    draftTitle,
    setDraftTitle,
    isEditing: isEditingTitle,
    isSubmitting: isSubmittingTitle,
    startEdit: startEditTitle,
    cancelEdit: cancelEditTitle,
    commitEdit: commitEditTitle,
  } = useCardtextListToolbarTitleEdit()
  const titleRef = useRef<HTMLDivElement>(null)
  const titlePointerDownRef = useRef(false)
  const [titleArmed, setTitleArmed] = useState(false)
  const applyRaw = useAppSelector((s) => s.toolbar?.cardtext?.apply)

  useLayoutEffect(() => {
    setTitleArmed(false)
    titlePointerDownRef.current = false
    let settled = false
    let safetyTimer = 0
    let fallbackTimer = 0

    const settle = () => {
      if (settled) return
      settled = true
      setTitleArmed(true)
      window.removeEventListener('pointerup', onPointerEnd, true)
      window.removeEventListener('pointercancel', onPointerEnd, true)
      window.removeEventListener('click', onClickCapture, true)
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
      if (fallbackTimer !== 0) window.clearTimeout(fallbackTimer)
    }

    const onClickCapture = (event: MouseEvent) => {
      const node = titleRef.current
      if (
        node == null ||
        !(event.target instanceof Node) ||
        !node.contains(event.target)
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      settle()
    }

    const onPointerEnd = () => {
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
      /** Do not arm while the opening finger is still down. */
      safetyTimer = window.setTimeout(settle, TITLE_GESTURE_SAFETY_MS)
    }

    window.addEventListener('pointerup', onPointerEnd, true)
    window.addEventListener('pointercancel', onPointerEnd, true)
    window.addEventListener('click', onClickCapture, true)
    /** If the opening pointer already ended before mount, still arm. */
    fallbackTimer = window.setTimeout(settle, TITLE_GESTURE_SAFETY_MS * 3)

    return () => {
      settled = true
      window.removeEventListener('pointerup', onPointerEnd, true)
      window.removeEventListener('pointercancel', onPointerEnd, true)
      window.removeEventListener('click', onClickCapture, true)
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
      if (fallbackTimer !== 0) window.clearTimeout(fallbackTimer)
    }
  }, [])
  const applyState = listEmpty ? 'disabled' : readApplyState(applyRaw)

  const applyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'cardtext',
        icons: [{ key: 'applyMedium', state: applyState }],
        status: listEmpty ? 'disabled' : 'enabled',
      },
    ]
  }, [applyState, listEmpty])

  const handleApplyAction = useCallback(
    (key: IconKey) => {
      if (key !== 'applyMedium') return
      if (listEmpty) return false
      /**
       * Keep the list selection in View: close the list without postcard Apply.
       * Final Apply stays on the View toolbar (`apply`).
       * Must intercept — saga maps applyMedium → applyLight (processed upsert).
       */
      dispatch(setCardtextListPanelOpen(false))
      return false
    },
    [dispatch, listEmpty],
  )

  return (
    <div
      className={clsx(
        styles.upperRow,
        placement === 'listHeader' && styles.upperRowListHeader,
      )}
    >
      <div className={styles.upperApply}>
        <Toolbar
          section="cardtext"
          groupsOverride={applyToolbar}
          className={toolbarStyles.toolbarAromaUpperApply}
          onActionClick={handleApplyAction}
        />
      </div>
      {centralTemplateTitle ? (
        isEditingTitle ? (
          <div
            className={clsx(styles.upperTitle, styles.upperTitleEditing)}
          >
            <input
              ref={titleInputRef}
              type="text"
              className={styles.upperTitleInput}
              value={draftTitle}
              maxLength={CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH}
              enterKeyHint="done"
              autoFocus
              disabled={isSubmittingTitle}
              aria-label="Template name"
              title="Edit template name"
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={() => {
                void commitEditTitle()
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
            />
          </div>
        ) : (
          <div
            ref={titleRef}
            role="button"
            tabIndex={titleArmed ? 0 : -1}
            className={clsx(
              styles.upperTitle,
              titleArmed && styles.upperTitleArmed,
            )}
            title="Edit template name"
            aria-label="Edit template name"
            onPointerDown={(e) => {
              if (!titleArmed) return
              if (e.pointerType === 'mouse' && e.button !== 0) return
              titlePointerDownRef.current = true
            }}
            onClick={() => {
              if (!titleArmed || !titlePointerDownRef.current) return
              titlePointerDownRef.current = false
              startEditTitle()
            }}
            onKeyDown={(e) => {
              if (!titleArmed) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                startEditTitle()
              }
            }}
          >
            {centralTemplateTitle}
          </div>
        )
      ) : null}
    </div>
  )
}

import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxSender,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import {
  selectCardtextInteractionMode,
  selectIsCardtextEditorComposerVisible,
} from '@cardtext/infrastructure/selectors'
import { isCardtextCreateComposerMode } from '@cardtext/domain/cardtextInteractionMode'
import { useMobileFactoryListChrome } from '../../application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { ArchivePeekLowerToolbar } from './ArchivePeekLowerToolbar'
import { FactoryUpperToolbar } from './FactoryUpperToolbar'
import { useMobileScenarioToolbarSnapshot } from './MobileScenarioToolbarContext'
import styles from './MobileFactoryToolbarShell.module.scss'

export const MobileFactoryToolbarShell: React.FC = () => {
  const scenarioToolbar = useMobileScenarioToolbarSnapshot()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const cardtextInteractionMode = useAppSelector(selectCardtextInteractionMode)
  const cardtextEditorComposerVisible = useAppSelector(
    selectIsCardtextEditorComposerVisible,
  )
  /** Create / edit-from-View: only the lower composer row (applyMedium / fonts / return). */
  const hideCardtextCreateUpperToolbar =
    activeSection === 'cardtext' &&
    isCardtextCreateComposerMode(cardtextInteractionMode) &&
    cardtextEditorComposerVisible
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const sessionSenderView = useAppSelector(selectSenderView)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const senderView = sandboxActive
    ? sandboxSender.currentView
    : sessionSenderView
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const {
    hideUpperToolbar,
    mobileSectionSimplifiedPeek,
    mobileArchiveSectionPeek,
    showMobileCardphotoListFactoryChrome,
    showMobileCardtextListFactoryChrome,
    showMobileAddressListFactoryChrome,
    showMobileHistoryListFactoryChrome,
    showMobileCartListFactoryChrome,
  } = useMobileFactoryListChrome()
  const { rightPieEnvelopePeekNoToolbar } = useRightListArchiveMini()

  const envelopeAddressCreateMode =
    activeSection === 'envelope' &&
    !rightPieEnvelopePeekNoToolbar &&
    (senderView === 'senderCreate' || recipientView === 'recipientCreate')

  const suppressMobileCalendarUpperRow =
    isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history')

  const showPeekEmptyToolbarShell =
    isMobileLayout &&
    mobileSectionSimplifiedPeek &&
    !envelopeAddressCreateMode &&
    !showMobileAddressListFactoryChrome

  /** Archive (cart/history) section peek: lower band with copy affordance. */
  const showArchivePeekLowerToolbar =
    isMobileLayout && mobileArchiveSectionPeek

  const showUpperContent = !hideUpperToolbar && !hideCardtextCreateUpperToolbar
  const showMobileListFactoryUpper =
    showMobileCardphotoListFactoryChrome ||
    showMobileCardtextListFactoryChrome ||
    showMobileAddressListFactoryChrome ||
    showMobileCartListFactoryChrome ||
    showMobileHistoryListFactoryChrome
  const showSectionUpperToolbar =
    showUpperContent &&
    !suppressMobileCalendarUpperRow &&
    !showMobileListFactoryUpper
  const showMobileDateCalendarNavRow =
    suppressMobileCalendarUpperRow && showUpperContent
  const showLowerRow =
    showArchivePeekLowerToolbar ||
    scenarioToolbar != null ||
    showMobileListFactoryUpper
  const showUpperRow =
    showPeekEmptyToolbarShell ||
    showSectionUpperToolbar ||
    showMobileListFactoryUpper ||
    showMobileDateCalendarNavRow
  const showShell =
    showUpperRow ||
    showLowerRow
  /** Жёлтая полоска: список корзины/истории или календарь в том же режиме. */
  const showCartYellowDivider =
    showMobileCartListFactoryChrome ||
    showMobileHistoryListFactoryChrome ||
    (showMobileDateCalendarNavRow &&
      (notebookStripTab === 'cart' || notebookStripTab === 'history'))
  /** Секции левого CardPie (сборка): разделитель цвета фона секции (не жёлтый). */
  const useAssemblySectionDivider =
    !showMobileListFactoryUpper &&
    !showPeekEmptyToolbarShell &&
    (showSectionUpperToolbar || showMobileDateCalendarNavRow)

  if (envelopeAddressCreateMode) return null
  if (!showShell) return null

  return (
    <div className={styles.shell} aria-label="Section toolbars">
      {showUpperRow ? (
        <div className={styles.rowUpper}>
          <FactoryUpperToolbar includeDateCalendarNav />
        </div>
      ) : null}
      {showUpperRow ? (
        <div
          className={clsx(
            styles.rowDivider,
            useAssemblySectionDivider && styles.rowDividerEnabled,
            showCartYellowDivider && styles.rowDividerCart,
          )}
          aria-hidden
        />
      ) : null}
      <div
        className={styles.rowLower}
        aria-hidden={!showLowerRow ? true : undefined}
      >
        {showArchivePeekLowerToolbar ? (
          <ArchivePeekLowerToolbar />
        ) : showLowerRow ? (
          scenarioToolbar
        ) : null}
      </div>
    </div>
  )
}

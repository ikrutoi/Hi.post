import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { MobileDateCalendarToolbarNav } from '@date/dateHeader/presentation/MobileDateCalendarToolbarNav'
import { useMobileScenarioToolbarSnapshot } from './MobileScenarioToolbarContext'
import styles from './MobileFactoryToolbarShell.module.scss'

export const MobileFactoryToolbarShell: React.FC = () => {
  const scenarioToolbar = useMobileScenarioToolbarSnapshot()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const cardphotoListPanelOpen = useAppSelector(selectIsListPanelOpen)
  const cardtextListPanelOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const addressListPanelOpen = senderListPanelOpen || recipientListPanelOpen
  const cardPieListPanelOpen = useAppSelector(selectIsCardPieListPanelOpen)
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const {
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
  } = useRightListArchiveMini()

  const hideUpperToolbar = useMemo(
    () =>
      rightPieCardphotoPeekNoToolbar ||
      rightPieCardtextPeekNoToolbar ||
      rightPieEnvelopePeekNoToolbar ||
      rightPieAromaPeekNoToolbar ||
      rightPieDatePeekNoToolbar ||
      cardphotoListPanelOpen ||
      cardtextListPanelOpen ||
      addressListPanelOpen ||
      cardPieListPanelOpen ||
      cartListPanelOpen,
    [
      rightPieCardphotoPeekNoToolbar,
      rightPieCardtextPeekNoToolbar,
      rightPieEnvelopePeekNoToolbar,
      rightPieAromaPeekNoToolbar,
      rightPieDatePeekNoToolbar,
      cardphotoListPanelOpen,
      cardtextListPanelOpen,
      addressListPanelOpen,
      cardPieListPanelOpen,
      cartListPanelOpen,
    ],
  )

  const envelopeAddressCreateMode =
    activeSection === 'envelope' &&
    !rightPieEnvelopePeekNoToolbar &&
    (senderView === 'senderCreate' || recipientView === 'recipientCreate')

  const suppressMobileCalendarUpperRow =
    isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history')

  const showUpperContent = !hideUpperToolbar
  const showLowerRow = scenarioToolbar != null
  const isAromaSection = activeSection === 'aroma'
  const showSectionUpperToolbar =
    showUpperContent && !isAromaSection && !suppressMobileCalendarUpperRow
  const showMobileDateCalendarNavRow =
    suppressMobileCalendarUpperRow && showUpperContent
  const showShell =
    (showSectionUpperToolbar ||
      showLowerRow ||
      showMobileDateCalendarNavRow) &&
    !(isAromaSection && !showLowerRow)
  const isMobileCalendarSection =
    isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history')
  const showDivider =
    !isMobileCalendarSection &&
    !isAromaSection
  const singleRowShell =
    !showSectionUpperToolbar &&
    !showMobileDateCalendarNavRow &&
    showLowerRow

  if (envelopeAddressCreateMode) return null
  if (!showShell) return null

  return (
    <div
      className={clsx(
        styles.shell,
        !showDivider && styles.shellNoDivider,
        singleRowShell && styles.shellSingleRow,
      )}
      aria-label="Section toolbars"
    >
      {showSectionUpperToolbar ? (
        <div className={styles.rowUpper}>
          <CardSectionToolbar />
        </div>
      ) : showMobileDateCalendarNavRow ? (
        <div className={styles.rowUpper}>
          <MobileDateCalendarToolbarNav />
        </div>
      ) : null}
      {showDivider ? <div className={styles.rowDivider} aria-hidden /> : null}
      <div
        className={styles.rowLower}
        aria-hidden={!showLowerRow ? true : undefined}
      >
        {showLowerRow ? scenarioToolbar : null}
      </div>
    </div>
  )
}

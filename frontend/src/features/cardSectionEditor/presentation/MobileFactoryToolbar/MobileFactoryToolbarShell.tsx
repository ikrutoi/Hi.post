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
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
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
      cardPieListPanelOpen,
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
    ],
  )

  const envelopeAddressCreateMode =
    activeSection === 'envelope' &&
    !rightPieEnvelopePeekNoToolbar &&
    (senderView === 'senderCreate' || recipientView === 'recipientCreate')

  const suppressMobileCalendarUpperRow =
    isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history')

  const showUpperRow = !hideUpperToolbar && !suppressMobileCalendarUpperRow
  const showLowerRow = scenarioToolbar != null

  if (envelopeAddressCreateMode) return null
  if (!showUpperRow && !showLowerRow) return null

  return (
    <div
      className={clsx(
        styles.shell,
        !showUpperRow && showLowerRow && styles.shellSingleRow,
      )}
      aria-label="Section toolbars"
    >
      {showUpperRow ? (
        <div className={styles.rowUpper}>
          <CardSectionToolbar />
        </div>
      ) : null}
      {showUpperRow && showLowerRow ? (
        <div className={styles.rowDivider} aria-hidden />
      ) : null}
      {showLowerRow ? (
        <div className={styles.rowLower}>{scenarioToolbar}</div>
      ) : null}
    </div>
  )
}

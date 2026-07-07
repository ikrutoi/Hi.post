import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileFactoryListChrome } from '../../application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { CardphotoListMobileFactoryUpperToolbar } from '@cardphoto/presentation/CardphotoListMobileFactoryToolbar'
import { CardtextListMobileFactoryUpperToolbar } from '@cardtext/presentation/CardtextListMobileFactoryToolbar'
import { AddressListMobileFactoryUpperToolbar } from '@envelope/addressBook/presentation/AddressListMobileFactoryToolbar'
import { HistoryListMobileFactoryUpperToolbar } from '@date/presentation/HistoryListMobileFactoryToolbar'
import { CartListMobileFactoryUpperToolbar } from '@cart/presentation/CartListMobileFactoryToolbar'
import { MobileDateCalendarToolbarNav } from '@date/dateHeader/presentation/MobileDateCalendarToolbarNav'
import { useMobileScenarioToolbarSnapshot } from './MobileScenarioToolbarContext'
import styles from './MobileFactoryToolbarShell.module.scss'

export const MobileFactoryToolbarShell: React.FC = () => {
  const scenarioToolbar = useMobileScenarioToolbarSnapshot()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const { hideUpperToolbar, showMobileCardphotoListFactoryChrome, showMobileCardtextListFactoryChrome, showMobileAddressListFactoryChrome, showMobileHistoryListFactoryChrome, showMobileCartListFactoryChrome } =
    useMobileFactoryListChrome()
  const { rightPieEnvelopePeekNoToolbar } = useRightListArchiveMini()

  const envelopeAddressCreateMode =
    activeSection === 'envelope' &&
    !rightPieEnvelopePeekNoToolbar &&
    (senderView === 'senderCreate' || recipientView === 'recipientCreate')

  const suppressMobileCalendarUpperRow =
    isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history')

  const showUpperContent = !hideUpperToolbar
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
    scenarioToolbar != null || showMobileListFactoryUpper
  const showShell =
    showSectionUpperToolbar ||
    showMobileListFactoryUpper ||
    showLowerRow ||
    showMobileDateCalendarNavRow
  const hideToolbarDivider =
    isMobileLayout && activeSection === 'date'

  if (envelopeAddressCreateMode) return null
  if (!showShell) return null

  return (
    <div className={styles.shell} aria-label="Section toolbars">
      <div className={styles.rowUpper}>
        {showMobileCardphotoListFactoryChrome ? (
          <CardphotoListMobileFactoryUpperToolbar />
        ) : showMobileCardtextListFactoryChrome ? (
          <CardtextListMobileFactoryUpperToolbar />
        ) : showMobileAddressListFactoryChrome ? (
          <AddressListMobileFactoryUpperToolbar />
        ) : showMobileCartListFactoryChrome ? (
          <CartListMobileFactoryUpperToolbar />
        ) : showMobileHistoryListFactoryChrome ? (
          <HistoryListMobileFactoryUpperToolbar />
        ) : showSectionUpperToolbar ? (
          <CardSectionToolbar />
        ) : showMobileDateCalendarNavRow ? (
          <MobileDateCalendarToolbarNav />
        ) : null}
      </div>
      <div
        className={clsx(
          styles.rowDivider,
          hideToolbarDivider && styles.rowDividerHidden,
          (showMobileHistoryListFactoryChrome ||
            showMobileCartListFactoryChrome) &&
            styles.rowDividerCart,
        )}
        aria-hidden
      />
      <div
        className={styles.rowLower}
        aria-hidden={!showLowerRow ? true : undefined}
      >
        {showLowerRow ? scenarioToolbar : null}
      </div>
    </div>
  )
}

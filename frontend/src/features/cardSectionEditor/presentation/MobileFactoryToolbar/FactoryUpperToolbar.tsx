import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxSender,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileFactoryListChrome } from '../../application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { CardphotoListMobileFactoryUpperToolbar } from '@cardphoto/presentation/CardphotoListMobileFactoryToolbar'
import { CardtextListMobileFactoryUpperToolbar } from '@cardtext/presentation/CardtextListMobileFactoryToolbar'
import { AddressListMobileFactoryUpperToolbar } from '@envelope/addressBook/presentation/AddressListMobileFactoryToolbar'
import { HistoryListMobileFactoryUpperToolbar } from '@date/presentation/HistoryListMobileFactoryToolbar'
import { CartListMobileFactoryUpperToolbar } from '@cart/presentation/CartListMobileFactoryToolbar'
import { EnvelopeInnerToolbar } from '@envelope/presentation/EnvelopeInnerToolbar'
import { ArchivePeekUpperToolbar } from './ArchivePeekUpperToolbar'
import { MobileDateCalendarToolbarNav } from '@date/dateHeader/presentation/MobileDateCalendarToolbarNav'
import styles from './FactoryUpperToolbar.module.scss'

/**
 * Shared upper-row picker: peek → photo/text/address/cart/history lists →
 * section toolbar (or date calendar nav on mobile).
 */
export const FactoryUpperToolbar: React.FC<{
  includeDateCalendarNav?: boolean
}> = ({ includeDateCalendarNav = false }) => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
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
    mobileSectionSimplifiedPeek,
    cartEnvelopeInnerPeekToolbar,
    showCardphotoListFactoryUpperToolbar,
    showCardtextListFactoryUpperToolbar,
    showAddressListFactoryUpperToolbar,
    showCartListFactoryUpperToolbar,
    showHistoryListFactoryUpperToolbar,
  } = useMobileFactoryListChrome()
  const { rightPieEnvelopePeekNoToolbar } = useRightListArchiveMini()

  const envelopeAddressCreateMode =
    activeSection === 'envelope' &&
    !rightPieEnvelopePeekNoToolbar &&
    (senderView === 'senderCreate' || recipientView === 'recipientCreate')

  const showPeekEmptyToolbarShell =
    mobileSectionSimplifiedPeek &&
    !envelopeAddressCreateMode &&
    !showAddressListFactoryUpperToolbar

  const suppressCalendarUpperRow =
    includeDateCalendarNav &&
    isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history')

  let content: React.ReactNode
  if (showPeekEmptyToolbarShell) {
    content = cartEnvelopeInnerPeekToolbar ? (
      <EnvelopeInnerToolbar />
    ) : (
      <ArchivePeekUpperToolbar />
    )
  } else if (isMobileLayout && showCardphotoListFactoryUpperToolbar) {
    content = <CardphotoListMobileFactoryUpperToolbar />
  } else if (isMobileLayout && showCardtextListFactoryUpperToolbar) {
    content = <CardtextListMobileFactoryUpperToolbar />
  } else if (isMobileLayout && showAddressListFactoryUpperToolbar) {
    content = <AddressListMobileFactoryUpperToolbar />
  } else if (isMobileLayout && showCartListFactoryUpperToolbar) {
    content = <CartListMobileFactoryUpperToolbar />
  } else if (isMobileLayout && showHistoryListFactoryUpperToolbar) {
    content = <HistoryListMobileFactoryUpperToolbar />
  } else if (suppressCalendarUpperRow) {
    content = <MobileDateCalendarToolbarNav />
  } else {
    content = <CardSectionToolbar />
  }

  return <div className={styles.root}>{content}</div>
}

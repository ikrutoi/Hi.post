import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectActiveSection } from '@layout/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { useMobileScenarioToolbarContext } from './MobileScenarioToolbarContext'
import styles from './MobileFactoryToolbarShell.module.scss'

export const MobileFactoryToolbarShell: React.FC = () => {
  const ctx = useMobileScenarioToolbarContext()
  const activeSection = useAppSelector(selectActiveSection)
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
      cardPieListPanelOpen,
    [
      rightPieCardphotoPeekNoToolbar,
      rightPieCardtextPeekNoToolbar,
      rightPieEnvelopePeekNoToolbar,
      rightPieAromaPeekNoToolbar,
      rightPieDatePeekNoToolbar,
      cardPieListPanelOpen,
    ],
  )

  const envelopeAddressCreateMode =
    activeSection === 'envelope' &&
    !rightPieEnvelopePeekNoToolbar &&
    (senderView === 'senderCreate' || recipientView === 'recipientCreate')

  if (envelopeAddressCreateMode) return null

  return (
    <div className={styles.shell} aria-label="Section toolbars">
      <div className={styles.rowUpper} aria-hidden={hideUpperToolbar ? true : undefined}>
        {!hideUpperToolbar ? <CardSectionToolbar /> : null}
      </div>
      <div className={styles.rowDivider} aria-hidden />
      <div className={styles.rowLower}>{ctx?.scenarioToolbar ?? null}</div>
    </div>
  )
}

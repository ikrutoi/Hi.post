import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

/**
 * Согласованные флаги mobile factory: список шаблонов и скрытие верхнего toolbar.
 * Списки секций «запоминают» open в slice; в UI показываем только для activeSection.
 */
export function useMobileFactoryListChrome() {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const cardphotoListPanelOpen = useAppSelector(selectIsListPanelOpen)
  const cardtextListPanelOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const addressListPanelOpen = senderListPanelOpen || recipientListPanelOpen
  const cardPieListPanelOpen = useAppSelector(selectIsCardPieListPanelOpen)
  const {
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
  } = useRightListArchiveMini()

  const mobileFactoryChromePeek =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar

  const mobileDateListChromePeek =
    mobileFactoryChromePeek || rightPieDatePeekNoToolbar

  const showMobileTemplateList = useMemo(() => {
    if (!isMobileLayout) return false
    if (cartListPanelOpen && !mobileDateListChromePeek) return true
    if (historyListPanelOpen && !mobileDateListChromePeek) return true
    if (mobileFactoryChromePeek) return false
    if (
      activeSection === 'cardphoto' &&
      cardphotoListPanelOpen &&
      !rightPieCardphotoPeekNoToolbar
    ) {
      return true
    }
    if (
      activeSection === 'cardtext' &&
      cardtextListPanelOpen &&
      !rightPieCardtextPeekNoToolbar
    ) {
      return true
    }
    if (
      activeSection === 'envelope' &&
      addressListPanelOpen &&
      !rightPieEnvelopePeekNoToolbar
    ) {
      return true
    }
    return false
  }, [
    isMobileLayout,
    mobileFactoryChromePeek,
    mobileDateListChromePeek,
    cartListPanelOpen,
    historyListPanelOpen,
    activeSection,
    cardphotoListPanelOpen,
    cardtextListPanelOpen,
    addressListPanelOpen,
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
  ])

  const hideUpperToolbar = useMemo(() => {
    if (!isMobileLayout) return false
    if (
      rightPieCardphotoPeekNoToolbar ||
      rightPieCardtextPeekNoToolbar ||
      rightPieEnvelopePeekNoToolbar ||
      rightPieAromaPeekNoToolbar ||
      rightPieDatePeekNoToolbar
    ) {
      return true
    }
    if (showMobileTemplateList) return true
    if (activeSection === 'date' && cardPieListPanelOpen) return true
    return false
  }, [
    isMobileLayout,
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
    showMobileTemplateList,
    activeSection,
    cardPieListPanelOpen,
  ])

  return {
    showMobileTemplateList,
    hideUpperToolbar,
    mobileFactoryChromePeek,
    mobileDateListChromePeek,
  }
}

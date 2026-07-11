import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import {
  selectCartCalendarDatePickMode,
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
} from '@date/calendar/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
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
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const {
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
    cardPieEditEngaged,
  } = useRightListArchiveMini()

  const mobileArchiveSectionPeek =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar ||
    rightPieDatePeekNoToolbar

  const mobileFactoryChromePeek =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar

  /**
   * Скрыть список корзины/истории: peek секции редактора или выбор новой даты (cartBlocked → dateEdit).
   */
  const mobileDateListChromePeek =
    mobileArchiveSectionPeek || cartCalendarDatePickMode

  const showMobileSectionTemplateList = useMemo(() => {
    if (!isMobileLayout) return false
    if (mobileArchiveSectionPeek) return false
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
    mobileArchiveSectionPeek,
    activeSection,
    cardphotoListPanelOpen,
    cardtextListPanelOpen,
    addressListPanelOpen,
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
  ])

  const showMobileTemplateList = useMemo(() => {
    if (!isMobileLayout) return false
    if (cardPieEditEngaged) return false
    if (cartListPanelOpen && !mobileDateListChromePeek) return true
    if (historyListPanelOpen && !mobileDateListChromePeek) return true
    if (mobileArchiveSectionPeek) return false
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
    cardPieEditEngaged,
    mobileDateListChromePeek,
    cartListPanelOpen,
    historyListPanelOpen,
    activeSection,
    cardphotoListPanelOpen,
    cardtextListPanelOpen,
    addressListPanelOpen,
    mobileArchiveSectionPeek,
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
  ])

  const showMobileHistoryListFactoryChrome = useMemo(
    () =>
      isMobileLayout &&
      historyListPanelOpen &&
      !mobileDateListChromePeek,
    [isMobileLayout, historyListPanelOpen, mobileDateListChromePeek],
  )

  const showMobileCartListFactoryChrome = useMemo(
    () =>
      isMobileLayout &&
      cartListPanelOpen &&
      !mobileDateListChromePeek &&
      !cardPieEditEngaged,
    [isMobileLayout, cartListPanelOpen, mobileDateListChromePeek, cardPieEditEngaged],
  )

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
    if (
      showMobileTemplateList &&
      !showMobileSectionTemplateList &&
      !showMobileHistoryListFactoryChrome &&
      !showMobileCartListFactoryChrome
    ) {
      return true
    }
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
    showMobileSectionTemplateList,
    showMobileHistoryListFactoryChrome,
    showMobileCartListFactoryChrome,
    activeSection,
    cardPieListPanelOpen,
  ])

  const showMobileCardphotoListFactoryChrome = useMemo(
    () =>
      showMobileSectionTemplateList &&
      activeSection === 'cardphoto' &&
      cardphotoListPanelOpen &&
      !rightPieCardphotoPeekNoToolbar,
    [
      showMobileSectionTemplateList,
      activeSection,
      cardphotoListPanelOpen,
      rightPieCardphotoPeekNoToolbar,
    ],
  )

  const showMobileCardtextListFactoryChrome = useMemo(
    () =>
      showMobileSectionTemplateList &&
      activeSection === 'cardtext' &&
      cardtextListPanelOpen &&
      !rightPieCardtextPeekNoToolbar,
    [
      showMobileSectionTemplateList,
      activeSection,
      cardtextListPanelOpen,
      rightPieCardtextPeekNoToolbar,
    ],
  )

  const showMobileAddressListFactoryChrome = useMemo(
    () =>
      showMobileSectionTemplateList &&
      activeSection === 'envelope' &&
      addressListPanelOpen &&
      !rightPieEnvelopePeekNoToolbar,
    [
      showMobileSectionTemplateList,
      activeSection,
      addressListPanelOpen,
      rightPieEnvelopePeekNoToolbar,
    ],
  )

  const showMobileTemplateListInCentralZone = useMemo(
    () =>
      showMobileSectionTemplateList ||
      showMobileHistoryListFactoryChrome ||
      showMobileCartListFactoryChrome,
    [
      showMobileSectionTemplateList,
      showMobileHistoryListFactoryChrome,
      showMobileCartListFactoryChrome,
    ],
  )

  return {
    showMobileTemplateList,
    showMobileSectionTemplateList,
    showMobileTemplateListInCentralZone,
    showMobileCardphotoListFactoryChrome,
    showMobileCardtextListFactoryChrome,
    showMobileAddressListFactoryChrome,
    showMobileHistoryListFactoryChrome,
    showMobileCartListFactoryChrome,
    hideUpperToolbar,
    mobileFactoryChromePeek,
    mobileDateListChromePeek,
    mobileArchiveSectionPeek,
    cardPieEditEngaged,
  }
}

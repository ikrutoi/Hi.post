import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectIsListPanelOpen,
  selectCardphotoIsComplete,
  selectCardphotoAssetData,
  selectCardphotoAppliedData,
} from '@cardphoto/infrastructure/selectors'
import {
  selectIsCardtextListPanelOpen,
  selectCardtextInteractionMode,
  selectCardtextIsComplete,
} from '@cardtext/infrastructure/selectors'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import {
  selectRecipientApplied,
  selectRecipientView,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectSenderApplied,
  selectSenderView,
} from '@envelope/sender/infrastructure/selectors'
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
  const cardtextInteractionMode = useAppSelector(selectCardtextInteractionMode)
  const cardtextIsComplete = useAppSelector(selectCardtextIsComplete)
  const cardphotoIsComplete = useAppSelector(selectCardphotoIsComplete)
  const cardphotoAssetData = useAppSelector(selectCardphotoAssetData)
  const cardphotoAppliedData = useAppSelector(selectCardphotoAppliedData)
  const recipientAppliedIds = useAppSelector(selectRecipientApplied)
  const recipientView = useAppSelector(selectRecipientView)
  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const senderView = useAppSelector(selectSenderView)
  const {
    activePieSide,
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

  /**
   * Сборная (левый pie): applied cardtext на открытке → упрощённый peek chrome.
   * postcardEdit снимает applied → обычный cardtextView.
   */
  const assemblyCardtextSimplifiedPeek =
    isMobileLayout &&
    activeSection === 'cardtext' &&
    activePieSide === 'left' &&
    !cardPieEditEngaged &&
    !mobileArchiveSectionPeek &&
    cardtextIsComplete &&
    (cardtextInteractionMode === 'postcardTemplateView' ||
      cardtextInteractionMode === 'processedSlot')

  /**
   * Сборная (левый pie): applied cardphoto в слоте → упрощённый peek (только postcardEdit).
   */
  const cardphotoAssetMatchesApplied =
    !!cardphotoAssetData?.id &&
    !!cardphotoAppliedData?.id &&
    cardphotoAssetData.id === cardphotoAppliedData.id

  const assemblyCardphotoSimplifiedPeek =
    isMobileLayout &&
    activeSection === 'cardphoto' &&
    activePieSide === 'left' &&
    !cardPieEditEngaged &&
    !mobileArchiveSectionPeek &&
    cardphotoIsComplete &&
    cardphotoAssetMatchesApplied

  /**
   * Сборная: после Apply recipient — упрощённый адрес + postcardEdit вместо recipients-тулбара.
   * Не входит в assemblySectionSimplifiedPeek: второй слот тулбара остаётся.
   */
  const assemblyRecipientSimplifiedPeek =
    isMobileLayout &&
    activeSection === 'envelope' &&
    activePieSide === 'left' &&
    !cardPieEditEngaged &&
    !mobileArchiveSectionPeek &&
    recipientView !== 'recipientCreate' &&
    recipientAppliedIds.length > 0

  /**
   * Сборная: после Apply sender — упрощённый адрес + postcardEdit вместо sender-тулбара.
   */
  const assemblySenderSimplifiedPeek =
    isMobileLayout &&
    activeSection === 'envelope' &&
    activePieSide === 'left' &&
    !cardPieEditEngaged &&
    !mobileArchiveSectionPeek &&
    senderView !== 'senderCreate' &&
    senderAppliedIds.length > 0

  const assemblySectionSimplifiedPeek =
    assemblyCardtextSimplifiedPeek || assemblyCardphotoSimplifiedPeek

  const mobileSectionSimplifiedPeek =
    mobileArchiveSectionPeek || assemblySectionSimplifiedPeek

  const mobileFactoryChromePeek =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar

  /**
   * Скрыть список корзины/истории: peek секции редактора или выбор новой даты (cartBlocked → dateEdit).
   */
  const mobileDateListChromePeek =
    mobileSectionSimplifiedPeek || cartCalendarDatePickMode

  const showMobileSectionTemplateList = useMemo(() => {
    if (!isMobileLayout) return false
    if (mobileSectionSimplifiedPeek) return false
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
    mobileSectionSimplifiedPeek,
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
    /** Списки корзины/истории выше режима section-edit. */
    if (cartListPanelOpen && !mobileDateListChromePeek) return true
    if (historyListPanelOpen && !mobileDateListChromePeek) return true
    if (cardPieEditEngaged) return false
    if (mobileSectionSimplifiedPeek) return false
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
    mobileSectionSimplifiedPeek,
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
      !mobileDateListChromePeek,
    [isMobileLayout, cartListPanelOpen, mobileDateListChromePeek],
  )

  const hideUpperToolbar = useMemo(() => {
    if (!isMobileLayout) return false
    if (mobileSectionSimplifiedPeek) {
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
    mobileSectionSimplifiedPeek,
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
    mobileSectionSimplifiedPeek,
    assemblyCardtextSimplifiedPeek,
    assemblyCardphotoSimplifiedPeek,
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    assemblySectionSimplifiedPeek,
    cardPieEditEngaged,
  }
}

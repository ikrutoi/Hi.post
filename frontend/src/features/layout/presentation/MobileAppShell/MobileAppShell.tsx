import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import {
  openCardphotoFromMiniStripRequested,
  pulseListCardphotoBadge,
  setCardphotoListPanelOpen,
} from '@cardphoto/infrastructure/state'
import {
  selectIsListPanelOpen,
  selectCardphotoAssetData,
  selectCardphotoAssetDisplayPreviewUrl,
  selectCardphotoIsComplete,
  selectCardphotoAppliedData,
} from '@cardphoto/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import {
  selectCartListPanelOpen,
  selectCartListSelectedLocalId,
  selectActiveCartPostcardCount,
  selectBlockedCartPostcardCount,
  selectCartItems,
} from '@cart/infrastructure/selectors'
import { CartHeaderTotal } from '@cart/presentation/CartHeaderTotal'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  buildCartArchiveToggleCommands,
  buildHistoryArchiveToggleCommands,
  resolveCartArchiveViewMode,
  resolveHistoryArchiveViewMode,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { isCartOwnedNotebookStrip } from '@date/calendar/application/logic/calendarStripSection'
import {
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import {
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectHistoryListSelectedLocalId,
  selectNotebookStripTab,
  selectCartCalendarDatePickMode,
  selectLastCartArchiveView,
  selectLastHistoryArchiveView,
} from '@date/calendar/infrastructure/selectors'
import {
  setCardtextListPanelOpen,
  pulseListCardtextBadge,
} from '@cardtext/infrastructure/state'
import {
  selectIsCardtextListPanelOpen,
  selectCardtextId,
  selectCardtextSessionData,
  selectCardtextAssetMatchesApplied,
  selectCardtextViewInQuickList,
  selectCardtextInteractionMode,
  selectIsCardtextEditorComposerVisible,
  selectIsDraftFocus,
} from '@cardtext/infrastructure/selectors'
import {
  cardtextHasRenderableContent,
  cardtextValueForReadOnlyPreview,
} from '@cardtext/domain/editor/editor.types'
import {
  CARDTEXT_CREATE_FIELD_FONT_SCALE,
  CARDTEXT_CREATE_FIELD_FONT_SCALE_MIN,
} from '@cardtext/domain/types'
import {
  isCardtextCreateComposerMode,
  openCardtextEditorFromView,
} from '@cardtext/application/helpers'
import { CardtextView } from '@cardtext/presentation/CardtextView/CardtextView'
import {
  clearAddressListPreviewSnapshot,
  clearRecipientsFormPreviewId,
  closeAddressList,
  requestClearMobileAddressFocus,
} from '@envelope/infrastructure/state'
import {
  selectRecipientListPanelOpen,
  selectRecipientListPendingIds,
  selectRecipientsFormPreviewId,
  selectSenderListPanelOpen,
  selectSenderSelectedId,
} from '@envelope/infrastructure/selectors'
import {
  selectRecipientEntriesState,
  selectRecipientView,
} from '@envelope/recipient/infrastructure/selectors'
import {
  setRecipientViewDraft,
  setRecipientViewId,
} from '@envelope/recipient/infrastructure/state'
import {
  selectSenderEntriesState,
} from '@envelope/sender/infrastructure/selectors'
import { setSenderViewId } from '@envelope/sender/infrastructure/state'
import { formatAddressPreviewLines } from '@envelope/addressBook/presentation/addressSummaryLines'
import { listStatusIsInQuickAddressBook } from '@envelope/domain/helpers'
import { clearViewAroma } from '@aroma/infrastructure/state'
import { selectViewAroma } from '@aroma/infrastructure/selectors'
import { useMobileAromaPreviewGate } from '@aroma/application/hooks'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import { toolbarAction } from '@toolbar/application/helpers'
import { dispatchCardPieToolbarIconState } from '@toolbar/application/syncCardPieToolbarIcons'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { AddressFields, CardSection, IconKey } from '@shared/config/constants'
import { selectUserLoginPanelOpen } from '@features/auth/infrastructure/selectors/authSelectors'
import { MarkStampYearDevProvider } from '@envelope/application/MarkStampYearDevContext'
import { IconCardPie, IconCart, IconHistoryV2, IconLogo, IconSectionMenuCardtext, IconSectionMenuDate, IconSectionMenuEnvelopeV2 } from '@shared/ui/icons'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { useEditorPieAddCartHandler } from '@features/cardPie/application/hooks/useEditorPieAddCartHandler'
import { useMobileCentralArchivePieGate } from '@features/cardPie/application/hooks/useMobileCentralArchivePieGate'
import { MobileCardPieGutterMinis } from './MobileCardPieGutterMinis'
import { MobileDateListSlotActionsProvider } from './MobileDateListSlotActionsContext'
import { useMobilePlanCardPies } from './useMobilePlanCardPies'
import { CardPieLeftSlot } from '@features/cardPie/presentation/CardPieLeftSlot'
import { EditorPieListCardPieBadgeSync } from '@features/cardPie/presentation/EditorPieListCardPieBadgeSync'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { DateToolbarListDateBadgeSync } from '@date/presentation/DateToolbarListDateBadgeSync'
import { RightSidebarHistoryBadgeSync } from '@toolbar/presentation/RightSidebarHistoryBadgeSync'
import { CalendarModeToolbarBadgesSync } from '@toolbar/presentation/CalendarModeToolbarBadgesSync'
import { UserLoginRightSlot } from '@features/auth/presentation/UserLoginRightSlot'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useDateStripSectionForNotebookTabs } from '@date/presentation/useDateStripSectionForNotebookTabs'
import { useMobileVisualViewport } from '@layout/application/hooks/useMobileVisualViewport'
import { useMobileArchiveSlotSecondClickHint } from '@layout/application/hooks/useMobileArchiveSlotSecondClickHint'
import type { MobileAppShellProps } from './mobileAppShell.types'
import styles from './MobileAppShell.module.scss'

/**
 * Template list preview beside the pie: favorite on top, secondary action below
 * (cardphoto / cardtext / address).
 */
const MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favorite', state: 'enabled' },
      { key: 'empty', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favoriteFilled', state: 'active' },
      { key: 'empty', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE = {
  favorite: { state: 'enabled' as const },
}

const MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE = {
  favoriteFilled: { state: 'active' as const },
}

const MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favorite', state: 'enabled' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favoriteFilled', state: 'active' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE = {
  favorite: { state: 'enabled' as const },
  edit: { state: 'enabled' as const },
}

const MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE = {
  favoriteFilled: { state: 'active' as const },
  edit: { state: 'enabled' as const },
}

const MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favorite', state: 'enabled' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favoriteFilled', state: 'active' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE = {
  favorite: { state: 'enabled' as const },
  edit: { state: 'enabled' as const },
}

const MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE = {
  favoriteFilled: { state: 'active' as const },
  edit: { state: 'enabled' as const },
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  formRef,
  sizeCard,
  onAppClick,
  pinActiveTab,
  activePieSide,
  showTopCardStripFullSpan,
  onBeforeLeftPieInteraction,
  onLeftPieCenterClick,
  envelopeAddressCreateRole = null,
  cardPieListPanelOpen,
  onEditorPieToolbarAction,
  onPostcardPieCartToolbarAction,
  postcardPieCartToolbarStateOverride,
  onCartListSelectEntry,
  onCartListDateEditEntry,
  onHistoryListSelectEntry,
  onRightListPieSectorClick,
  onArchivePieCenterClick,
  rightPieCenterAffordance = null,
}) => {
  const dispatch = useAppDispatch()
  const shellRef = useRef<HTMLDivElement>(null)
  const userLoginPanelOpen = useAppSelector(selectUserLoginPanelOpen)
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const cartListSelectedLocalId = useAppSelector(selectCartListSelectedLocalId)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const historyListSelectedLocalId = useAppSelector(selectHistoryListSelectedLocalId)
  const cartItems = useAppSelector(selectCartItems)
  const notebookStripSection = useDateStripSectionForNotebookTabs()
  const activeSection = useAppSelector(selectActiveSection)
  const cardphotoListPanelOpen = useAppSelector(selectIsListPanelOpen)
  const cardphotoAssetData = useAppSelector(selectCardphotoAssetData)
  const cardphotoAssetPreviewUrl = useAppSelector(
    selectCardphotoAssetDisplayPreviewUrl,
  )
  const cardphotoIsComplete = useAppSelector(selectCardphotoIsComplete)
  const cardphotoAppliedId = useAppSelector(selectCardphotoAppliedData)?.id ?? null
  const cardtextListPanelOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const cardtextSession = useAppSelector(selectCardtextSessionData)
  const cardtextTemplateId = useAppSelector(selectCardtextId)
  const cardtextAssetMatchesApplied = useAppSelector(
    selectCardtextAssetMatchesApplied,
  )
  const cardtextViewInQuickList = useAppSelector(selectCardtextViewInQuickList)
  const cardtextInteractionMode = useAppSelector(selectCardtextInteractionMode)
  const cardtextDraftEngaged = useAppSelector(
    (s) => s.cardtext.isDraftEngaged === true,
  )
  const cardtextEditorComposerVisible = useAppSelector(
    selectIsCardtextEditorComposerVisible,
  )
  const cardtextDraftFocus = useAppSelector(selectIsDraftFocus)
  /**
   * Envelope-like fullscreen create chrome (card + app-inner surround).
   * createEmpty and edit-from-View; editTemplate keeps the normal section frame.
   */
  const cardtextCreateChromeActive =
    activeSection === 'cardtext' &&
    isCardtextCreateComposerMode(cardtextInteractionMode) &&
    (cardtextEditorComposerVisible || cardtextDraftEngaged)
  /** Hide app header while typing in any cardtext composer (create or edit). */
  const cardtextComposeHideAppHeader =
    cardtextCreateChromeActive ||
    (activeSection === 'cardtext' &&
      (cardtextEditorComposerVisible || cardtextDraftFocus))
  useMobileVisualViewport(shellRef, {
    pinTop:
      envelopeAddressCreateRole != null || cardtextComposeHideAppHeader,
  })
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderSelectedId = useAppSelector(selectSenderSelectedId)
  const recipientListPendingIds = useAppSelector(selectRecipientListPendingIds)
  const recipientsFormPreviewId = useAppSelector(selectRecipientsFormPreviewId)
  const recipientView = useAppSelector(selectRecipientView)
  const senderEntries = useAppSelector(selectSenderEntriesState)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const viewAroma = useAppSelector(selectViewAroma)
  const activeCartPostcardCount = useAppSelector(selectActiveCartPostcardCount)
  const blockedCartPostcardCount = useAppSelector(selectBlockedCartPostcardCount)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const cartSlotVisualMode = useMemo(() => {
    if (activeCartPostcardCount > 0 && blockedCartPostcardCount > 0) {
      return 'mixed' as const
    }
    if (activeCartPostcardCount === 0 && blockedCartPostcardCount > 0) {
      return 'blockedOnly' as const
    }
    return 'activeOnly' as const
  }, [activeCartPostcardCount, blockedCartPostcardCount])

  /** Mobile: CardPie list overlay только на вкладке «Дата»; сам CardPie всегда виден для переключения секций. */
  const showMobileCardPieListInFactory =
    notebookStripSection === 'date' && cardPieListPanelOpen

  useEffect(() => {
    if (!showMobileCardPieListInFactory && cardPieListPanelOpen) {
      dispatch(setCardPieListPanelOpen(false))
      dispatchCardPieToolbarIconState(dispatch, false)
    }
  }, [showMobileCardPieListInFactory, cardPieListPanelOpen, dispatch])

  useEffect(() => {
    if (activeSection === 'envelope') return
    if (recipientsFormPreviewId == null) return
    dispatch(clearRecipientsFormPreviewId())
  }, [activeSection, dispatch, recipientsFormPreviewId])

  useEffect(() => {
    if (
      activeSection != null &&
      activeSection !== 'date' &&
      cardPieListPanelOpen
    ) {
      dispatch(setCardPieListPanelOpen(false))
      dispatchCardPieToolbarIconState(dispatch, false)
    }
  }, [activeSection, cardPieListPanelOpen, dispatch])

  /** Кнопка корзины/истории у CardPie: список открыт — только archive pie или пусто. */
  const mobileListArchiveSlotActive =
    cartListPanelOpen || historyListPanelOpen

  const {
    planPies,
    selectedPlanPie,
    selectedPlanPieId,
    assemblyOverviewPie,
    selectPlanPie,
    cyclePlanPie,
  } = useMobilePlanCardPies()
  const {
    mirrorTargetLocalId,
    mirrorListArchiveSource,
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  } = useRightListArchiveMini()

  const clearMobileFactoryPeek = useCallback(() => {
    clearRightPieCardphotoPeek()
    clearRightPieCardtextPeek()
    clearRightPieEnvelopePeek()
    clearRightPieAromaPeek()
    clearRightPieDatePeek()
  }, [
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  ])

  const mobileFactoryChromePeek =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar ||
    rightPieDatePeekNoToolbar

  type MobileFactoryListOverlayKey = 'cardPie'

  /** Peek секции: список не перекрывает фабрику, кнопка списка остаётся включённой. */
  const mobileFactoryListOverlayKey = useMemo((): MobileFactoryListOverlayKey | null => {
    if (mobileFactoryChromePeek) return null
    if (showMobileCardPieListInFactory) return 'cardPie'
    return null
  }, [
    mobileFactoryChromePeek,
    showMobileCardPieListInFactory,
  ])

  const canCyclePlanPies = planPies.length > 1
  /**
   * Mobile: один центральный CardPie вместо пары left/right на десктопе.
   * При открытом списке корзины/истории — archive pie выбранной строки;
   * без выбора — пустой белый placeholder вместо archive CardPie.
   * После закрытия списка archive может оставаться, пока activePieSide === 'right'.
   */
  const mobileCentralArchivePreview = useMemo((): {
    localId: number
    source: 'cart' | 'history'
  } | null => {
    if (cartListPanelOpen) {
      return cartListSelectedLocalId != null
        ? { localId: cartListSelectedLocalId, source: 'cart' }
        : null
    }
    if (historyListPanelOpen) {
      return historyListSelectedLocalId != null
        ? { localId: historyListSelectedLocalId, source: 'history' }
        : null
    }
    if (isCartOwnedNotebookStrip(notebookStripSection)) {
      return cartListSelectedLocalId != null
        ? { localId: cartListSelectedLocalId, source: 'cart' }
        : null
    }
    if (notebookStripSection === 'history') {
      return historyListSelectedLocalId != null
        ? { localId: historyListSelectedLocalId, source: 'history' }
        : null
    }
    if (
      activePieSide === 'right' &&
      mirrorTargetLocalId != null &&
      mirrorListArchiveSource != null
    ) {
      return {
        localId: mirrorTargetLocalId,
        source: mirrorListArchiveSource,
      }
    }
    return null
  }, [
    activePieSide,
    cartListPanelOpen,
    cartListSelectedLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
    mirrorTargetLocalId,
    mirrorListArchiveSource,
    notebookStripSection,
  ])

  const mobileCentralArchivePieGate = useMobileCentralArchivePieGate(
    mobileCentralArchivePreview?.localId ?? null,
    mobileCentralArchivePreview?.source ?? null,
  )

  const mobileCardphotoListTemplatePreview = useMemo(() => {
    if (!cardphotoListPanelOpen || activeSection !== 'cardphoto') return null
    if (rightPieCardphotoPeekNoToolbar) return null
    /**
     * Assembly simplified peek after Apply: list may briefly stay open in Redux;
     * never keep full-bleed template preview over the CardPie with applied photo.
     */
    if (
      cardphotoIsComplete &&
      cardphotoAssetData?.id != null &&
      cardphotoAppliedId != null &&
      cardphotoAssetData.id === cardphotoAppliedId
    ) {
      return null
    }
    if (!cardphotoAssetPreviewUrl || !cardphotoAssetData?.id) return null
    return { id: cardphotoAssetData.id, previewUrl: cardphotoAssetPreviewUrl }
  }, [
    activeSection,
    cardphotoAppliedId,
    cardphotoAssetData?.id,
    cardphotoAssetPreviewUrl,
    cardphotoIsComplete,
    cardphotoListPanelOpen,
    rightPieCardphotoPeekNoToolbar,
  ])

  const mobileCardtextListTemplatePreview = useMemo(() => {
    if (!cardtextListPanelOpen || activeSection !== 'cardtext') return null
    if (rightPieCardtextPeekNoToolbar) return null
    /** Assembly simplified peek after Apply: keep CardPie, not full-bleed template. */
    if (cardtextAssetMatchesApplied) return null
    if (!cardtextViewInQuickList) return null
    if (!cardtextTemplateId) return null
    if (!cardtextHasRenderableContent(cardtextSession)) return null
    return {
      id: cardtextTemplateId,
      value: cardtextValueForReadOnlyPreview(cardtextSession),
      style: { ...cardtextSession.style },
    }
  }, [
    activeSection,
    cardtextAssetMatchesApplied,
    cardtextListPanelOpen,
    cardtextSession,
    cardtextTemplateId,
    cardtextViewInQuickList,
    rightPieCardtextPeekNoToolbar,
  ])

  const mobileCardtextListChromeActive =
    activeSection === 'cardtext' &&
    cardtextListPanelOpen &&
    !rightPieCardtextPeekNoToolbar &&
    !cardtextAssetMatchesApplied

  const mobileAddressListChromeActive =
    activeSection === 'envelope' &&
    (senderListPanelOpen || recipientListPanelOpen)

  const mobileAddressListTemplatePreview = useMemo(() => {
    if (!mobileAddressListChromeActive) return null

    if (senderListPanelOpen && senderSelectedId) {
      const entry = senderEntries.find((e) => e.id === senderSelectedId)
      if (!entry) return null
      return {
        role: 'sender' as const,
        source: 'list' as const,
        id: entry.id,
        address: entry.address,
        lines: formatAddressPreviewLines(entry),
        inQuickList: listStatusIsInQuickAddressBook(entry.listStatus),
      }
    }

    if (recipientListPanelOpen && recipientListPendingIds.length > 0) {
      const lastId =
        recipientListPendingIds[recipientListPendingIds.length - 1]
      const entry = recipientEntries.find((e) => e.id === lastId)
      if (!entry) return null
      return {
        role: 'recipient' as const,
        source: 'list' as const,
        id: entry.id,
        address: entry.address,
        lines: formatAddressPreviewLines(entry),
        inQuickList: listStatusIsInQuickAddressBook(entry.listStatus),
      }
    }

    return null
  }, [
    mobileAddressListChromeActive,
    senderListPanelOpen,
    senderSelectedId,
    senderEntries,
    recipientListPanelOpen,
    recipientListPendingIds,
    recipientEntries,
  ])

  const mobileRecipientsFormPreview = useMemo(() => {
    if (activeSection !== 'envelope') return null
    if (mobileAddressListChromeActive) return null
    if (
      recipientView === 'recipientView' ||
      recipientView === 'recipientCreate'
    ) {
      return null
    }
    if (recipientsFormPreviewId == null) return null
    const entry = recipientEntries.find((e) => e.id === recipientsFormPreviewId)
    if (!entry) return null
    return {
      role: 'recipient' as const,
      source: 'form' as const,
      id: entry.id,
      address: entry.address,
      lines: formatAddressPreviewLines(entry),
      inQuickList: listStatusIsInQuickAddressBook(entry.listStatus),
    }
  }, [
    activeSection,
    mobileAddressListChromeActive,
    recipientView,
    recipientsFormPreviewId,
    recipientEntries,
  ])

  const mobileAddressPiePreview =
    mobileAddressListTemplatePreview ?? mobileRecipientsFormPreview

  const mobileAromaPreview = useMemo(() => {
    if (activeSection !== 'aroma') return null
    if (!viewAroma) return null
    const src = getAromaImage(viewAroma.index)
    if (!src) return null
    return { index: viewAroma.index, src }
  }, [activeSection, viewAroma])

  const mobileAromaPreviewGate = useMobileAromaPreviewGate(mobileAromaPreview)

  const mobileCentralPieDisplay = useMemo(():
    | 'archive'
    | 'cardphotoTemplate'
    | 'cardtextTemplate'
    | 'addressTemplate'
    | 'aromaPreview'
    | 'emptyArchive'
    | 'assembly' => {
    /** Same as left factory edit: selected aroma cell fills the central CardPie. */
    if (
      mobileAromaPreview != null ||
      mobileAromaPreviewGate.mounted != null
    ) {
      return 'aromaPreview'
    }
    if (mobileCentralArchivePreview != null) return 'archive'
    if (mobileCardphotoListTemplatePreview != null) return 'cardphotoTemplate'
    if (mobileCardtextListChromeActive) return 'cardtextTemplate'
    if (mobileAddressListChromeActive || mobileRecipientsFormPreview != null) {
      return 'addressTemplate'
    }
    if (
      mobileListArchiveSlotActive ||
      isCartOwnedNotebookStrip(notebookStripSection) ||
      notebookStripSection === 'history'
    ) {
      return 'emptyArchive'
    }
    return 'assembly'
  }, [
    mobileAromaPreview,
    mobileAromaPreviewGate.mounted,
    mobileCentralArchivePreview,
    mobileCardphotoListTemplatePreview,
    mobileCardtextListChromeActive,
    mobileAddressListChromeActive,
    mobileRecipientsFormPreview,
    mobileListArchiveSlotActive,
    notebookStripSection,
  ])

  /**
   * Multi-date minis: all accented in overview; only the cycled pie while browsing.
   * Single plan pie: keep a sole accent.
   * Keep accent for left-context template/preview modes; clear only for archive/right.
   */
  const gutterKeepsPlanPieAccent =
    mobileCentralPieDisplay !== 'archive' &&
    mobileCentralPieDisplay !== 'emptyArchive'

  const gutterHighlightPlanPieId = useMemo(() => {
    if (!gutterKeepsPlanPieAccent) return null
    if (planPies.length > 1) return selectedPlanPieId
    if (selectedPlanPieId != null) return selectedPlanPieId
    if (planPies.length === 1) return planPies[0]?.id ?? null
    return null
  }, [gutterKeepsPlanPieAccent, selectedPlanPieId, planPies])

  const gutterHighlightAllPlanPies =
    gutterKeepsPlanPieAccent &&
    planPies.length > 1 &&
    selectedPlanPieId == null

  const mobileCentralArchivePostcardStatus = useMemo(() => {
    if (mobileCentralArchivePreview == null) return undefined
    return cartItems.find(
      (postcard) => postcard.localId === mobileCentralArchivePreview.localId,
    )?.status
  }, [cartItems, mobileCentralArchivePreview])

  const mobileCentralMountedArchivePostcardStatus = useMemo(() => {
    const mountedLocalId = mobileCentralArchivePieGate.mountedLocalId
    if (mountedLocalId == null) return undefined
    return cartItems.find((postcard) => postcard.localId === mountedLocalId)
      ?.status
  }, [cartItems, mobileCentralArchivePieGate.mountedLocalId])

  const isCartArchivePiePostcardStatus =
    mobileCentralArchivePostcardStatus === 'cart' ||
    mobileCentralArchivePostcardStatus === 'cartBlocked'

  const showMobileCentralPostcardPieCartToolbar =
    mobileCentralPieDisplay === 'archive' && isCartArchivePiePostcardStatus

  const showMobileCentralPostcardPieHistoryToolbar =
    mobileCentralPieDisplay === 'archive' &&
    mobileCentralArchivePostcardStatus != null &&
    !isCartArchivePiePostcardStatus

  const canFavoriteCardphotoTemplatePreview =
    cardphotoAssetData?.status === 'inLine' ||
    cardphotoAssetData?.status === 'outLine' ||
    cardphotoAssetData?.status === 'processed'

  const showMobileCentralTemplatePreviewPieToolbar =
    (mobileCentralPieDisplay === 'cardphotoTemplate' &&
      canFavoriteCardphotoTemplatePreview) ||
    (mobileCentralPieDisplay === 'cardtextTemplate' &&
      mobileCardtextListTemplatePreview != null) ||
    (mobileCentralPieDisplay === 'addressTemplate' &&
      mobileAddressPiePreview != null)

  const addressTemplatePreviewPieToolbar = mobileAddressPiePreview?.inQuickList
    ? MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE
    : MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE

  const addressTemplatePreviewPieState =
    mobileAddressPiePreview?.inQuickList
      ? MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE
      : MOBILE_ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE

  const cardphotoTemplateInQuickList =
    cardphotoAssetData?.status === 'inLine'

  const cardphotoTemplatePreviewPieToolbar = cardphotoTemplateInQuickList
    ? MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE
    : MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE

  const cardphotoTemplatePreviewPieState = cardphotoTemplateInQuickList
    ? MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE
    : MOBILE_CARDPHOTO_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE

  const cardtextTemplatePreviewPieToolbar = cardtextViewInQuickList
    ? MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE
    : MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE

  const cardtextTemplatePreviewPieState = cardtextViewInQuickList
    ? MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE
    : MOBILE_CARDTEXT_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE

  const handleTemplatePreviewPieToolbarAction = useCallback(
    (key: IconKey) => {
      if (mobileCentralPieDisplay === 'addressTemplate') {
        const preview = mobileAddressPiePreview
        if (!preview) return
        if (key !== 'edit' && key !== 'favorite' && key !== 'favoriteFilled') {
          return
        }

        const section =
          preview.role === 'sender' ? 'senderView' : 'recipientView'

        if (preview.role === 'sender') {
          dispatch(setSenderViewId(preview.id))
        } else {
          dispatch(setRecipientViewId(preview.id))
          if (preview.source === 'form') {
            dispatch(setRecipientViewDraft(preview.address as AddressFields))
          }
        }

        if (key === 'edit') {
          if (preview.source === 'form') {
            dispatch(
              toolbarAction({
                section,
                key: 'edit',
                payload: { returnToFormPreview: true },
              }),
            )
            return false
          }
          // Avoid restore-on-close wiping the template we just selected for edit.
          dispatch(clearAddressListPreviewSnapshot())
          dispatch(closeAddressList())
          dispatch(
            toolbarAction({
              section,
              key: 'edit',
              payload: { returnToList: true },
            }),
          )
          return false
        }

        // Soft remove/add quick list: keep panel + preview; star outline/filled via listStatus.
        dispatch(
          toolbarAction({
            section,
            key: preview.inQuickList ? 'removeFromList' : 'addList',
          }),
        )
        return false
      }

      if (mobileCentralPieDisplay === 'cardtextTemplate') {
        if (key === 'edit') {
          dispatch(setCardtextListPanelOpen(false))
          openCardtextEditorFromView(
            dispatch,
            cardtextSession.status ?? 'inLine',
            { returnTo: 'list' },
          )
          return false
        }
        if (key === 'favorite' || key === 'favoriteFilled') {
          dispatch(pulseListCardtextBadge())
          dispatch(
            toolbarAction({
              section: 'cardtextView',
              key: cardtextViewInQuickList ? 'removeFromList' : 'addList',
            }),
          )
          return false
        }
        return
      }

      if (mobileCentralPieDisplay === 'cardphotoTemplate') {
        if (key !== 'favorite' && key !== 'favoriteFilled') return
        dispatch(pulseListCardphotoBadge())
        dispatch(
          toolbarAction({
            section: 'cardphotoView',
            key: cardphotoTemplateInQuickList ? 'removeFromList' : 'addList',
          }),
        )
        return false
      }
    },
    [
      cardphotoTemplateInQuickList,
      cardtextSession.status,
      cardtextViewInQuickList,
      dispatch,
      mobileAddressPiePreview,
      mobileCentralPieDisplay,
    ],
  )

  const handleLeftPieCenterPress = useCallback(() => {
    if (activePieSide === 'right') {
      onLeftPieCenterClick()
      return
    }

    if (canCyclePlanPies) {
      if (selectViewAroma(store.getState())) {
        dispatch(clearViewAroma())
      }

      const nextPlanPieId = cyclePlanPie()
      if (nextPlanPieId == null) return

      const pie = planPies.find((entry) => entry.id === nextPlanPieId)
      if (pie?.dispatchDate != null) {
        dispatch(
          updateLastViewedCalendarDate({
            year: pie.dispatchDate.year,
            month: pie.dispatchDate.month,
          }),
        )
      }
      return
    }

    onLeftPieCenterClick()
  }, [
    activePieSide,
    canCyclePlanPies,
    cyclePlanPie,
    planPies,
    dispatch,
    onLeftPieCenterClick,
  ])

  const handleSelectPlanPie = useCallback(
    (id: string) => {
      if (selectViewAroma(store.getState())) {
        dispatch(clearViewAroma())
      }

      const pie = planPies.find((entry) => entry.id === id)
      if (pie == null) return

      const state = store.getState()
      const notebookStripTab = selectNotebookStripTab(state)
      const exitingListArchiveSlot =
        selectCartListPanelOpen(state) || selectIsHistoryListPanelOpen(state)
      const exitingHeaderCartHistoryStrip =
        isCartOwnedNotebookStrip(notebookStripTab) ||
        notebookStripTab === 'history'
      const cardphotoListOpen = selectIsListPanelOpen(state)
      const cardtextListOpen = selectIsCardtextListPanelOpen(state)
      const addressListOpen =
        selectSenderListPanelOpen(state) || selectRecipientListPanelOpen(state)
      const factoryTemplateListOpen =
        cardphotoListOpen || cardtextListOpen || addressListOpen

      if (factoryTemplateListOpen) {
        onBeforeLeftPieInteraction()

        if (cardphotoListOpen) {
          dispatch(setCardphotoListPanelOpen(false))
          dispatch(
            updateToolbarIcon({
              section: 'cardphoto',
              key: 'listCardphoto',
              value: 'enabled',
            }),
          )
        }
        if (cardtextListOpen) {
          dispatch(setCardtextListPanelOpen(false))
        }
        if (addressListOpen) {
          dispatch(closeAddressList())
        }
      }

      if (
        exitingListArchiveSlot ||
        exitingHeaderCartHistoryStrip ||
        activePieSide === 'right'
      ) {
        onBeforeLeftPieInteraction()

        if (selectIsCardPieListPanelOpen(state)) {
          dispatch(setCardPieListPanelOpen(false))
          dispatchCardPieToolbarIconState(dispatch, false)
        }
        if (selectCartListPanelOpen(state)) {
          dispatch(setCartListPanelOpen(false))
        }
        if (selectIsHistoryListPanelOpen(state)) {
          dispatch(setHistoryListPanelOpen(false))
        }

        if (notebookStripTab === 'cart') {
          dispatch(setNotebookStripDateOverCart(true))
        } else if (notebookStripTab === 'history') {
          dispatch(setNotebookStripDateOverHistory(true))
        }
        dispatch(setNotebookStripTab('date'))

        if (exitingHeaderCartHistoryStrip) {
          dispatch(setActiveSection('date'))
        } else {
          dispatch(openCardphotoFromMiniStripRequested())
          dispatch(setActiveSection('cardphoto'))
        }
      }

      selectPlanPie(id)

      if (pie.dispatchDate != null) {
        dispatch(
          updateLastViewedCalendarDate({
            year: pie.dispatchDate.year,
            month: pie.dispatchDate.month,
          }),
        )
      }
    },
    [
      dispatch,
      planPies,
      selectPlanPie,
      activePieSide,
      onBeforeLeftPieInteraction,
    ],
  )

  const handleRightListArchivePieSectorClick = useCallback(
    (section: CardSection) => {
      onRightListPieSectorClick(section)
    },
    [onRightListPieSectorClick],
  )

  const handleLeftPieSectorClick = useCallback(
    (section: CardSection) => {
      onBeforeLeftPieInteraction()
      const state = store.getState()
      const currentActiveSection = selectActiveSection(state)

      if (section === 'cardphoto' && currentActiveSection === 'cardphoto') {
        const cardphotoListOpen = selectIsListPanelOpen(state)
        const nextOpen = !cardphotoListOpen
        dispatch(setCardphotoListPanelOpen(nextOpen))
        dispatch(
          updateToolbarIcon({
            section: 'cardphoto',
            key: 'listCardphoto',
            value: nextOpen ? 'active' : 'enabled',
          }),
        )
        return
      }

      if (section === 'cardtext' && currentActiveSection === 'cardtext') {
        const cardtextListOpen = selectIsCardtextListPanelOpen(state)
        const cardtextMode = selectCardtextInteractionMode(state)
        const isCardtextView =
          cardtextMode === 'postcardTemplateView' ||
          cardtextMode === 'processedSlot'
        if (isCardtextView) {
          if (cardtextListOpen) {
            dispatch(setCardtextListPanelOpen(false))
          }
          return
        }
        dispatch(setCardtextListPanelOpen(!cardtextListOpen))
        return
      }

      if (section === 'envelope' && currentActiveSection === 'envelope') {
        const senderListOpen = selectSenderListPanelOpen(state)
        const recipientListOpen = selectRecipientListPanelOpen(state)
        // Leave address view / close lists — do not open lists from CardPie.
        dispatch(requestClearMobileAddressFocus())
        if (senderListOpen || recipientListOpen) {
          dispatch(closeAddressList())
        }
        return
      }

      const notebookStripTab = selectNotebookStripTab(state)
      if (selectIsCardPieListPanelOpen(state)) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      if (selectCartListPanelOpen(state)) {
        dispatch(setCartListPanelOpen(false))
      }
      if (selectIsHistoryListPanelOpen(state)) {
        dispatch(setHistoryListPanelOpen(false))
      }
      if (isCartOwnedNotebookStrip(notebookStripTab)) {
        dispatch(setNotebookStripDateOverCart(true))
        dispatch(setNotebookStripTab('date'))
      } else if (notebookStripTab === 'history') {
        dispatch(setNotebookStripDateOverHistory(true))
        dispatch(setNotebookStripTab('date'))
      }
      if (section === 'cardphoto') {
        dispatch(setCardphotoListPanelOpen(false))
        dispatch(
          updateToolbarIcon({
            section: 'cardphoto',
            key: 'listCardphoto',
            value: 'enabled',
          }),
        )
        dispatch(openCardphotoFromMiniStripRequested())
      }
      if (section === 'cardtext') {
        dispatch(setCardtextListPanelOpen(false))
      }
      if (section === 'envelope') {
        dispatch(closeAddressList())
      }
      dispatch(setActiveSection(section))
    },
    [dispatch, onBeforeLeftPieInteraction],
  )

  const handleEditorPieToolbarAction = useEditorPieAddCartHandler({
    planPies,
    selectedPlanPie,
    onEditorPieToolbarAction,
  })

  const handleCartSlotClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      clearMobileFactoryPeek()
      if (selectIsCardPieListPanelOpen(store.getState())) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      const state = store.getState()
      for (const command of buildCartArchiveToggleCommands({
        cartListPanelOpen: selectCartListPanelOpen(state),
        notebookStripTab: selectNotebookStripTab(state),
        isMobileLayout: true,
        lastActiveView: selectLastCartArchiveView(state),
      })) {
        dispatch(command)
      }
    },
    [dispatch, clearMobileFactoryPeek],
  )

  const handleHistorySlotClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      clearMobileFactoryPeek()
      if (selectIsCardPieListPanelOpen(store.getState())) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      const state = store.getState()
      for (const command of buildHistoryArchiveToggleCommands({
        historyListPanelOpen: selectIsHistoryListPanelOpen(state),
        notebookStripTab: selectNotebookStripTab(state),
        activeSection: selectActiveSection(state),
        isMobileLayout: true,
        lastActiveView: selectLastHistoryArchiveView(state),
      })) {
        dispatch(command)
      }
    },
    [dispatch, clearMobileFactoryPeek],
  )

  const historyStripActive =
    historyListPanelOpen || notebookStripSection === 'history'

  const cartStripActive =
    cartListPanelOpen || isCartOwnedNotebookStrip(notebookStripSection)

  const cartArchiveViewMode = resolveCartArchiveViewMode({
    cartListPanelOpen,
    notebookStripTab: notebookStripSection,
  })

  /**
   * Иконка на слоте = следующее состояние после клика (как left icon в тулбаре календаря/списка):
   * календарь → cart/history (откроет список); список → date (откроет календарь).
   */
  const showCartSlotCartIcon =
    cartStripActive &&
    (cartArchiveViewMode === 'calendar' || cartCalendarDatePickMode)

  const showCartSlotDateIcon =
    cartStripActive &&
    cartArchiveViewMode === 'list' &&
    !cartCalendarDatePickMode

  const historyArchiveViewMode = resolveHistoryArchiveViewMode({
    historyListPanelOpen,
    notebookStripTab: notebookStripSection,
    activeSection,
    archiveSectionPeekActive:
      mobileFactoryChromePeek && mirrorListArchiveSource === 'history',
  })

  const showHistorySlotHistoryIcon =
    historyStripActive && historyArchiveViewMode === 'calendar'

  const showHistorySlotDateIcon =
    historyStripActive && historyArchiveViewMode === 'list'

  const cartModeIconVisible = showCartSlotDateIcon || showCartSlotCartIcon
  const historyModeIconVisible =
    showHistorySlotDateIcon || showHistorySlotHistoryIcon
  const cartSecondClickHint =
    useMobileArchiveSlotSecondClickHint(cartModeIconVisible)
  const historySecondClickHint =
    useMobileArchiveSlotSecondClickHint(historyModeIconVisible)

  const cardWidthStyle =
    sizeCard?.width != null && sizeCard.width > 0
      ? ({
          '--card-width': `${sizeCard.width}px`,
          '--card-work-zone-side': `${sizeCard.width}px`,
          ...(sizeCard.height > 0
            ? { '--card-height': `${sizeCard.height}px` }
            : {}),
        } as React.CSSProperties)
      : undefined

  return (
    <div
      ref={shellRef}
      className={styles.mobileShell}
      style={cardWidthStyle}
      data-envelope-address-create={envelopeAddressCreateRole ?? undefined}
      data-cardtext-create={cardtextCreateChromeActive ? 'true' : undefined}
      data-cardtext-compose={
        cardtextComposeHideAppHeader && !cardtextCreateChromeActive
          ? 'true'
          : undefined
      }
      data-cardtext-list-open={
        cardtextListPanelOpen && activeSection === 'cardtext'
          ? 'true'
          : undefined
      }
      onClick={onAppClick}
    >
      <MarkStampYearDevProvider>
        <div className={styles.mobileSubstrate}>
          <header className={styles.mobileHeader}>
            <div className={styles.mobileHeaderLeft}>
              <div className={styles.mobileHeaderLogo} aria-hidden>
                <IconLogo />
              </div>
            </div>
            <div className={styles.mobileHeaderRight}>
              <CartHeaderTotal />
              <SectionEditorRightSidebar
                variant="headerStack"
                pinActiveTab={pinActiveTab}
              />
            </div>
          </header>

          <div className={styles.mobileMain}>
            <div className={styles.mobileBody} style={cardWidthStyle}>
              <EditorPieListCardPieBadgeSync />
              <DateToolbarListDateBadgeSync />
              <RightSidebarHistoryBadgeSync />
              <CalendarModeToolbarBadgesSync />

              <section className={styles.mobilePieSection} aria-label="Card pie">
                <div className={styles.mobilePieSectionRow}>
                  <MobileCardPieGutterMinis
                    planPies={planPies}
                    selectedPlanPieId={selectedPlanPieId}
                    highlightPlanPieId={gutterHighlightPlanPieId}
                    highlightAllPlanPies={gutterHighlightAllPlanPies}
                    onSelectPlanPie={handleSelectPlanPie}
                  />
                  <div className={styles.mobilePieStage}>
                  <div
                    className={styles.mobilePieWrap}
                    data-mobile-central-pie-mode={mobileCentralPieDisplay}
                  >
                      {mobileCentralPieDisplay === 'archive' &&
                      mobileCentralArchivePreview != null ? (
                        <div
                          className={clsx(
                            styles.mobileArchivePieReveal,
                            mobileCentralArchivePieGate.contentOpaque &&
                              styles.mobileArchivePieRevealOpaque,
                          )}
                          style={{
                            transitionDuration: `${mobileCentralArchivePieGate.fadeMs}ms`,
                          }}
                        >
                          {mobileCentralArchivePieGate.mountedLocalId !=
                            null &&
                          mobileCentralArchivePieGate.mountedSource !=
                            null ? (
                            <CardPie
                              key={
                                mobileCentralArchivePieGate.revealToken ??
                                String(
                                  mobileCentralArchivePieGate.mountedLocalId,
                                )
                              }
                              fillContainer
                              station="right"
                              isProcessed={false}
                              status={
                                mobileCentralMountedArchivePostcardStatus
                              }
                              id={String(
                                mobileCentralArchivePieGate.mountedLocalId,
                              )}
                              rightListSource={
                                mobileCentralArchivePieGate.mountedSource
                              }
                              onListArchiveSectorClick={
                                handleRightListArchivePieSectorClick
                              }
                              onRightPieCenterClick={onArchivePieCenterClick}
                              rightPieCenterAffordance={
                                rightPieCenterAffordance
                              }
                            />
                          ) : (
                            <div
                              className={styles.mobileArchivePieRevealBlank}
                              aria-hidden
                            />
                          )}
                        </div>
                      ) : mobileCentralPieDisplay === 'cardphotoTemplate' &&
                        mobileCardphotoListTemplatePreview != null ? (
                        <div
                          className={styles.mobileCardphotoListTemplatePreview}
                          aria-label="Selected photo template preview"
                        >
                          <img
                            key={mobileCardphotoListTemplatePreview.id}
                            src={mobileCardphotoListTemplatePreview.previewUrl}
                            alt=""
                            decoding="async"
                          />
                        </div>
                      ) : mobileCentralPieDisplay === 'cardtextTemplate' ? (
                        mobileCardtextListTemplatePreview != null ? (
                        <div
                          className={styles.mobileCardtextListTemplatePreview}
                          aria-label="Selected text template preview"
                        >
                          <div
                            className={styles.mobileCardtextListTemplatePreviewStage}
                            style={
                              {
                                '--cardtext-font-scale-cap':
                                  CARDTEXT_CREATE_FIELD_FONT_SCALE,
                                '--cardtext-font-scale-min':
                                  CARDTEXT_CREATE_FIELD_FONT_SCALE_MIN,
                              } as React.CSSProperties
                            }
                          >
                            <CardtextView
                              key={mobileCardtextListTemplatePreview.id}
                              contentKey={`list-preview-${mobileCardtextListTemplatePreview.id}`}
                              value={mobileCardtextListTemplatePreview.value}
                              style={mobileCardtextListTemplatePreview.style}
                            />
                          </div>
                        </div>
                        ) : (
                          <div
                            className={styles.mobileCardtextListTemplatePlaceholder}
                            aria-hidden
                          >
                            <IconSectionMenuCardtext />
                          </div>
                        )
                      ) : mobileCentralPieDisplay === 'addressTemplate' ? (
                        mobileAddressPiePreview != null ? (
                        <div
                          className={styles.mobileAddressListTemplatePreview}
                          data-address-list-preview-role={
                            mobileAddressPiePreview.role
                          }
                          aria-label="Selected address template preview"
                        >
                          <div className={styles.mobileAddressListTemplatePreviewLines}>
                            {mobileAddressPiePreview.lines.map(
                              (line) => (
                                <div
                                  key={line.field}
                                  className={clsx(
                                    styles.mobileAddressListTemplatePreviewLine,
                                    line.isName &&
                                      styles.mobileAddressListTemplatePreviewLineName,
                                  )}
                                >
                                  {line.text}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                        ) : (
                          <div
                            className={styles.mobileAddressListTemplatePlaceholder}
                            aria-hidden
                          >
                            <IconSectionMenuEnvelopeV2 />
                          </div>
                        )
                      ) : mobileCentralPieDisplay === 'aromaPreview' ? (
                        <div
                          className={clsx(
                            styles.mobileAromaPreview,
                            mobileAromaPreviewGate.phase === 'in' &&
                              styles.mobileAromaPreviewFadeIn,
                            mobileAromaPreviewGate.phase === 'out' &&
                              styles.mobileAromaPreviewFadeOut,
                          )}
                          style={
                            mobileAromaPreviewGate.phase === 'shown'
                              ? { opacity: 1 }
                              : mobileAromaPreviewGate.phase === 'hidden'
                                ? { opacity: 0 }
                                : {
                                    animationDuration: `${mobileAromaPreviewGate.fadeMs}ms`,
                                  }
                          }
                          aria-label={
                            mobileAromaPreviewGate.mounted != null
                              ? 'Selected aroma preview'
                              : undefined
                          }
                          aria-hidden={
                            mobileAromaPreviewGate.mounted == null
                              ? true
                              : undefined
                          }
                        >
                          {mobileAromaPreviewGate.mounted != null ? (
                            <img
                              key={mobileAromaPreviewGate.mounted.index}
                              src={mobileAromaPreviewGate.mounted.src}
                              alt={
                                mobileAromaPreviewGate.mounted.index === 0
                                  ? ''
                                  : `Aroma slot ${mobileAromaPreviewGate.mounted.index}`
                              }
                              decoding="async"
                              draggable={false}
                            />
                          ) : null}
                        </div>
                      ) : mobileCentralPieDisplay === 'emptyArchive' ? (
                        <div
                          className={styles.mobileListArchiveEmptyPlaceholder}
                          aria-hidden
                        >
                          <IconCardPie />
                        </div>
                      ) : mobileCentralPieDisplay === 'assembly' ? (
                        <CardPie
                          fillContainer
                          station="left"
                          pieInner={
                            (selectedPlanPie ?? assemblyOverviewPie).inner
                          }
                          pieSections={
                            (selectedPlanPie ?? assemblyOverviewPie).sections
                          }
                          onLeftPieSectorClick={handleLeftPieSectorClick}
                          onLeftPieCenterClick={handleLeftPieCenterPress}
                          leftPieCenterPlanCycle={canCyclePlanPies}
                          leftPieCenterClickable={canCyclePlanPies}
                        />
                      ) : null}
                  </div>
                    {showMobileCentralTemplatePreviewPieToolbar ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="editorPie"
                          groupsOverride={
                            mobileCentralPieDisplay === 'addressTemplate'
                              ? addressTemplatePreviewPieToolbar
                              : mobileCentralPieDisplay === 'cardtextTemplate'
                                ? cardtextTemplatePreviewPieToolbar
                                : cardphotoTemplatePreviewPieToolbar
                          }
                          stateOverride={
                            mobileCentralPieDisplay === 'addressTemplate'
                              ? addressTemplatePreviewPieState
                              : mobileCentralPieDisplay === 'cardtextTemplate'
                                ? cardtextTemplatePreviewPieState
                                : cardphotoTemplatePreviewPieState
                          }
                          mergedWithCenter
                          onActionClick={handleTemplatePreviewPieToolbarAction}
                        />
                      </div>
                    ) : null}
                    {mobileCentralPieDisplay === 'assembly' ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="editorPie"
                          onActionClick={handleEditorPieToolbarAction}
                        />
                      </div>
                    ) : null}
                    {showMobileCentralPostcardPieCartToolbar ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="postcardPieCart"
                          onActionClick={onPostcardPieCartToolbarAction}
                          stateOverride={postcardPieCartToolbarStateOverride}
                          mergedWithCenter
                        />
                      </div>
                    ) : null}
                    {showMobileCentralPostcardPieHistoryToolbar ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="postcardPieHistory"
                          onActionClick={onPostcardPieCartToolbarAction}
                          mergedWithCenter
                        />
                      </div>
                    ) : null}
                  </div>
                    <div className={styles.mobilePieRightSlot}>
                      <div className={styles.mobilePieRightSlotCartShell}>
                        <div className={styles.mobilePieRightSlotCartButtonFrame}>
                          {showCartSlotDateIcon || showCartSlotCartIcon ? (
                            <span
                              className={clsx(
                                styles.mobilePieRightSlotActiveIndicatorIcon,
                                cartSecondClickHint.pulsing &&
                                  styles.mobilePieRightSlotActiveIndicatorIconHint,
                              )}
                              aria-hidden
                              onAnimationEnd={cartSecondClickHint.onPulseEnd}
                            >
                              {showCartSlotDateIcon ? (
                                <IconSectionMenuDate />
                              ) : (
                                <IconCart />
                              )}
                            </span>
                          ) : null}
                          <button
                            type="button"
                            className={clsx(
                              styles.mobilePieRightSlotItemCart,
                              cartSlotVisualMode === 'activeOnly' &&
                                styles.mobilePieRightSlotItemCartModeActiveOnly,
                              cartSlotVisualMode === 'mixed' &&
                                styles.mobilePieRightSlotItemCartModeMixed,
                              cartSlotVisualMode === 'blockedOnly' &&
                                styles.mobilePieRightSlotItemCartModeBlockedOnly,
                            )}
                            aria-label="Cart postcards"
                            aria-pressed={
                              cartListPanelOpen ||
                              isCartOwnedNotebookStrip(notebookStripSection)
                            }
                            onClick={(event) => {
                              cartSecondClickHint.onUserClick()
                              handleCartSlotClick(event)
                            }}
                          >
                            <div
                              className={clsx(
                                styles.mobilePieRightSlotCartHalf,
                                styles.mobilePieRightSlotCartActive,
                              )}
                            />
                            <div
                              className={clsx(
                                styles.mobilePieRightSlotCartHalf,
                                styles.mobilePieRightSlotCartBlocked,
                              )}
                            />
                          </button>
                        </div>
                        {activeCartPostcardCount > 0 ? (
                          <span
                            className={clsx(
                              styles.mobilePieRightSlotCartCount,
                              styles.mobilePieRightSlotCartCountActive,
                            )}
                            aria-hidden
                          >
                            {activeCartPostcardCount}
                          </span>
                        ) : null}
                        {blockedCartPostcardCount > 0 ? (
                          <span
                            className={clsx(
                              styles.mobilePieRightSlotCartCount,
                              styles.mobilePieRightSlotCartCountBlocked,
                            )}
                            aria-hidden
                          >
                            {blockedCartPostcardCount}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className={clsx(
                          styles.mobilePieRightSlotItem,
                          styles.mobilePieRightSlotItemHistory,
                        )}
                        aria-label="History postcards"
                        aria-pressed={historyStripActive}
                        onClick={(event) => {
                          historySecondClickHint.onUserClick()
                          handleHistorySlotClick(event)
                        }}
                      >
                        {showHistorySlotDateIcon || showHistorySlotHistoryIcon ? (
                          <span
                            className={clsx(
                              styles.mobilePieRightSlotActiveIndicatorIcon,
                              historySecondClickHint.pulsing &&
                                styles.mobilePieRightSlotActiveIndicatorIconHint,
                            )}
                            aria-hidden
                            onAnimationEnd={historySecondClickHint.onPulseEnd}
                          >
                            {showHistorySlotDateIcon ? (
                              <IconSectionMenuDate />
                            ) : (
                              <IconHistoryV2 />
                            )}
                          </span>
                        ) : null}
                      </button>
                    </div>
                </div>
              </section>

              <section
                className={styles.mobileEditorSection}
                aria-label="Section editor"
              >
                <div
                  ref={formRef}
                  className={clsx(
                    styles.mobileForm,
                    mobileFactoryListOverlayKey != null && styles.mobileFormListPanel,
                  )}
                  data-mobile-factory-chrome={
                    mobileFactoryChromePeek ? 'peek' : undefined
                  }
                >
                  <MobileDateListSlotActionsProvider
                    onCartListSelectEntry={onCartListSelectEntry}
                    onCartListDateEditEntry={onCartListDateEditEntry}
                    onHistoryListSelectEntry={onHistoryListSelectEntry}
                  >
                    <div
                      className={styles.mobileFormEditorLayer}
                      aria-hidden={mobileFactoryListOverlayKey != null}
                    >
                      <CardSectionEditor />
                    </div>
                  </MobileDateListSlotActionsProvider>
                  {mobileFactoryListOverlayKey === 'cardPie' ? (
                    <div className={styles.mobileFormListOverlay}>
                      <CardPieLeftSlot />
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>

        {userLoginPanelOpen ? (
          <div className={styles.mobileUserPanel}>
            <UserLoginRightSlot />
          </div>
        ) : null}
      </MarkStampYearDevProvider>
    </div>
  )
}

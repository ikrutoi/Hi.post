import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import {
  deleteCardphotoFromViewRequested,
  openCardphotoFromMiniStripRequested,
  setCardphotoListPanelOpen,
} from '@cardphoto/infrastructure/state'
import { selectIsListPanelOpen, selectCardphotoAssetData, selectCardphotoAssetDisplayPreviewUrl, selectCardphotoIsComplete, selectCardphotoAppliedData } from '@cardphoto/infrastructure/selectors'
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
} from '@date/calendar/infrastructure/selectors'
import { setCardtextListPanelOpen, deleteCardtextFromViewRequested } from '@cardtext/infrastructure/state'
import {
  selectIsCardtextListPanelOpen,
  selectCardtextId,
  selectCardtextSessionData,
  selectCardtextAssetMatchesApplied,
} from '@cardtext/infrastructure/selectors'
import {
  cardtextHasRenderableContent,
  cardtextValueForReadOnlyPreview,
  clampCardtextFontSizeStep,
} from '@cardtext/domain/editor/editor.types'
import { openCardtextEditorFromView } from '@cardtext/application/helpers'
import { CardtextView } from '@cardtext/presentation/CardtextView/CardtextView'
import {
  closeAddressList,
  requestClearMobileAddressFocus,
  setRecipientsPendingIds,
} from '@envelope/infrastructure/state'
import {
  selectRecipientListPanelOpen,
  selectRecipientListPendingIds,
  selectSenderListPanelOpen,
  selectSenderSelectedId,
} from '@envelope/infrastructure/selectors'
import {
  selectRecipientEntriesState,
} from '@envelope/recipient/infrastructure/selectors'
import { setRecipientViewId } from '@envelope/recipient/infrastructure/state'
import {
  selectSenderEntriesState,
} from '@envelope/sender/infrastructure/selectors'
import { setSenderViewId } from '@envelope/sender/infrastructure/state'
import { formatAddressPreviewLines } from '@envelope/addressBook/presentation/addressSummaryLines'
import { clearViewAroma } from '@aroma/infrastructure/state'
import { selectViewAroma } from '@aroma/infrastructure/selectors'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import { toolbarAction } from '@toolbar/application/helpers'
import { dispatchCardPieToolbarIconState } from '@toolbar/application/syncCardPieToolbarIcons'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardSection, IconKey } from '@shared/config/constants'
import { selectUserLoginPanelOpen } from '@features/auth/infrastructure/selectors/authSelectors'
import { MarkStampYearDevProvider } from '@envelope/application/MarkStampYearDevContext'
import { IconCardPie, IconCart, IconHistoryV2, IconLogo, IconSectionMenuCardtext, IconSectionMenuDate, IconSectionMenuEnvelopeV2 } from '@shared/ui/icons'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { useEditorPieAddCartHandler } from '@features/cardPie/application/hooks/useEditorPieAddCartHandler'
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
import type { MobileAppShellProps } from './mobileAppShell.types'
import styles from './MobileAppShell.module.scss'

const MOBILE_TEMPLATE_PREVIEW_PIE_TOOLBAR: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'empty', state: 'disabled' },
      { key: 'empty', state: 'disabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

/** Cardtext / address list: edit сверху, delete снизу рядом с центральным превью. */
const MOBILE_LIST_TEMPLATE_PREVIEW_PIE_TOOLBAR: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'empty', state: 'disabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_LIST_TEMPLATE_PREVIEW_PIE_STATE = {
  edit: { state: 'enabled' as const },
  empty: { state: 'disabled' as const },
  delete: { state: 'enabled' as const },
}

/** Aroma cell preview in central CardPie: closeBig сверху справа от pie. */
const MOBILE_AROMA_PREVIEW_PIE_TOOLBAR: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'closeBig', state: 'enabled' },
      { key: 'empty', state: 'disabled' },
      { key: 'empty', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

const MOBILE_AROMA_PREVIEW_PIE_STATE = {
  closeBig: { state: 'enabled' as const },
  empty: { state: 'disabled' as const },
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
}) => {
  const dispatch = useAppDispatch()
  const shellRef = useRef<HTMLDivElement>(null)
  useMobileVisualViewport(shellRef, {
    pinTop: envelopeAddressCreateRole != null,
  })
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
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderSelectedId = useAppSelector(selectSenderSelectedId)
  const recipientListPendingIds = useAppSelector(selectRecipientListPendingIds)
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

  const { planPies, selectedPlanPie, selectedPlanPieId, selectPlanPie, cyclePlanPie } =
    useMobilePlanCardPies()
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

  const canCyclePlanPies = planPies.length > 0
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
    if (notebookStripSection === 'cart') {
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
    if (!cardtextTemplateId) return null
    if (!cardtextHasRenderableContent(cardtextSession)) return null
    return {
      id: cardtextTemplateId,
      value: cardtextValueForReadOnlyPreview(cardtextSession),
      style: {
        ...cardtextSession.style,
        fontSizeStep: clampCardtextFontSizeStep(
          (cardtextSession.style?.fontSizeStep ?? 3) - 2,
        ),
      },
    }
  }, [
    activeSection,
    cardtextAssetMatchesApplied,
    cardtextListPanelOpen,
    cardtextSession,
    cardtextTemplateId,
    rightPieCardtextPeekNoToolbar,
  ])

  const mobileCardtextListChromeActive =
    activeSection === 'cardtext' &&
    cardtextListPanelOpen &&
    !rightPieCardtextPeekNoToolbar &&
    !cardtextAssetMatchesApplied

  const mobileAddressListChromeActive =
    activeSection === 'envelope' &&
    (senderListPanelOpen || recipientListPanelOpen) &&
    !rightPieEnvelopePeekNoToolbar

  const mobileAddressListTemplatePreview = useMemo(() => {
    if (!mobileAddressListChromeActive) return null

    if (senderListPanelOpen && senderSelectedId) {
      const entry = senderEntries.find((e) => e.id === senderSelectedId)
      if (!entry) return null
      return {
        role: 'sender' as const,
        id: entry.id,
        lines: formatAddressPreviewLines(entry),
      }
    }

    if (recipientListPanelOpen && recipientListPendingIds.length > 0) {
      const lastId =
        recipientListPendingIds[recipientListPendingIds.length - 1]
      const entry = recipientEntries.find((e) => e.id === lastId)
      if (!entry) return null
      return {
        role: 'recipient' as const,
        id: entry.id,
        lines: formatAddressPreviewLines(entry),
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

  const mobileAromaPreview = useMemo(() => {
    if (activeSection !== 'aroma') return null
    if (rightPieAromaPeekNoToolbar) return null
    if (!viewAroma) return null
    const src = getAromaImage(viewAroma.index)
    if (!src) return null
    return { index: viewAroma.index, src }
  }, [activeSection, rightPieAromaPeekNoToolbar, viewAroma])

  const mobileCentralPieDisplay = useMemo(():
    | 'archive'
    | 'cardphotoTemplate'
    | 'cardtextTemplate'
    | 'addressTemplate'
    | 'aromaPreview'
    | 'emptyArchive'
    | 'assembly' => {
    if (mobileCentralArchivePreview != null) return 'archive'
    if (mobileCardphotoListTemplatePreview != null) return 'cardphotoTemplate'
    if (mobileCardtextListChromeActive) return 'cardtextTemplate'
    if (mobileAddressListChromeActive) return 'addressTemplate'
    if (mobileAromaPreview != null) return 'aromaPreview'
    if (
      mobileListArchiveSlotActive ||
      notebookStripSection === 'cart' ||
      notebookStripSection === 'history'
    ) {
      return 'emptyArchive'
    }
    return 'assembly'
  }, [
    mobileCentralArchivePreview,
    mobileCardphotoListTemplatePreview,
    mobileCardtextListChromeActive,
    mobileAddressListChromeActive,
    mobileAromaPreview,
    mobileListArchiveSlotActive,
    notebookStripSection,
  ])

  const mobileCentralArchivePostcardStatus = useMemo(() => {
    if (mobileCentralArchivePreview == null) return undefined
    return cartItems.find(
      (postcard) => postcard.localId === mobileCentralArchivePreview.localId,
    )?.status
  }, [cartItems, mobileCentralArchivePreview])

  const isCartArchivePiePostcardStatus =
    mobileCentralArchivePostcardStatus === 'cart' ||
    mobileCentralArchivePostcardStatus === 'cartBlocked'

  const showMobileCentralPostcardPieCartToolbar =
    mobileCentralPieDisplay === 'archive' && isCartArchivePiePostcardStatus

  const showMobileCentralPostcardPieHistoryToolbar =
    mobileCentralPieDisplay === 'archive' &&
    mobileCentralArchivePostcardStatus != null &&
    !isCartArchivePiePostcardStatus

  const canDeleteCardphotoTemplatePreview =
    cardphotoAssetData?.status === 'inLine' ||
    cardphotoAssetData?.status === 'outLine' ||
    cardphotoAssetData?.status === 'processed'

  const showMobileCentralTemplatePreviewPieToolbar =
    (mobileCentralPieDisplay === 'cardphotoTemplate' &&
      canDeleteCardphotoTemplatePreview) ||
    (mobileCentralPieDisplay === 'cardtextTemplate' &&
      mobileCardtextListTemplatePreview != null) ||
    (mobileCentralPieDisplay === 'addressTemplate' &&
      mobileAddressListTemplatePreview != null)

  const showMobileCentralAromaPreviewPieToolbar =
    mobileCentralPieDisplay === 'aromaPreview' && mobileAromaPreview != null

  const handleTemplatePreviewPieToolbarAction = useCallback(
    (key: IconKey) => {
      if (mobileCentralPieDisplay === 'aromaPreview') {
        if (key !== 'closeBig') return
        dispatch(clearViewAroma())
        return false
      }

      if (mobileCentralPieDisplay === 'addressTemplate') {
        const preview = mobileAddressListTemplatePreview
        if (!preview) return
        if (key !== 'edit' && key !== 'delete') return

        const section =
          preview.role === 'sender' ? 'senderView' : 'recipientView'

        if (preview.role === 'sender') {
          dispatch(setSenderViewId(preview.id))
        } else {
          dispatch(setRecipientViewId(preview.id))
          if (key === 'delete') {
            dispatch(
              setRecipientsPendingIds(
                recipientListPendingIds.filter((id) => id !== preview.id),
              ),
            )
          }
        }

        if (key === 'edit') {
          dispatch(closeAddressList())
        }

        dispatch(toolbarAction({ section, key }))
        return false
      }

      if (mobileCentralPieDisplay === 'cardtextTemplate') {
        if (key === 'edit') {
          dispatch(setCardtextListPanelOpen(false))
          openCardtextEditorFromView(
            dispatch,
            cardtextSession.status ?? 'inLine',
          )
          return false
        }
        if (key === 'delete') {
          dispatch(deleteCardtextFromViewRequested())
          return false
        }
        return
      }

      if (key !== 'delete') return
      if (mobileCentralPieDisplay === 'cardphotoTemplate') {
        dispatch(deleteCardphotoFromViewRequested())
        return false
      }
    },
    [
      cardtextSession.status,
      dispatch,
      mobileAddressListTemplatePreview,
      mobileCentralPieDisplay,
      recipientListPendingIds,
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
        notebookStripTab === 'cart' || notebookStripTab === 'history'
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
      if (notebookStripTab === 'cart') {
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
      })) {
        dispatch(command)
      }
    },
    [dispatch, clearMobileFactoryPeek],
  )

  const historyStripActive =
    historyListPanelOpen || notebookStripSection === 'history'

  const cartStripActive =
    cartListPanelOpen || notebookStripSection === 'cart'

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
                    onSelectPlanPie={handleSelectPlanPie}
                  />
                  <div className={styles.mobilePieStage}>
                  <div
                    className={styles.mobilePieWrap}
                    data-mobile-central-pie-mode={mobileCentralPieDisplay}
                  >
                      {mobileCentralPieDisplay === 'archive' &&
                      mobileCentralArchivePreview != null ? (
                        <CardPie
                          fillContainer
                          station="right"
                          isProcessed={false}
                          status={mobileCentralArchivePostcardStatus}
                          id={String(mobileCentralArchivePreview.localId)}
                          rightListSource={mobileCentralArchivePreview.source}
                          onListArchiveSectorClick={
                            handleRightListArchivePieSectorClick
                          }
                          onRightPieCenterClick={onArchivePieCenterClick}
                        />
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
                          <CardtextView
                            key={mobileCardtextListTemplatePreview.id}
                            contentKey={`list-preview-${mobileCardtextListTemplatePreview.id}`}
                            value={mobileCardtextListTemplatePreview.value}
                            style={mobileCardtextListTemplatePreview.style}
                          />
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
                        mobileAddressListTemplatePreview != null ? (
                        <div
                          className={styles.mobileAddressListTemplatePreview}
                          data-address-list-preview-role={
                            mobileAddressListTemplatePreview.role
                          }
                          aria-label="Selected address template preview"
                        >
                          <div className={styles.mobileAddressListTemplatePreviewLines}>
                            {mobileAddressListTemplatePreview.lines.map(
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
                      ) : mobileCentralPieDisplay === 'aromaPreview' &&
                        mobileAromaPreview != null ? (
                        <div
                          className={styles.mobileAromaPreview}
                          aria-label="Selected aroma preview"
                        >
                          <img
                            key={mobileAromaPreview.index}
                            src={mobileAromaPreview.src}
                            alt={
                              mobileAromaPreview.index === 0
                                ? ''
                                : `Aroma slot ${mobileAromaPreview.index}`
                            }
                            decoding="async"
                            draggable={false}
                          />
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
                          {...(selectedPlanPie != null
                            ? {
                                pieInner: selectedPlanPie.inner,
                                pieSections: selectedPlanPie.sections,
                              }
                            : { isProcessed: true })}
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
                            mobileCentralPieDisplay === 'addressTemplate' ||
                            mobileCentralPieDisplay === 'cardtextTemplate'
                              ? MOBILE_LIST_TEMPLATE_PREVIEW_PIE_TOOLBAR
                              : MOBILE_TEMPLATE_PREVIEW_PIE_TOOLBAR
                          }
                          stateOverride={
                            mobileCentralPieDisplay === 'addressTemplate' ||
                            mobileCentralPieDisplay === 'cardtextTemplate'
                              ? MOBILE_LIST_TEMPLATE_PREVIEW_PIE_STATE
                              : undefined
                          }
                          mergedWithCenter
                          onActionClick={handleTemplatePreviewPieToolbarAction}
                        />
                      </div>
                    ) : null}
                    {showMobileCentralAromaPreviewPieToolbar ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="editorPie"
                          groupsOverride={MOBILE_AROMA_PREVIEW_PIE_TOOLBAR}
                          stateOverride={MOBILE_AROMA_PREVIEW_PIE_STATE}
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
                        <Toolbar section="postcardPieHistory" mergedWithCenter />
                      </div>
                    ) : null}
                  </div>
                    <div className={styles.mobilePieRightSlot}>
                      <div className={styles.mobilePieRightSlotCartShell}>
                        <div className={styles.mobilePieRightSlotCartButtonFrame}>
                          {showCartSlotDateIcon || showCartSlotCartIcon ? (
                            <span
                              className={styles.mobilePieRightSlotActiveIndicatorIcon}
                              aria-hidden
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
                              cartListPanelOpen || notebookStripSection === 'cart'
                            }
                            onClick={handleCartSlotClick}
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
                        onClick={handleHistorySlotClick}
                      >
                        {showHistorySlotDateIcon || showHistorySlotHistoryIcon ? (
                          <span
                            className={styles.mobilePieRightSlotActiveIndicatorIcon}
                            aria-hidden
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

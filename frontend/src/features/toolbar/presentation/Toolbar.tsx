import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useToolbarFacade } from '../application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { selectSenderViewId, selectSenderApplied, selectIsSenderEnabled, selectSenderAddressFormData } from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientViewId,
  selectRecipientApplied,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxSender,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import {
  doesDraftMatchInList,
  isAddressDraftComplete,
  isAddressDraftEmpty,
  listStatusIsInQuickAddressBook,
} from '@envelope/domain/helpers'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'
import { getToolbarIcon } from '@shared/utils/icons'
import { IconApplyBold } from '@shared/ui/icons/IconApplyBold'
import { capitalize } from '@/shared/utils/helpers'
import {
  selectAppliedImage,
  selectCardphotoViewTemplateInList,
  selectIsCurrentCropApplied,
  selectCardphotoListSortMode,
  selectCardphotoListPanelDensity,
  selectListCardphotoBadgePulseSeq,
  selectListCardphotoBadgePulsing,
} from '@/features/cardphoto/infrastructure/selectors'
import {
  clearListCardphotoBadgePulse,
  pulseListCardphotoBadge,
} from '@/features/cardphoto/infrastructure/state'
import { getCardphotoListSortIconForMode } from '@cardphoto/application/helpers/cardphotoListSort'
import {
  getHistoryListSortIconForMode,
  isHistoryListSortIconKey,
} from '@date/application/helpers/historyListSort'
import {
  selectCardtextPlainText,
  selectCardtextListSortDirection,
  selectCardtextListPanelDensity,
  selectCardtextViewInQuickList,
  selectCardtextInteractionMode,
  selectListCardtextBadgePulseSeq,
  selectListCardtextBadgePulsing,
} from '@cardtext/infrastructure/selectors'
import {
  clearListCardtextBadgePulse,
  pulseListCardtextBadge,
} from '@cardtext/infrastructure/state'
import {
  selectDateListSortDirection,
  selectHistoryListPanelDensity,
  selectHistoryListSortMode,
  selectIsHistoryListPanelOpen,
} from '@date/calendar/infrastructure/selectors'
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '@features/auth/infrastructure/selectors/authSelectors'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import {
  selectRecipientAddressListPanelDensity,
  selectSenderAddressListPanelDensity,
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import type { ToolbarSection, ToolbarGroup, IconOptions } from '../domain/types'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import { CardtextAlignButton } from './CardtextAlignButton'
import { CardtextColorButton } from './CardtextColorButton'
import { CardphotoPrintQualitySlot } from './CardphotoPrintQualitySlot'
import { UserLoginToolbarIcon } from './UserLoginToolbarIcon'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useEnvelopeMobileAddressFocus } from '@envelope/presentation/EnvelopeMobileAddressFocusContext'
import { getApplyToolbarIconColor, getCardPieEditToolbarIconColor } from './applyToolbarIconColor'
import styles from './Toolbar.module.scss'

export const Toolbar = ({
  section,
  stateOverride,
  groupsOverride,
  onActionClick,
  mergedWithCenter = false,
  justifyGroupsEnd = false,
  layout,
  className,
}: {
  section: ToolbarSection
  stateOverride?: Record<string, unknown>
  /** Динамический набор групп/иконок (например cardphotoList sort). */
  groupsOverride?: ToolbarGroup[]
  /** Вернуть `false`, чтобы не диспатчить стандартный `toolbar/action` (например кастомная логика в панели). */
  onActionClick?: (key: IconKey) => void | false
  mergedWithCenter?: boolean
  /** Одна группа иконок — прижать к правому краю (как space-between с пустой левой группой). */
  justifyGroupsEnd?: boolean
  /** Mobile shell layouts for sectionEditorMenu / rightSidebar. */
  layout?: 'bottomBar' | 'headerBar' | 'headerStack' | 'sidebarChrome'
  className?: string
}) => {
  const {
    state: storeState,
    groups: storeGroups,
    actions: toolbarActions,
  } = useToolbarFacade(section)
  const groups = groupsOverride ?? storeGroups
  const state =
    stateOverride != null
      ? { ...storeState, ...stateOverride }
      : storeState
  const { onAction } = toolbarActions
  const dispatch = useAppDispatch()
  const { cardPieEditEngaged, exitArchiveEditToSectionPeek } =
    useRightListArchiveMini()
  const mobileAddressFocus = useEnvelopeMobileAddressFocus()

  const { fontSizeStep } = useCardtextFacade()

  const groupRef = useRef<HTMLDivElement>(null)

  const { sizeToolbarContour, sectionMenuHeight, setSectionMenuHeight } =
    useSizeFacade()

  const cardphotoApplied = useAppSelector(selectIsCurrentCropApplied)
  const listCardphotoBadgePulseSeq = useAppSelector(
    selectListCardphotoBadgePulseSeq,
  )
  const listCardphotoBadgePulsing = useAppSelector(
    selectListCardphotoBadgePulsing,
  )
  const listCardtextBadgePulseSeq = useAppSelector(
    selectListCardtextBadgePulseSeq,
  )
  const listCardtextBadgePulsing = useAppSelector(
    selectListCardtextBadgePulsing,
  )
  const cardtextPlainText = useAppSelector(selectCardtextPlainText)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionSenderAppliedIds = useAppSelector(selectSenderApplied)
  const sessionSenderViewIdForApply = useAppSelector(selectSenderViewId)
  const sessionRecipientAppliedIds = useAppSelector(selectRecipientApplied)
  const sessionRecipientViewIdForApply = useAppSelector(selectRecipientViewId)
  const sessionRecipientViewIds = useAppSelector((state: RootState) => {
    const recipient = state.recipient
    if (!recipient) return []
    return recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  })
  const senderAppliedIds = sandboxActive
    ? (sandboxSender.applied ?? [])
    : sessionSenderAppliedIds
  const senderViewIdForApply = sandboxActive
    ? sandboxSender.senderViewId
    : sessionSenderViewIdForApply
  const sessionSenderEnabled = useAppSelector(selectIsSenderEnabled)
  const sessionSenderViewDraft = useAppSelector(selectSenderAddressFormData)
  const senderEnabled = sandboxActive
    ? sandboxSender.enabled
    : sessionSenderEnabled
  const senderViewDraft = (
    sandboxActive ? sandboxSender.viewDraft : sessionSenderViewDraft
  ) as AddressFields
  /**
   * Sender toggle on + empty form: no viewId (nothing selected) or blank draft.
   * Apply must stay disabled until a complete address is selected.
   */
  const senderFormVisiblyEmpty =
    senderViewIdForApply == null || isAddressDraftEmpty(senderViewDraft)
  const senderDraftCompleteForApply = isAddressDraftComplete(senderViewDraft)
  const recipientAppliedIds = sandboxActive
    ? (sandboxRecipient.applied ?? [])
    : sessionRecipientAppliedIds
  const recipientViewIdForApply = sandboxActive
    ? sandboxRecipient.recipientViewId
    : sessionRecipientViewIdForApply
  const recipientViewIds = sandboxActive
    ? sandboxRecipient.currentRecipientsList === 'second'
      ? (sandboxRecipient.recipientsViewIdsSecondList ?? [])
      : (sandboxRecipient.recipientsViewIdsFirstList ?? [])
    : sessionRecipientViewIds
  const cardtextEmpty =
    (section === 'cardtext' || section === 'cardtextView') &&
    !(cardtextPlainText?.trim?.() ?? '').length
  const cardtextCreateFormDisplayed = useAppSelector(
    (s) => selectCardtextInteractionMode(s) === 'createEmpty',
  )

  const senderSortDirection = useAppSelector(
    (state) => state.sender?.sortOptions?.direction ?? 'asc',
  )
  const recipientSortDirection = useAppSelector(
    (state) => state.recipient?.sortOptions?.direction ?? 'asc',
  )
  const recipientsViewSortDirection = useAppSelector(
    (state) => state.recipient?.recipientsViewSortDirection ?? 'asc',
  )
  const cardtextListSortDirection = useAppSelector(
    selectCardtextListSortDirection,
  )
  const cardtextListPanelDensity = useAppSelector(
    selectCardtextListPanelDensity,
  )
  const dateListSortDirection = useAppSelector(selectDateListSortDirection)
  const historyListSortMode = useAppSelector(selectHistoryListSortMode)
  const historyListPanelDensity = useAppSelector(selectHistoryListPanelDensity)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const senderAddressListPanelDensity = useAppSelector(
    selectSenderAddressListPanelDensity,
  )
  const recipientAddressListPanelDensity = useAppSelector(
    selectRecipientAddressListPanelDensity,
  )
  const cardphotoListPanelDensity = useAppSelector(selectCardphotoListPanelDensity)
  const cardphotoListSortMode = useAppSelector(selectCardphotoListSortMode)
  const sortDirection =
    section === 'addressListSender'
      ? senderSortDirection
      : section === 'addressListRecipient' ||
          section === 'addressListRecipients'
        ? recipientSortDirection
        : section === 'recipientsView'
          ? recipientsViewSortDirection
          : section === 'cardtextList'
            ? cardtextListSortDirection
            : section === 'dateList'
              ? dateListSortDirection
              : undefined

  const sortIconDirection =
    sortDirection == null
      ? undefined
      : sortDirection === 'asc'
        ? 'desc'
        : 'asc'

  const senderViewTemplateId = useAppSelector(selectSenderViewId)
  const recipientViewTemplateId = useAppSelector(selectRecipientViewId)
  const senderTemplateInQuickList = useAppSelector(
    (s) =>
      senderViewTemplateId != null &&
      (s.addressBook?.senderEntries ?? []).some(
        (e) =>
          e.id === senderViewTemplateId &&
          listStatusIsInQuickAddressBook(e.listStatus),
      ),
  )
  const recipientTemplateInQuickList = useAppSelector(
    (s) =>
      recipientViewTemplateId != null &&
      (s.addressBook?.recipientEntries ?? []).some(
        (e) =>
          e.id === recipientViewTemplateId &&
          listStatusIsInQuickAddressBook(e.listStatus),
      ),
  )

  const senderCreateDraftInList = useAppSelector((s: RootState) => {
    const draft = s.sender?.formDraft as AddressFields | undefined
    if (!draft) return false
    const inList = (s.addressBook?.senderEntries ?? []).filter((e) =>
      listStatusIsInQuickAddressBook(e.listStatus),
    )
    return doesDraftMatchInList(draft, inList)
  })

  const recipientCreateDraftInList = useAppSelector((s: RootState) => {
    const draft = s.recipient?.formDraft as AddressFields | undefined
    if (!draft) return false
    const inList = (s.addressBook?.recipientEntries ?? []).filter((e) =>
      listStatusIsInQuickAddressBook(e.listStatus),
    )
    return doesDraftMatchInList(draft, inList)
  })

  const senderCreateDraftComplete = useAppSelector((s: RootState) => {
    if (s.sender?.currentView !== 'senderCreate') return false
    return isAddressDraftComplete(s.sender.formDraft as AddressFields)
  })

  const recipientCreateDraftComplete = useAppSelector((s: RootState) => {
    if (s.recipient?.currentView !== 'recipientCreate') return false
    return isAddressDraftComplete(s.recipient.formDraft as AddressFields)
  })

  const senderCreateFormDraft = useAppSelector((s: RootState): AddressFields | null => {
    if (s.sender?.currentView !== 'senderCreate') return null
    return { ...(s.sender.formDraft as AddressFields) }
  })

  const recipientCreateFormDraft = useAppSelector(
    (s: RootState): AddressFields | null => {
      if (s.recipient?.currentView !== 'recipientCreate') return null
      return { ...(s.recipient.formDraft as AddressFields) }
    },
  )

  const cardtextViewInQuickList = useAppSelector(selectCardtextViewInQuickList)
  const cardphotoViewTemplateInList = useAppSelector(
    selectCardphotoViewTemplateInList,
  )
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const authUser = useAppSelector(selectAuthUser)
  const { isAllComplete: editorPieComplete, progress: editorPieProgress } =
    useAppSelector(selectPieProgress)

  useEffect(() => {
    if (groupRef.current) {
      const actualHeight = groupRef.current.offsetHeight

      if (actualHeight !== sectionMenuHeight) {
        setSectionMenuHeight(actualHeight)
      }
    }
  }, [section, groups, sectionMenuHeight, setSectionMenuHeight])

  /** Same duration as addressList badge pulse (0.2s in + 0.2s out). */
  useEffect(() => {
    if (!listCardphotoBadgePulsing) return
    const id = window.setTimeout(() => {
      dispatch(clearListCardphotoBadgePulse())
    }, 400)
    return () => window.clearTimeout(id)
  }, [dispatch, listCardphotoBadgePulsing, listCardphotoBadgePulseSeq])

  useEffect(() => {
    if (!listCardtextBadgePulsing) return
    const id = window.setTimeout(() => {
      dispatch(clearListCardtextBadgePulse())
    }, 400)
    return () => window.clearTimeout(id)
  }, [dispatch, listCardtextBadgePulsing, listCardtextBadgePulseSeq])

  const sectionsWithFixedWidth = ['cardphoto']
  const toolbarStyle = sectionsWithFixedWidth.includes(section)
    ? { width: `${sizeToolbarContour.width}px` }
    : {}

  const sectionState = state as Record<
    IconKey,
    { state: IconState; options?: IconOptions } | undefined
  >
  const renderIcon = (
    key: IconKey,
    groupStatus: IconStateGroup,
    currentIconState?: IconState,
    iconOptions?: IconOptions,
    iconIndex?: number,
  ) => {
    const elementKey = iconIndex != null ? `${key}-${iconIndex}` : key
    const rawData = sectionState[key]
    // editorPie assembly: первая дырка — cart (действие addCart); вторая — delete.
    // Не применять при groupsOverride (template preview: edit/delete и т.п.).
    const editorPieCartAdd =
      groupsOverride == null &&
      section === 'editorPie' &&
      key === 'empty' &&
      iconIndex === 0
    const editorPieDelete =
      groupsOverride == null &&
      section === 'editorPie' &&
      key === 'empty' &&
      iconIndex === 1
    const templateInQuickList =
      section === 'senderView'
        ? senderTemplateInQuickList
        : section === 'recipientView'
          ? recipientTemplateInQuickList
          : false
    const createDraftInList =
      section === 'senderCreate'
        ? senderCreateDraftInList
        : section === 'recipientCreate'
          ? recipientCreateDraftInList
          : false
    const showCreateListCheck = key === 'addList' && createDraftInList
    const addressViewListStar =
      key === 'addList' &&
      (section === 'senderView' || section === 'recipientView')
    const cardtextViewListStar = key === 'addList' && section === 'cardtextView'
    const viewListStar = key === 'addList' && section === 'cardphotoView'
    const viewListStarFilled = viewListStar
      ? cardphotoViewTemplateInList
      : cardtextViewListStar
        ? cardtextViewInQuickList
        : addressViewListStar
          ? templateInQuickList
          : false
    const listStarIcon =
      viewListStar || addressViewListStar || cardtextViewListStar
    const effectiveIconKey: IconKey = editorPieCartAdd
      ? 'cart'
      : editorPieDelete
        ? 'delete'
      : showCreateListCheck
      ? 'listCheck'
      : listStarIcon
        ? viewListStarFilled
          ? 'favoriteFilled'
          : 'favorite'
      : (key === 'sortDown' || key === 'sortUp') &&
          section === 'cardphotoList'
        ? getCardphotoListSortIconForMode(cardphotoListSortMode)
        : section === 'historyList' &&
            (isHistoryListSortIconKey(key) ||
              key === 'sortDown' ||
              key === 'sortUp')
          ? getHistoryListSortIconForMode(historyListSortMode)
          : key === 'sortAZDown' &&
            (section === 'cardtextList' ||
              section === 'addressListSender' ||
              section === 'addressListRecipient' ||
              section === 'addressListRecipients')
          ? (section === 'cardtextList'
              ? cardtextListSortDirection
              : section === 'addressListSender'
                ? senderSortDirection
                : recipientSortDirection) === 'asc'
            ? 'sortAZDown'
            : 'sortAZUp'
          : key
    /** Visual remaps (e.g. cart glyph) must still fire the real action key. */
    const actionIconKey: IconKey = editorPieCartAdd
      ? 'addCart'
      : listStarIcon
        ? viewListStarFilled
          ? 'removeFromList'
          : 'addList'
      : effectiveIconKey
    const options =
      rawData && typeof rawData === 'object' && 'options' in rawData
        ? rawData.options
        : undefined
    const mergedOptions = { ...iconOptions, ...options }

    const buttonState = typeof rawData === 'string' ? rawData : rawData?.state
    /**
     * groupsOverride owns icon states (e.g. archive envelope sandbox).
     * Otherwise store section state wins over the static config default.
     */
    let buttonStatus =
      groupsOverride != null
        ? (currentIconState ?? buttonState)
        : (buttonState ?? currentIconState)

    if (
      key === 'addList' &&
      (section === 'senderView' ||
        section === 'recipientView' ||
        section === 'cardtextView' ||
        section === 'cardphotoView') &&
      (section === 'cardtextView'
        ? cardtextViewInQuickList
        : section === 'cardphotoView'
          ? cardphotoViewTemplateInList
          : templateInQuickList)
    ) {
      buttonStatus =
        section === 'cardphotoView' ||
        section === 'cardtextView' ||
        section === 'senderView' ||
        section === 'recipientView'
          ? 'active'
          : 'enabled'
    }

    if (key === 'apply' && section === 'cardtext') {
      if (cardtextCreateFormDisplayed) {
        buttonStatus = 'disabled'
      } else if (cardtextEmpty) {
        buttonStatus = 'disabled'
      }
    }
    if (key === 'apply' && section === 'cardtextView' && cardtextEmpty) {
      buttonStatus = 'disabled'
    }
    if (key === 'apply' && buttonStatus !== 'disabled') {
      /**
       * Green Apply only on main sender/recipients toolbar.
       * List chrome (groupsOverride) and cardtext/cardphoto/aroma never green.
       */
      if (
        groupsOverride != null ||
        section === 'cardtext' ||
        section === 'cardtextView' ||
        section === 'cardphoto' ||
        section === 'cardphotoView' ||
        section === 'cardphotoProcessed' ||
        section === 'aroma'
      ) {
        buttonStatus = 'enabled'
      } else {
        const recipientsMultiApplyMatches =
          recipientViewIds.length > 0 &&
          recipientAppliedIds.length === recipientViewIds.length &&
          recipientAppliedIds.length > 0 &&
          recipientAppliedIds.every((id) => recipientViewIds.includes(id)) &&
          recipientViewIds.every((id) => recipientAppliedIds.includes(id))
        const recipientSingleApplyMatches =
          recipientViewIds.length === 0 &&
          recipientViewIdForApply != null &&
          recipientAppliedIds.length === 1 &&
          recipientAppliedIds[0] === recipientViewIdForApply
        const senderApplyMatches =
          senderViewIdForApply != null &&
          senderAppliedIds.length === 1 &&
          senderAppliedIds[0] === senderViewIdForApply
        const applyMatchesPostcard =
          section === 'sender'
            ? senderApplyMatches
            : section === 'recipients'
              ? recipientsMultiApplyMatches || recipientSingleApplyMatches
              : false

        buttonStatus = applyMatchesPostcard ? 'selected' : 'enabled'
      }
    }
    /**
     * Sender toggle on: Apply only with selected + complete address.
     * Empty form (no viewId / blank draft) → disabled — overrides force-enabled above.
     */
    if (key === 'apply' && section === 'sender' && senderEnabled) {
      if (
        senderFormVisiblyEmpty ||
        !senderDraftCompleteForApply ||
        senderViewIdForApply == null
      ) {
        buttonStatus = 'disabled'
      }
    }
    if (key === 'edit' && section === 'senderView' && senderViewEditMode) {
      buttonStatus = 'active'
    }
    if (key === 'edit' && section === 'recipientView' && recipientViewEditMode) {
      buttonStatus = 'active'
    }
    if (key === 'applyMedium' && section === 'senderCreate') {
      buttonStatus =
        senderCreateDraftInList || !senderCreateDraftComplete
          ? 'disabled'
          : 'enabled'
    }
    if (key === 'applyMedium' && section === 'recipientCreate') {
      buttonStatus =
        recipientCreateDraftInList || !recipientCreateDraftComplete
          ? 'disabled'
          : 'enabled'
    }
    if (editorPieCartAdd && !editorPieComplete) {
      buttonStatus = 'disabled'
    }
    if (editorPieDelete && editorPieProgress === 0) {
      buttonStatus = 'disabled'
    }
    const badgeFromState =
      mergedOptions?.badge ?? (rawData as any)?.options?.badge
    /**
     * editorPie cart: `+` badge (glyph is cart, action still addCart).
     * Duplicate create draft: applyMedium stays disabled (no `!` badge).
     */
    const badge = editorPieCartAdd ? '+' : badgeFromState
    const hasBadge =
      badge != null &&
      (typeof badge === 'number' || typeof badge === 'string') &&
      String(badge).trim().length > 0
    const badgeIsPlusGlyph = editorPieCartAdd

    const badgeDot =
      mergedOptions?.badgeDot ?? (rawData as any)?.options?.badgeDot

    const applyIconColor =
      effectiveIconKey === 'apply'
        ? getApplyToolbarIconColor(buttonStatus)
        : undefined
    const cardPieEditIconColor =
      section === 'postcardPieCart' && effectiveIconKey === 'editLight'
        ? getCardPieEditToolbarIconColor(buttonStatus)
        : undefined
    const forcedIconColor = applyIconColor ?? cardPieEditIconColor

    const visualStatus =
      (section === 'cardtext' ||
        section === 'cardtextEditor' ||
        section === 'cardtextCreate') &&
      key === 'left'
        ? 'enabled'
        : buttonStatus

    const addressListBadgePulseSide =
      key === 'addressList' && section === 'sender'
        ? 'sender'
        : key === 'addressList' && section === 'recipients'
          ? 'recipient'
          : null
    const addressListBadgePulsing =
      addressListBadgePulseSide != null &&
      mobileAddressFocus?.addressListBadgePulseSide ===
        addressListBadgePulseSide &&
      mobileAddressFocus.addressListBadgePulseSeq > 0
    const listCardphotoBadgePulseActive =
      key === 'listCardphoto' && listCardphotoBadgePulsing
    const listCardtextBadgePulseActive =
      key === 'listCardtext' && listCardtextBadgePulsing
    const badgePulsing =
      addressListBadgePulsing ||
      listCardphotoBadgePulseActive ||
      listCardtextBadgePulseActive
    const badgePulseKey = addressListBadgePulsing
      ? `badge-pulse-${mobileAddressFocus?.addressListBadgePulseSeq}`
      : listCardphotoBadgePulseActive
        ? `badge-pulse-listCardphoto-${listCardphotoBadgePulseSeq}`
        : listCardtextBadgePulseActive
          ? `badge-pulse-listCardtext-${listCardtextBadgePulseSeq}`
          : undefined

    if (
      (section === 'cardtextEditor' || section === 'cardtextCreate') &&
      key === 'colorPicker'
    ) {
      return (
        <CardtextColorButton
          key={elementKey}
          className={clsx(
            styles.toolbarKey,
            styles[`toolbarKey${capitalize(buttonStatus ?? 'enabled')}`],
            styles[`toolbarKey${capitalize(key)}`],
            styles[
              `toolbarKey${capitalize(key)}${capitalize(
                buttonStatus ?? 'enabled',
              )}`
            ],
            groupStatus === 'disabled' && styles.toolbarKeyDisabled,
          )}
          disabled={groupStatus === 'disabled' || buttonStatus === 'disabled'}
        />
      )
    }

    if (
      (section === 'cardtext' ||
        section === 'cardtextEditor' ||
        section === 'cardtextCreate') &&
      key === 'left'
    ) {
      return (
        <CardtextAlignButton
          key={elementKey}
          className={clsx(
            styles.toolbarKey,
            styles[`toolbarKey${capitalize(visualStatus ?? 'enabled')}`],
            styles[`toolbarKey${capitalize(key)}`],
            styles[
              `toolbarKey${capitalize(key)}${capitalize(
                visualStatus ?? 'enabled',
              )}`
            ],
            groupStatus === 'disabled' && styles.toolbarKeyDisabled,
          )}
          disabled={groupStatus === 'disabled'}
        />
      )
    }

    if (section === 'cardphotoCreate' && key === 'cropQualityIndicator') {
      const indicatorDisabled =
        groupStatus === 'disabled' || buttonStatus === 'disabled'

      return (
        <div
          key={elementKey}
          className={clsx(
            styles.toolbarKey,
            styles.toolbarKeyCropQualityIndicator,
            styles[`toolbarKey${capitalize(buttonStatus ?? 'enabled')}`],
            groupStatus === 'disabled' && styles.toolbarKeyDisabled,
          )}
          data-icon-key={key}
          data-icon-state={buttonStatus}
          aria-hidden
        >
          <CardphotoPrintQualitySlot disabled={indicatorDisabled} />
        </div>
      )
    }

    return (
      <button
        key={elementKey}
        type="button"
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${capitalize(buttonStatus ?? 'enabled')}`],
          styles[`toolbarKey${capitalize(effectiveIconKey)}`],
          styles[
            `toolbarKey${capitalize(effectiveIconKey)}${capitalize(
              buttonStatus ?? 'enabled',
            )}`
          ],
          effectiveIconKey === 'favoriteFilled' &&
            buttonStatus === 'active' &&
            styles.toolbarKeyFavoriteActive,
          groupStatus === 'disabled' && styles.toolbarKeyDisabled,
        )}
        style={forcedIconColor != null ? { color: forcedIconColor } : undefined}
        data-icon-key={effectiveIconKey}
        data-icon-state={buttonStatus}
        disabled={buttonStatus === 'disabled' || groupStatus === 'disabled'}
        onPointerDown={(e) => {
          /** Touch + open keyboard: act on pointerdown before viewport reflow steals the tap. */
          if (e.pointerType === 'mouse' && e.button !== 0) return
          if (groupStatus === 'disabled' || buttonStatus === 'disabled') {
            e.preventDefault()
            return
          }

          e.preventDefault()
          if (
            (key === 'addList' || key === 'removeFromList') &&
            (section === 'senderView' || section === 'recipientView')
          ) {
            mobileAddressFocus?.triggerAddressListBadgePulse(
              section === 'senderView' ? 'sender' : 'recipient',
            )
          }
          if (
            (key === 'addList' || key === 'removeFromList') &&
            section === 'cardphotoView'
          ) {
            dispatch(pulseListCardphotoBadge())
          }
          if (
            (key === 'addList' || key === 'removeFromList') &&
            section === 'cardtextView'
          ) {
            dispatch(pulseListCardtextBadge())
          }
          const stopDefault = onActionClick?.(actionIconKey)
          if (stopDefault !== false) {
            const actionPayload =
              actionIconKey === 'applyMedium' && section === 'senderCreate'
                ? { draft: senderCreateFormDraft ?? undefined }
                : actionIconKey === 'applyMedium' &&
                    section === 'recipientCreate'
                  ? { draft: recipientCreateFormDraft ?? undefined }
                  : undefined
            onAction(actionIconKey, actionPayload)
            /** Apply в archive-edit → сразу упрощённый peek (saga допишет applied). */
            if (
              actionIconKey === 'apply' &&
              (section === 'cardtext' ||
                section === 'cardtextView' ||
                section === 'cardphoto' ||
                section === 'cardphotoView' ||
                section === 'cardphotoProcessed' ||
                section === 'aroma') &&
              cardPieEditEngaged &&
              exitArchiveEditToSectionPeek != null
            ) {
              exitArchiveEditToSectionPeek(
                section === 'cardphoto' ||
                  section === 'cardphotoView' ||
                  section === 'cardphotoProcessed'
                  ? 'cardphoto'
                  : section === 'aroma'
                    ? 'aroma'
                    : 'cardtext',
              )
            }
          }
          e.currentTarget.blur()
        }}
      >
        {section === 'rightSidebar' &&
        key === 'userLogin' &&
        isAuthenticated &&
        authUser != null ? (
          <UserLoginToolbarIcon
            userId={authUser.id}
            passportColors={authUser.passportColors}
            passportEmblemForm={authUser.passportEmblemForm}
          />
        ) : effectiveIconKey === 'apply' ? (
          <IconApplyBold style={{ color: applyIconColor }} />
        ) : (
          getToolbarIcon({
            key:
              historyListPanelOpen &&
              (section === 'rightSidebar' || section === 'history') &&
              effectiveIconKey === 'history'
                ? 'historyV2'
                : (effectiveIconKey as IconKey),
            checkBoxChecked:
              section === 'cartList' &&
              effectiveIconKey === 'checkBox' &&
              buttonStatus === 'active',
            listCheckTickChecked: showCreateListCheck,
            step: fontSizeStep,
            sortDirection: key === 'sortDown' ? sortIconDirection : undefined,
            listTemplateDensityCols: undefined,
            historyPanelDensitySize:
              section === 'historyList' && key === 'historyPanelDensity'
                ? historyListPanelDensity
                : undefined,
            panelDensity2Size:
              section === 'historyList' && key === 'panelDensity2'
                ? historyListPanelDensity
                : section === 'cardtextList' && key === 'panelDensity2'
                  ? cardtextListPanelDensity
                  : section === 'cardphotoList' && key === 'panelDensity2'
                    ? cardphotoListPanelDensity
                    : section === 'addressListSender' && key === 'panelDensity2'
                      ? senderAddressListPanelDensity
                      : (section === 'addressListRecipient' ||
                            section === 'addressListRecipients') &&
                          key === 'panelDensity2'
                        ? recipientAddressListPanelDensity
                        : undefined,
          })
        )}

        {hasBadge && (
          <span
            className={clsx(
              styles.toolbarBadge,
              badgeIsPlusGlyph && styles.toolbarBadgePlus,
              badgePulsing && styles.toolbarBadgePulse,
            )}
            key={badgePulseKey}
          >
            <span className={styles.toolbarBadgeValue}>{badge}</span>
          </span>
        )}
        {Boolean(badgeDot) && (
          <span
            className={styles.toolbarBadgeDot}
            title="Return to unsaved address"
          />
        )}
      </button>
    )
  }

  return (
    <div
      className={clsx(
        styles.toolbar,
        styles[`toolbar${capitalize(section)}`],
        layout === 'bottomBar' &&
          section === 'sectionEditorMenu' &&
          styles.toolbarSectionEditorMenuBottomBar,
        layout === 'sidebarChrome' &&
          section === 'sectionEditorMenu' &&
          styles.toolbarSectionEditorMenuSidebarChrome,
        layout === 'headerBar' &&
          section === 'rightSidebar' &&
          styles.toolbarRightSidebarHeaderBar,
        layout === 'headerStack' &&
          section === 'rightSidebar' &&
          styles.toolbarRightSidebarHeaderStack,
        mergedWithCenter && styles.toolbarMergedWithCenter,
        justifyGroupsEnd && styles.toolbarGroupsJustifyEnd,
        className,
      )}
      style={toolbarStyle}
    >
      {groups.map((group: ToolbarGroup, idx) => (
        <div
          key={`${group.group}-${idx}`}
          ref={section === 'sectionEditorMenu' ? groupRef : undefined}
          className={clsx(
            styles.toolbarGroup,
            styles[`toolbarGroup${capitalize(group.group)}`],
            group.status === 'disabled' && styles.toolbarGroupDisabled,
          )}
        >
          {group.icons.map((icon, iconIdx) =>
            renderIcon(
              icon.key,
              group.status,
              icon.state,
              icon.options,
              iconIdx,
            ),
          )}
        </div>
      ))}
    </div>
  )
}

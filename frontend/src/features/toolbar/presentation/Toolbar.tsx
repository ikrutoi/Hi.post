import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useToolbarFacade } from '../application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { selectSenderViewId, selectSenderApplied } from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientViewId,
  selectRecipientApplied,
} from '@envelope/recipient/infrastructure/selectors'
import { selectAromaApplyMatches } from '@aroma/infrastructure/selectors'
import {
  doesDraftMatchInList,
  doesDraftMatchAnyTemplate,
  isAddressDraftComplete,
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
} from '@/features/cardphoto/infrastructure/selectors'
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
} from '@cardtext/infrastructure/selectors'
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
  const { cardPieEditEngaged, exitArchiveEditToSectionPeek } =
    useRightListArchiveMini()

  const { fontSizeStep } = useCardtextFacade()

  const groupRef = useRef<HTMLDivElement>(null)

  const { sizeToolbarContour, sectionMenuHeight, setSectionMenuHeight } =
    useSizeFacade()

  const cardphotoApplied = useAppSelector(selectIsCurrentCropApplied)
  const cardtextPlainText = useAppSelector(selectCardtextPlainText)
  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const senderViewIdForApply = useAppSelector(selectSenderViewId)
  const recipientAppliedIds = useAppSelector(selectRecipientApplied)
  const recipientViewIdForApply = useAppSelector(selectRecipientViewId)
  const recipientViewIds = useAppSelector((state: RootState) => {
    const recipient = state.recipient
    if (!recipient) return []
    return recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  })
  const aromaApplyMatches = useAppSelector(selectAromaApplyMatches)
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

  const senderCreateDraftDuplicate = useAppSelector((s: RootState) => {
    if (s.sender?.currentView !== 'senderCreate') return false
    const draft = s.sender.formDraft as AddressFields
    return doesDraftMatchAnyTemplate(
      draft,
      s.addressBook?.senderEntries ?? [],
    )
  })

  const recipientCreateDraftDuplicate = useAppSelector((s: RootState) => {
    if (s.recipient?.currentView !== 'recipientCreate') return false
    const draft = s.recipient.formDraft as AddressFields
    return doesDraftMatchAnyTemplate(
      draft,
      s.addressBook?.recipientEntries ?? [],
    )
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
    // editorPie assembly: первая дырка — addCart; третья — delete.
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
      iconIndex === 2
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
    const showApplyMediumCheck =
      key === 'applyMedium' &&
      (section === 'senderCreate' || section === 'recipientCreate') &&
      createDraftInList
    const effectiveIconKey: IconKey = editorPieCartAdd
      ? 'addCart'
      : editorPieDelete
        ? 'delete'
      : showCreateListCheck
      ? 'listCheck'
      : showApplyMediumCheck
        ? 'applyMediumCheck'
      : key === 'addList' &&
          (section === 'senderView' ||
            section === 'recipientView' ||
            section === 'cardtextView' ||
            section === 'cardphotoView') &&
          (section === 'cardtextView'
            ? cardtextViewInQuickList
            : section === 'cardphotoView'
              ? cardphotoViewTemplateInList
              : templateInQuickList)
        ? 'removeFromList'
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
    const options =
      rawData && typeof rawData === 'object' && 'options' in rawData
        ? rawData.options
        : undefined
    const mergedOptions = { ...iconOptions, ...options }

    const buttonState = typeof rawData === 'string' ? rawData : rawData?.state
    let buttonStatus = buttonState ?? currentIconState

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
      buttonStatus = 'enabled'
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
      /** cardtext: Apply не зелёный — подтверждение уходит в упрощённый peek. */
      if (section === 'cardtext' || section === 'cardtextView') {
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
          section === 'cardphoto' ||
          section === 'cardphotoView' ||
          section === 'cardphotoProcessed'
            ? cardphotoApplied
            : section === 'aroma'
              ? aromaApplyMatches
              : section === 'sender'
                ? senderApplyMatches
                : section === 'recipients'
                  ? recipientsMultiApplyMatches || recipientSingleApplyMatches
                  : false

        buttonStatus = applyMatchesPostcard ? 'selected' : 'enabled'
      }
    }
    if (key === 'edit' && section === 'senderView' && senderViewEditMode) {
      buttonStatus = 'active'
    }
    if (key === 'edit' && section === 'recipientView' && recipientViewEditMode) {
      buttonStatus = 'active'
    }
    if (key === 'applyMedium' && section === 'senderCreate') {
      buttonStatus = senderCreateDraftInList
        ? 'disabled'
        : senderCreateDraftComplete && !senderCreateDraftDuplicate
          ? 'enabled'
          : 'disabled'
    }
    if (key === 'applyMedium' && section === 'recipientCreate') {
      buttonStatus = recipientCreateDraftInList
        ? 'disabled'
        : recipientCreateDraftComplete && !recipientCreateDraftDuplicate
          ? 'enabled'
          : 'disabled'
    }
    if (editorPieCartAdd && !editorPieComplete) {
      buttonStatus = 'disabled'
    }
    if (editorPieDelete && editorPieProgress === 0) {
      buttonStatus = 'disabled'
    }
    const badge = mergedOptions?.badge ?? (rawData as any)?.options?.badge
    const hasBadge =
      badge != null &&
      (typeof badge === 'number' || typeof badge === 'string') &&
      String(badge).trim().length > 0

    const badgeDot =
      mergedOptions?.badgeDot ?? (rawData as any)?.options?.badgeDot

    const applyIconColor =
      effectiveIconKey === 'apply'
        ? getApplyToolbarIconColor(buttonStatus)
        : undefined
    const cardPieEditIconColor =
      section === 'postcardPieCart' && effectiveIconKey === 'cardPieEdit'
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
          groupStatus === 'disabled' && styles.toolbarKeyDisabled,
        )}
        style={forcedIconColor != null ? { color: forcedIconColor } : undefined}
        data-icon-key={effectiveIconKey}
        data-icon-state={buttonStatus}
        disabled={buttonStatus === 'disabled' || groupStatus === 'disabled'}
        onMouseDown={(e) => {
          if (groupStatus === 'disabled' || buttonStatus === 'disabled') {
            e.preventDefault()
            return
          }

          e.preventDefault()
          const stopDefault = onActionClick?.(effectiveIconKey as IconKey)
          if (stopDefault !== false) {
            const actionPayload =
              effectiveIconKey === 'applyMedium' && section === 'senderCreate'
                ? { draft: senderCreateFormDraft ?? undefined }
                : effectiveIconKey === 'applyMedium' &&
                    section === 'recipientCreate'
                  ? { draft: recipientCreateFormDraft ?? undefined }
                  : undefined
            onAction(effectiveIconKey as IconKey, actionPayload)
            /** cardtext Apply в archive-edit → сразу упрощённый peek (saga допишет applied). */
            if (
              effectiveIconKey === 'apply' &&
              (section === 'cardtext' || section === 'cardtextView') &&
              cardPieEditEngaged &&
              exitArchiveEditToSectionPeek != null
            ) {
              exitArchiveEditToSectionPeek('cardtext')
            }
          }
          e.currentTarget.blur()
        }}
        onPointerUp={(event) => {
          event.currentTarget.blur()
        }}
      >
        {section === 'rightSidebar' &&
        key === 'userLogin' &&
        isAuthenticated &&
        authUser != null ? (
          <UserLoginToolbarIcon
            userId={authUser.id}
            passportColors={authUser.passportColors}
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
          <span className={styles.toolbarBadge}>
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

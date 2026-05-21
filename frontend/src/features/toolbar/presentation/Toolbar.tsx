import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useToolbarFacade } from '../application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { selectCardPieCopyStripExpanded } from '@cart/infrastructure/selectors'
import { selectSenderViewId } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientViewId } from '@envelope/recipient/infrastructure/selectors'
import {
  doesDraftMatchInList,
  listStatusIsInQuickAddressBook,
} from '@envelope/domain/helpers'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'
import { getToolbarIcon } from '@shared/utils/icons'
import { capitalize } from '@/shared/utils/helpers'
import {
  selectAppliedImage,
  selectIsCurrentCropApplied,
  selectActiveImage,
  selectCardphotoListTemplateGridCols,
} from '@/features/cardphoto/infrastructure/selectors'
import {
  selectCardtextAssetMatchesApplied,
  selectCardtextIsComplete,
  selectCardtextPlainText,
  selectCardtextListSortDirection,
  selectCardtextListPanelDensity,
  selectCardtextViewInQuickList,
} from '@cardtext/infrastructure/selectors'
import {
  selectDateListSortDirection,
  selectHistoryListPanelDensity,
  selectHistoryListSortDirection,
} from '@date/calendar/infrastructure/selectors'
import {
  selectRecipientAddressListPanelDensity,
  selectSenderAddressListPanelDensity,
} from '@envelope/infrastructure/selectors'
import type { ToolbarSection, ToolbarGroup, IconOptions } from '../domain/types'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import { CardtextAlignButton } from './CardtextAlignButton'
import { CardtextColorButton } from './CardtextColorButton'
import { CropQualityDots } from './CropQualityDots'
import styles from './Toolbar.module.scss'

export const Toolbar = ({
  section,
  stateOverride,
  onActionClick,
  mergedWithCenter = false,
}: {
  section: ToolbarSection
  stateOverride?: Record<string, unknown>
  /** Вернуть `false`, чтобы не диспатчить стандартный `toolbar/action` (например кастомная логика в панели). */
  onActionClick?: (key: IconKey) => void | false
  mergedWithCenter?: boolean
}) => {
  const {
    state: storeState,
    groups,
    actions: toolbarActions,
  } = useToolbarFacade(section)
  const state =
    stateOverride != null
      ? { ...storeState, ...stateOverride }
      : storeState
  const { onAction } = toolbarActions

  const { fontSizeStep } = useCardtextFacade()

  const groupRef = useRef<HTMLDivElement>(null)

  const { sizeToolbarContour, sectionMenuHeight, setSectionMenuHeight } =
    useSizeFacade()

  const cardphotoApplied = useAppSelector(selectIsCurrentCropApplied)
  const cardtextApplied = useAppSelector(selectCardtextIsComplete)
  const cardtextAssetMatchesApplied = useAppSelector(
    selectCardtextAssetMatchesApplied,
  )
  const cardtextPlainText = useAppSelector(selectCardtextPlainText)
  const cardphotoActiveImage = useAppSelector(selectActiveImage)
  const cardphotoFavorite = cardphotoActiveImage?.favorite === true
  const isCardtextCurrentTemplateApplied = cardtextAssetMatchesApplied
  const isAlreadyApplied =
    section === 'cardtext' || section === 'cardtextView'
      ? cardtextApplied
      : cardphotoApplied
  const appliedStatus = isAlreadyApplied ? 'disabled' : 'enabled'
  const cardtextEmpty =
    (section === 'cardtext' || section === 'cardtextView') &&
    !(cardtextPlainText?.trim?.() ?? '').length

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
  const historyListSortDirection = useAppSelector(selectHistoryListSortDirection)
  const historyListPanelDensity = useAppSelector(selectHistoryListPanelDensity)
  const senderAddressListPanelDensity = useAppSelector(
    selectSenderAddressListPanelDensity,
  )
  const recipientAddressListPanelDensity = useAppSelector(
    selectRecipientAddressListPanelDensity,
  )
  const cardphotoListTemplateGridCols = useAppSelector(
    selectCardphotoListTemplateGridCols,
  )
  const sortDirection =
    section === 'addressListSender'
      ? senderSortDirection
      : section === 'addressListRecipient'
        ? recipientSortDirection
        : section === 'recipientsView'
          ? recipientsViewSortDirection
          : section === 'cardtextList'
            ? cardtextListSortDirection
            : section === 'dateList'
              ? dateListSortDirection
              : section === 'historyList'
                ? historyListSortDirection
                : undefined

  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
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

  const cardtextViewInQuickList = useAppSelector(selectCardtextViewInQuickList)

  const sectionEditorMenuLockedByCardPieCopy =
    section === 'sectionEditorMenu' && cardPieCopyStripExpanded

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
  ) => {
    const rawData = sectionState[key]
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
    const effectiveIconKey: IconKey = showCreateListCheck
      ? 'listCheck'
      : key === 'addList' &&
          (section === 'senderView' ||
            section === 'recipientView' ||
            section === 'cardtextView') &&
          (section === 'cardtextView'
            ? cardtextViewInQuickList
            : templateInQuickList)
        ? 'removeFromList'
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
        section === 'cardtextView') &&
      (section === 'cardtextView' ? cardtextViewInQuickList : templateInQuickList)
    ) {
      buttonStatus = 'enabled'
    }

    if (key === 'apply' && section === 'cardphoto') {
      buttonStatus = isAlreadyApplied ? 'selected' : buttonStatus
    }
    if (key === 'apply' && section === 'cardtext') {
      if (cardtextEmpty) {
        buttonStatus = 'disabled'
      } else if (isCardtextCurrentTemplateApplied) {
        buttonStatus = 'selected'
      } else {
        buttonStatus = 'enabled'
      }
    }
    if (key === 'apply' && section === 'cardtextView') {
      if (cardtextEmpty) {
        buttonStatus = 'disabled'
      } else if (isCardtextCurrentTemplateApplied) {
        buttonStatus = 'selected'
      } else {
        buttonStatus = 'enabled'
      }
    }
    if (
      section === 'cardphotoView' &&
      key === 'favorite' &&
      cardphotoFavorite
    ) {
      buttonStatus = 'active'
    }

    const badge = mergedOptions?.badge ?? (rawData as any)?.options?.badge
    const hasBadge =
      badge != null &&
      (typeof badge === 'number' || typeof badge === 'string') &&
      String(badge).trim().length > 0

    const badgeDot =
      mergedOptions?.badgeDot ?? (rawData as any)?.options?.badgeDot

    const visualStatus =
      (section === 'cardtext' ||
        section === 'cardtextEditor' ||
        section === 'cardtextCreate') &&
      key === 'left'
        ? 'enabled'
        : buttonStatus

    if (
      (section === 'cardphotoProcessed' || section === 'cardphotoCreate') &&
      key === 'cropQualityIndicator'
    ) {
      const qualityDisabled =
        groupStatus === 'disabled' || buttonStatus === 'disabled'
      return (
        <div
          key={key}
          className={clsx(
            styles.toolbarKey,
            styles.toolbarKeyCropQualityIndicator,
            styles[`toolbarKey${capitalize(key)}`],
            styles[
              `toolbarKey${capitalize(key)}${capitalize(
                buttonStatus ?? 'enabled',
              )}`
            ],
            qualityDisabled && styles.toolbarKeyDisabled,
          )}
          aria-disabled={qualityDisabled}
        >
          <CropQualityDots disabled={qualityDisabled} />
        </div>
      )
    }

    if (
      (section === 'cardtextEditor' || section === 'cardtextCreate') &&
      key === 'colorPicker'
    ) {
      return (
        <CardtextColorButton
          key={key}
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
          key={key}
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

    return (
      <button
        key={key}
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
        data-icon-key={effectiveIconKey}
        data-icon-state={buttonStatus}
        disabled={buttonStatus === 'disabled' || groupStatus === 'disabled'}
        onMouseDown={(e) => {
          if (
            sectionEditorMenuLockedByCardPieCopy ||
            groupStatus === 'disabled' ||
            buttonStatus === 'disabled'
          ) {
            e.preventDefault()
            return
          }

          e.preventDefault()
          const stopDefault = onActionClick?.(effectiveIconKey as IconKey)
          if (stopDefault !== false) {
            onAction(effectiveIconKey as IconKey)
          }
        }}
      >
        {getToolbarIcon({
          key: effectiveIconKey as IconKey,
          checkBoxChecked:
            section === 'cartList' &&
            effectiveIconKey === 'checkBox' &&
            buttonStatus === 'active',
          listCheckTickChecked: showCreateListCheck,
          step: fontSizeStep,
          sortDirection: key === 'sortDown' ? sortDirection : undefined,
          listTemplateDensityCols:
            section === 'cardphotoList' && key === 'density'
              ? cardphotoListTemplateGridCols
              : undefined,
          historyPanelDensitySize:
            section === 'historyList' && key === 'historyPanelDensity'
              ? historyListPanelDensity
              : undefined,
          panelDensity2Size:
            section === 'historyList' && key === 'panelDensity2'
              ? historyListPanelDensity
              : section === 'cardtextList' && key === 'panelDensity2'
                ? cardtextListPanelDensity
              : section === 'addressListSender' && key === 'panelDensity2'
              ? senderAddressListPanelDensity
              : (section === 'addressListRecipient' ||
                    section === 'addressListRecipients') &&
                  key === 'panelDensity2'
                ? recipientAddressListPanelDensity
                : undefined,
        })}

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
        mergedWithCenter && styles.toolbarMergedWithCenter,
        sectionEditorMenuLockedByCardPieCopy &&
          styles.toolbarSectionEditorMenuCardPieCopyLocked,
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
          {group.icons.map((icon) =>
            renderIcon(icon.key, group.status, icon.state, icon.options),
          )}
        </div>
      ))}
    </div>
  )
}

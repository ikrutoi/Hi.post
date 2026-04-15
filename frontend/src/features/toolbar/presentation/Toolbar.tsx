import React, { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useToolbarFacade } from '../application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
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
  selectCardtextFavorite,
  selectCardtextListSortDirection,
} from '@cardtext/infrastructure/selectors'
import { selectDateListSortDirection } from '@date/calendar/infrastructure/selectors'
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
}: {
  section: ToolbarSection
  stateOverride?: Record<string, unknown>
}) => {
  const {
    state: storeState,
    groups,
    actions: toolbarActions,
  } = useToolbarFacade(section)
  const state = stateOverride ?? storeState
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
  const cardtextFavorite = useAppSelector(selectCardtextFavorite)
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
  const dateListSortDirection = useAppSelector(selectDateListSortDirection)
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
              : undefined

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
    const options =
      rawData && typeof rawData === 'object' && 'options' in rawData
        ? rawData.options
        : undefined
    const mergedOptions = { ...iconOptions, ...options }

    const buttonState = typeof rawData === 'string' ? rawData : rawData?.state
    let buttonStatus = buttonState ?? currentIconState

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
    if (section === 'cardtextView' && key === 'favorite' && cardtextFavorite) {
      buttonStatus = 'active'
    }
    if (
      section === 'cardphotoView' &&
      key === 'favorite' &&
      cardphotoFavorite
    ) {
      buttonStatus = 'active'
    }

    const badge = mergedOptions?.badge ?? (rawData as any)?.options?.badge
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
          styles[`toolbarKey${capitalize(key)}`],
          styles[
            `toolbarKey${capitalize(key)}${capitalize(
              buttonStatus ?? 'enabled',
            )}`
          ],
          groupStatus === 'disabled' && styles.toolbarKeyDisabled,
        )}
        data-icon-key={key}
        data-icon-state={buttonStatus}
        disabled={buttonStatus === 'disabled' || groupStatus === 'disabled'}
        onMouseDown={(e) => {
          if (groupStatus === 'disabled' || buttonStatus === 'disabled') {
            e.preventDefault()
            return
          }

          e.preventDefault()
          onAction(key as IconKey)
        }}
      >
        {getToolbarIcon({
          key: key as IconKey,
          step: fontSizeStep,
          sortDirection: key === 'sortDown' ? sortDirection : undefined,
          listTemplateDensityCols:
            section === 'cardphotoList' && key === 'density'
              ? cardphotoListTemplateGridCols
              : undefined,
        })}

        {Boolean(badge && badge > 0) && (
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
      className={clsx(styles.toolbar, styles[`toolbar${capitalize(section)}`])}
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

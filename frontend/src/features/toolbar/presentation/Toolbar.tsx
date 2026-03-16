import React, { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CropPreview } from './CropPreview'
import { useToolbarFacade } from '../application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useCardtextTemplates } from '@entities/templates/application/hooks/useTemplates'
import { updateToolbarIcon } from '../infrastructure/state'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { getToolbarIcon } from '@shared/utils/icons'
import { capitalize } from '@/shared/utils/helpers'
import {
  selectAppliedImage,
  selectIsCurrentCropApplied,
} from '@/features/cardphoto/infrastructure/selectors'
import {
  selectCardtextIsComplete,
  selectCardtextPlainText,
  selectCardtextFavorite,
  selectCardtextListSortDirection,
  selectCardtextAssetId,
  selectCardtextApplied,
} from '@cardtext/infrastructure/selectors'
import type { ToolbarSection, ToolbarGroup, IconOptions } from '../domain/types'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import { LayoutOrientation } from '@layout/domain/types'
import { CardtextAlignButton } from './CardtextAlignButton'
import styles from './Toolbar.module.scss'

export const Toolbar = ({
  section,
  stateOverride,
}: {
  section: ToolbarSection
  stateOverride?: Record<string, unknown>
}) => {
  const dispatch = useAppDispatch()
  const {
    state: storeState,
    groups,
    actions: toolbarActions,
  } = useToolbarFacade(section)
  const state = stateOverride ?? storeState
  const { onAction } = toolbarActions

  const { fontSizeStep } = useCardtextFacade()
  const { templates: cardtextTemplates } = useCardtextTemplates()

  useEffect(() => {
    if (section === 'cardtext' || section === 'cardtextView') {
      const count = (cardtextTemplates ?? []).length
      dispatch(
        updateToolbarIcon({
          section,
          key: 'listCardtext',
          value: { options: { badge: count > 0 ? count : null } },
        }),
      )
    }
  }, [section, cardtextTemplates, dispatch])

  const groupRef = useRef<HTMLDivElement>(null)

  const { sizeToolbarContour, sectionMenuHeight, setSectionMenuHeight } =
    useSizeFacade()

  const cardphotoApplied = useAppSelector(selectIsCurrentCropApplied)
  const cardtextApplied = useAppSelector(selectCardtextIsComplete)
  const cardtextPlainText = useAppSelector(selectCardtextPlainText)
  const cardtextFavorite = useAppSelector(selectCardtextFavorite)
  const cardtextAssetId = useAppSelector(selectCardtextAssetId)
  const cardtextAppliedId = useAppSelector(selectCardtextApplied)
  const isCardtextCurrentTemplateApplied =
    cardtextAssetId != null &&
    cardtextAppliedId != null &&
    cardtextAssetId === cardtextAppliedId
  const isAlreadyApplied =
    section === 'cardtext' || section === 'cardtextView'
      ? cardtextApplied
      : cardphotoApplied
  const appliedStatus = isAlreadyApplied ? 'disabled' : 'enabled'
  const cardtextEmpty =
    (section === 'cardtext' || section === 'cardtextView') &&
    !(cardtextPlainText?.trim?.() ?? '').length

  useEffect(() => {
    if (section === 'cardtextView') {
      dispatch(
        updateToolbarIcon({
          section: 'cardtextView',
          key: 'favorite',
          value: { state: cardtextFavorite ? 'active' : 'enabled' },
        }),
      )
    }
  }, [section, cardtextFavorite, dispatch])

  const senderSortDirection = useAppSelector(
    (state) => state.sender?.sortOptions?.direction ?? 'asc',
  )
  const recipientSortDirection = useAppSelector(
    (state) => state.recipient?.sortOptions?.direction ?? 'asc',
  )
  const recipientsViewSortDirection = useAppSelector(
    (state) => state.recipient?.recipientsViewSortDirection ?? 'asc',
  )
  const cardtextListSortDirection = useAppSelector(selectCardtextListSortDirection)
  const sortDirection =
    section === 'addressListSender'
      ? senderSortDirection
      : section === 'addressListRecipient'
        ? recipientSortDirection
        : section === 'recipientsView'
          ? recipientsViewSortDirection
          : section === 'cardtextList'
            ? cardtextListSortDirection
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

    if (key === 'apply' && section === 'cardphoto' && isAlreadyApplied) {
      buttonStatus = 'disabled'
    }
    if (
      key === 'apply' &&
      (section === 'cardtext' || section === 'cardtextView')
    ) {
      buttonStatus =
        cardtextEmpty || isCardtextCurrentTemplateApplied
          ? 'disabled'
          : 'enabled'
    }
    if (
      section === 'cardtextView' &&
      key === 'favorite' &&
      cardtextFavorite
    ) {
      buttonStatus = 'active'
    }

    const orientation =
      mergedOptions?.orientation ?? rawData?.options?.orientation
    const badge = mergedOptions?.badge ?? (rawData as any)?.options?.badge
    const badgeDot =
      mergedOptions?.badgeDot ?? (rawData as any)?.options?.badgeDot

    const visualStatus =
      section === 'cardtext' && key === 'left' ? 'enabled' : buttonStatus

    if (section === 'cardtext' && key === 'left') {
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
          orientation: orientation as LayoutOrientation,
          step: fontSizeStep,
          sortDirection: key === 'sortDown' ? sortDirection : undefined,
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
      {/* {section === 'cardphoto' && state.crop.state !== 'active' && (
        <CropPreview />
      )} */}
    </div>
  )
}

import React, { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CropPreview } from './CropPreview'
import { useToolbarFacade } from '../application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { getToolbarIcon } from '@shared/utils/icons'
import { capitalize } from '@/shared/utils/helpers'
import {
  selectAppliedImage,
  selectIsCurrentCropApplied,
} from '@/features/cardphoto/infrastructure/selectors'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import type { ToolbarSection, ToolbarGroup, IconOptions } from '../domain/types'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import { LayoutOrientation } from '@layout/domain/types'
import styles from './Toolbar.module.scss'

export const Toolbar = ({ section }: { section: ToolbarSection }) => {
  const { state, groups, actions: toolbarActions } = useToolbarFacade(section)
  const { onAction } = toolbarActions

  const { fontSizeStep } = useCardtextFacade()

  const groupRef = useRef<HTMLDivElement>(null)

  const { sizeToolbarContour, sectionMenuHeight, setSectionMenuHeight } =
    useSizeFacade()
  // console.log('TOOLBAR section', section)

  const cardphotoApplied = useAppSelector(selectIsCurrentCropApplied)
  const cardtextApplied = useAppSelector(selectCardtextIsComplete)
  const isAlreadyApplied =
    section === 'cardtext' ? cardtextApplied : cardphotoApplied
  const appliedStatus = isAlreadyApplied ? 'disabled' : 'enabled'

  useEffect(() => {
    if (groupRef.current) {
      const actualHeight = groupRef.current.offsetHeight

      if (actualHeight !== sectionMenuHeight) {
        setSectionMenuHeight(actualHeight)
      }
    }
  }, [section, groups, sectionMenuHeight, setSectionMenuHeight])

  const sectionsWithFixedWidth = ['cardphoto', 'cardtext']
  const toolbarStyle = sectionsWithFixedWidth.includes(section)
    ? { width: `${sizeToolbarContour.width}px` }
    : {}

  const renderIcon = (
    key: IconKey,
    groupStatus: IconStateGroup,
    currentIconState?: IconState,
    iconOptions?: IconOptions,
  ) => {
    const rawData = state[key] as
      | { state: IconState; options?: IconOptions }
      | undefined
    const options = rawData && typeof rawData === 'object' && 'options' in rawData
      ? rawData.options
      : undefined
    const mergedOptions = { ...iconOptions, ...options }

    const buttonState = typeof rawData === 'string' ? rawData : rawData?.state
    let buttonStatus = currentIconState || buttonState

    // apply: для sender, recipient, recipients, recipientView, savedAddress — только state тулбара.
    // Для cardphoto/cardtext — ещё disable, если уже применено.
    const isCardApply =
      key === 'apply' && (section === 'cardphoto' || section === 'cardtext')
    if (isCardApply && isAlreadyApplied) {
      buttonStatus = 'disabled'
    }

    const orientation = mergedOptions?.orientation ?? rawData?.options?.orientation
    const badge = mergedOptions?.badge ?? (rawData as any)?.options?.badge
    const badgeDot = mergedOptions?.badgeDot ?? (rawData as any)?.options?.badgeDot

    return (
      <button
        key={key}
        type="button"
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${capitalize(buttonStatus)}`],
          styles[`toolbarKey${capitalize(key)}`],
          styles[`toolbarKey${capitalize(key)}${capitalize(buttonStatus)}`],
          groupStatus === 'disabled' && styles.toolbarKeyDisabled,
        )}
        disabled={buttonStatus === 'disabled' || groupStatus === 'disabled'}
        onMouseDown={(e) => {
          // Для отключённых кнопок предотвращаем дефолт,
          // чтобы не забирать фокус у активного инпута, но не вызываем action.
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
        })}

        {Boolean(badge && badge > 0) && (
          <span className={styles.toolbarBadge}>
            <span className={styles.toolbarBadgeValue}>{badge}</span>
          </span>
        )}
        {Boolean(badgeDot) && (
          <span className={styles.toolbarBadgeDot} title="Вернуть к несохранённому адресу" />
        )}
      </button>
    )
  }

  return (
    <div
      className={clsx(styles.toolbar, styles[`toolbar${capitalize(section)}`])}
      style={toolbarStyle}
    >
      {groups.map((group: ToolbarGroup) => (
        <div
          key={group.group}
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

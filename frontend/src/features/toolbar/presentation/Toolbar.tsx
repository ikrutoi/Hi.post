import React, { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CropPreview } from './CropPreview'
import { useToolbarFacade } from '../application/facades'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { getToolbarIcon } from '@shared/utils/icons'
import { capitalize } from '@/shared/utils/helpers'
import {
  selectAppliedImage,
  selectIsCurrentCropApplied,
} from '@/features/cardphoto/infrastructure/selectors'
import type { ToolbarSection, ToolbarGroup, IconOptions } from '../domain/types'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import { LayoutOrientation } from '@layout/domain/types'
import styles from './Toolbar.module.scss'

export const Toolbar = ({ section }: { section: ToolbarSection }) => {
  const { state: toolbarState, actions: toolbarActions } =
    useToolbarFacade(section)
  const { state: iconStates, groups, badges } = toolbarState
  const { onAction } = toolbarActions

  // console.log('TOOLBAR state', iconStates)

  const { fontSizeStep } = useCardtextFacade()

  const groupRef = useRef<HTMLDivElement>(null)

  const { sectionMenuHeight, setSectionMenuHeight } = useSizeFacade()

  const isAlreadyApplied = useAppSelector(selectIsCurrentCropApplied)
  const appliedStatus = isAlreadyApplied ? 'disabled' : 'enabled'

  useEffect(() => {
    if (groupRef.current) {
      const actualHeight = groupRef.current.offsetHeight

      if (actualHeight !== sectionMenuHeight) {
        setSectionMenuHeight(actualHeight)
      }
    }
  }, [section, groups, sectionMenuHeight, setSectionMenuHeight])

  const renderIcon = (
    key: IconKey,
    groupStatus: IconStateGroup,
    currentIconState?: IconState,
  ) => {
    const rawData = iconStates[key] as {
      state: IconState
      options?: IconOptions
    }

    let buttonStatus = currentIconState || rawData.state

    if (key === 'apply' && isAlreadyApplied) {
      buttonStatus = 'disabled'
    }

    const orientation = rawData.options?.orientation
    const badge = rawData.options?.badge

    return (
      <button
        key={key}
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${capitalize(buttonStatus)}`],
          styles[`toolbarKey${capitalize(key)}`],
          styles[`toolbarKey${capitalize(key)}${capitalize(buttonStatus)}`],
          groupStatus === 'disabled' && styles.toolbarKeyDisabled,
        )}
        disabled={buttonStatus === 'disabled' || groupStatus === 'disabled'}
        onMouseDown={(e) => {
          e.preventDefault()
          if (groupStatus !== 'disabled' && buttonStatus !== 'disabled') {
            onAction(key as IconKey)
          }
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
      </button>
    )
  }

  return (
    <div
      className={clsx(styles.toolbar, styles[`toolbar${capitalize(section)}`])}
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
            renderIcon(icon.key, group.status, icon.state),
          )}
        </div>
      ))}
      {section === 'cardphoto' && iconStates.crop.state !== 'active' && (
        <CropPreview />
      )}
    </div>
  )
}

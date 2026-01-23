import React, { useEffect, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { useToolbarFacade } from '../application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import { getToolbarIcon } from '@shared/utils/icons'
import { capitalize } from '@/shared/utils/helpers'
import type { ToolbarSection, ToolbarGroup } from '../domain/types'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import styles from './Toolbar.module.scss'

export const Toolbar = ({ section }: { section: ToolbarSection }) => {
  const { state: toolbarState, actions: toolbarActions } =
    useToolbarFacade(section)
  const { state: iconStates, groups, badges } = toolbarState
  const { onAction } = toolbarActions

  // console.log('Toolbar badges', badges)

  const groupRef = useRef<HTMLDivElement>(null)

  const { size: layoutSize, actions: layoutActions } = useLayoutFacade()
  const { sectionMenuHeight } = layoutSize
  const { setSectionMenuHeight } = layoutActions

  useEffect(() => {
    if (groupRef.current) {
      const actualHeight = groupRef.current.offsetHeight

      if (actualHeight !== sectionMenuHeight) {
        setSectionMenuHeight(actualHeight)
      }
    }
  }, [section, groups, sectionMenuHeight, setSectionMenuHeight])

  const renderIcon = (key: IconKey, groupStatus: IconStateGroup) => {
    const rawData = iconStates[key as keyof typeof iconStates]

    const iconState = (
      typeof rawData === 'object' && rawData !== null ? rawData.state : rawData
    ) as IconState

    const badgeValue = badges[key]

    return (
      <button
        key={key}
        type="button"
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${capitalize(iconState)}`],
          groupStatus === 'disabled' && styles.toolbarKeyDisabled,
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          if (groupStatus !== 'disabled' && iconState !== 'disabled') {
            onAction(key as IconKey)
          }
        }}
        disabled={iconState === 'disabled' || groupStatus === 'disabled'}
      >
        {getToolbarIcon({ key: key as IconKey })}

        {badgeValue !== null && badgeValue > 0 && (
          <span className={styles.toolbarBadge}>
            <span className={styles.toolbarBadgeValue}>{badgeValue}</span>
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
          {group.icons.map((icon) => renderIcon(icon.key, group.status))}
        </div>
      ))}
    </div>
  )
}

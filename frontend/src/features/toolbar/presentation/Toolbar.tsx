import React from 'react'
import clsx from 'clsx'
import { useToolbarFacade } from '../application/facades'
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

  const renderIcon = (key: IconKey, groupStatus: IconStateGroup) => {
    const iconState = iconStates[key as keyof typeof iconStates] as IconState

    return (
      <button
        key={key}
        type="button"
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${capitalize(iconState)}`],
          groupStatus === 'disabled' && styles.toolbarKeyDisabled
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

        {badges[key] && (
          <span className={styles.toolbarBadge}>
            <span className={styles.toolbarBadgeValue}>{badges[key]}</span>
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
          className={clsx(
            styles.toolbarGroup,
            styles[`toolbarGroup${capitalize(group.group)}`],
            group.status === 'disabled' && styles.toolbarGroupDisabled
          )}
        >
          {group.icons.map((icon) => renderIcon(icon.key, group.status))}
        </div>
      ))}
    </div>
  )
}

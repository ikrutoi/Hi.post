import React from 'react'
import type { ReactEditor } from 'slate-react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons/getToolbarIcon'
import { capitalize } from '@shared/utils/helpers'
import { useToolbarConstruction } from '../application/hooks'
import styles from './Toolbar.module.scss'
import type {
  ToolbarGroup,
  ToolbarSection,
  ToolbarState,
} from '../domain/types'
import type { IconState, IconKey } from '@shared/config/constants'
import type { AppDispatch } from '@app/state'

export const Toolbar = ({
  section,
  editor,
  dispatch,
}: {
  section: ToolbarSection
  editor?: ReactEditor
  dispatch?: AppDispatch
}) => {
  const { config, badges, onAction, state } = useToolbarConstruction(section)

  const renderIcon = (key: keyof ToolbarState[typeof section]) => {
    const iconState = state[key] as IconState

    return (
      <button
        key={String(key)}
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${String(key)}`],
          styles[`toolbarKey${capitalize(iconState)}`]
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          editor && dispatch && onAction(key, section, editor, dispatch)
        }}
        disabled={iconState === 'disabled'}
      >
        {getToolbarIcon({ key: key as IconKey })}
        {badges[key as string] && (
          <span className={styles.toolbarBadge}>
            <span className={styles.toolbarBadgeValue}>
              {badges[key as string]}
            </span>
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      className={clsx(styles.toolbar, styles[`toolbar${capitalize(section)}`])}
    >
      {config.map((group: ToolbarGroup) => (
        <div
          key={group.group}
          className={clsx(
            styles.toolbarGroup,
            styles[`toolbarGroup${capitalize(group.group)}`]
          )}
        >
          {group.icons.map((icon) =>
            renderIcon(icon.key as keyof ToolbarState[typeof section])
          )}
        </div>
      ))}
    </div>
  )
}

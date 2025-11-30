import React from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons/getToolbarIcon'
import { useToolbarConstruction } from '../application/hooks'
import styles from './Toolbar.module.scss'
import type { ToolbarSection } from '../domain/types'

export const Toolbar = ({ section }: { section: ToolbarSection }) => {
  const { keys, badges, onAction, state } = useToolbarConstruction(section)
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div
      className={clsx(styles.toolbar, styles[`toolbar${capitalize(section)}`])}
    >
      {keys.map((key) => {
        const iconState = state[key]
        return (
          <button
            key={String(key)}
            className={clsx(
              styles.toolbarKey,
              styles[`toolbarKey${String(key)}`],
              styles[`toolbarKey${capitalize(iconState)}`]
            )}
            onClick={() => onAction(key, section)}
            disabled={iconState === 'disabled'}
          >
            {getToolbarIcon({ key })}
            {badges[key as string] && (
              <span className={styles.toolbarBadge}>
                <span className={styles.toolbarBadgeValue}>
                  {badges[key as string]}
                </span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

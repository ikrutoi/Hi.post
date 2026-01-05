import React from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons/getToolbarIcon'
import { capitalize } from '@shared/utils/helpers'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useToolbarFacade } from '../application/facades'
import styles from './Toolbar.module.scss'
import type {
  ToolbarGroup,
  ToolbarSection,
  ToolbarState,
} from '../domain/types'
import type { IconState, IconKey } from '@shared/config/constants'

export const Toolbar = ({ section }: { section: ToolbarSection }) => {
  const {
    state: stateToolbar,
    config,
    badges,
    onAction,
  } = useToolbarFacade(section)
  const { state: stateCardtext } = useCardtextFacade()
  const { editor } = stateCardtext

  const renderIcon = (key: keyof ToolbarState[typeof section]) => {
    const iconState = stateToolbar[key] as IconState

    if (section === 'cardphoto' && key === 'cardOrientation') {
      return (
        <button
          key={String(key)}
          type="button"
          className={clsx(
            styles.toolbarKey,
            styles[`toolbarKey${String(key)}`],
            styles[`toolbarKey${capitalize(iconState)}`],
            styles[
              `toolbarKeyOrientation${capitalize(stateToolbar.orientation)}`
            ]
          )}
          onMouseDown={(e) => {
            e.preventDefault()
            onAction(key as any)
          }}
          disabled={iconState === 'disabled'}
        >
          {getToolbarIcon({
            key: key as IconKey,
            orientation: stateToolbar.orientation,
          })}
        </button>
      )
    }

    return (
      <button
        key={String(key)}
        type="button"
        className={clsx(
          styles.toolbarKey,
          styles[`toolbarKey${String(key)}`],
          styles[`toolbarKey${capitalize(iconState)}`]
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          if (section === 'cardtext') {
            onAction(key as any, editor)
          } else {
            onAction(key as any)
          }
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
      {config.toolbar
        ? config.toolbar.map((group: ToolbarGroup) => (
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
          ))
        : null}
    </div>
  )
}

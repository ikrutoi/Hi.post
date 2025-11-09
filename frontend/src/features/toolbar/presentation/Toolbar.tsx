import React from 'react'
import clsx from 'clsx'
import { TOOLBAR_KEYS_MAP } from '@toolbar/domain/constants/toolbarKeysMap'
import { ICON_SIZE_MAP } from '@shared/config/constants'
import { useLayoutFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { getToolbarIcon } from '@shared/utils/icons/getToolbarIcon'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../application/helpers'
import { toolbarUiMap } from '../application/helpers'
import { useViewportSize } from '@shared/hooks'
import styles from './Toolbar.module.scss'
import type { IconState } from '@shared/config/constants'
import type { ToolbarKey, ToolbarSection } from '../domain/types'

interface ToolbarProps {
  section: ToolbarSection
}

export const Toolbar: React.FC<ToolbarProps> = ({ section }) => {
  const { viewportSize } = useViewportSize()
  const iconSize = ICON_SIZE_MAP[viewportSize]

  const { size } = useLayoutFacade()
  const { sizeMiniCard, sizeCard } = size
  const { state: stateToolbar } = useToolbarFacade(section)
  const useToolbarUI = toolbarUiMap[section]
  const toolbarUi = useToolbarUI?.(section)

  if (!toolbarUi || !TOOLBAR_KEYS_MAP[section]) return null

  const { handleClickButton, setButtonIconRef } = toolbarUi
  const keys = TOOLBAR_KEYS_MAP[section]

  return (
    <div
      className={clsx(styles.toolbar, styles[`toolbar--${section}`])}
      style={
        section === 'cardPanelOverlay'
          ? { height: `${sizeMiniCard.height}px` }
          : undefined
      }
    >
      {keys.map((key) => {
        const state = stateToolbar[
          key as keyof typeof stateToolbar
        ] as IconState

        return (
          <button
            key={key}
            data-tooltip={key}
            data-section={section}
            ref={setButtonIconRef(`${section}-${key}`)}
            className={clsx(
              styles.toolbar__btn,
              styles[`toolbar__btn--${key}`],
              styles[`toolbar__btn--${state}`]
            )}
            onClick={(evt) => handleClickButton(evt, key)}
            onMouseEnter={handleMouseEnterBtn}
            onMouseLeave={handleMouseLeaveBtn}
          >
            {getToolbarIcon({ key: key as ToolbarKey, size: iconSize })}
          </button>
        )
      })}
    </div>
  )
}

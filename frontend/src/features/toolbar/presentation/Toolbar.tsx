import React from 'react'
import clsx from 'clsx'
import { TOOLBAR_KEYS_MAP } from '@toolbar/domain/constants/toolbarKeysMap'
import { useToolbarFacade } from '@toolbar/application/facades'
import { getToolbarIcon } from '@shared/utils/icons/getToolbarIcon'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../application/helpers'
import { toolbarUiMap } from '../application/helpers'
import styles from './Toolbar.module.scss'
import type { SectionsToolbar, IconState } from '@shared/config/constants'
import type { ToolbarKey } from '../domain/types'

interface ToolbarProps {
  section: SectionsToolbar
}

export const Toolbar: React.FC<ToolbarProps> = ({ section }) => {
  const { state: stateToolbar } = useToolbarFacade(section)

  const useToolbarUI = toolbarUiMap[section]
  const toolbarUi = useToolbarUI?.(section)

  if (!toolbarUi) return null

  const { handleClickButton, setButtonIconRef } = toolbarUi
  const keys = TOOLBAR_KEYS_MAP[section]

  return (
    <div className={styles.toolbar}>
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
            {getToolbarIcon(key as ToolbarKey)}
          </button>
        )
      })}
    </div>
  )
}

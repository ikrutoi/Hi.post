import React from 'react'
import styles from './Toolbar.module.scss'

import { TOOLBAR_KEYS_MAP } from '@toolbar/domain/constants/toolbarKeysMap'
import type { ToolbarKey } from '@toolbar/domain/types'
import type { CardSectionName } from '@shared/types'
import { useToolbarFacade } from '@toolbar/application/facades'
import { getToolbarIcon } from '@shared/utils/icons/getToolbarIcon'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '@data/toolbar/handleMouse'

interface ToolbarProps {
  section: CardSectionName
}

export const Toolbar: React.FC<ToolbarProps> = ({ section }) => {
  const { ui } = useToolbarFacade(section)
  const { handleClickBtn, handleMouseLeave, setBtnIconRef } = ui

  const keys = TOOLBAR_KEYS_MAP[section]

  return (
    <div className={styles.toolbar}>
      {keys.map((key) => (
        <button
          key={key}
          data-tooltip={key}
          data-section={section}
          ref={setBtnIconRef(`${section}-${key}`)}
          className={`${styles.toolbar__btn} ${styles[`toolbar__btn--${key}`]}`}
          onClick={(evt) => handleClickBtn(evt, key)}
          onMouseEnter={(evt) => handleMouseEnterBtn(evt)}
          onMouseLeave={(evt) => handleMouseLeave(evt)}
        >
          {getToolbarIcon(key as ToolbarKey)}
        </button>
      ))}
    </div>
  )
}

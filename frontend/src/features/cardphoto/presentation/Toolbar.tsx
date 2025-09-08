import React from 'react'

import styles from './Toolbar.module.scss'

import { toolbarButtons } from '../shared/config/toolbarButtons'
import { useToolbarFacade } from '../application/facades/useToolbarFacade'
import { getToolbarIcon } from '../../../shared/ui/getToolbarIcon'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '@data/toolbar/handleMouse'

export const Toolbar: React.FC = () => {
  const { handleClickBtn, handleMouseLeave, setBtnIconRef } = useToolbarFacade()

  return (
    <div className={styles.toolbar}>
      {toolbarButtons.map((btn) => (
        <button
          key={btn}
          data-tooltip={btn}
          data-section="cardphoto"
          ref={setBtnIconRef(`cardphoto-${btn}`)}
          className={`${styles.toolbarBtn} ${styles[`btn-${btn}`]}`}
          onClick={(evt) => handleClickBtn(evt, btn)}
          onMouseEnter={(evt) => handleMouseEnterBtn(evt)}
          onMouseLeave={(evt) => handleMouseLeave(evt)}
        >
          {getToolbarIcon(btn)}
        </button>
      ))}
    </div>
  )
}

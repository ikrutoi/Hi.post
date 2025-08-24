import React from 'react'

import { useToolbar } from '../hooks/useToolbar'
import listBtnsCardphoto from '@shared/toolbar/listBtnsCardphoto.json'
import { addIconToolbar } from '@shared/toolbar/getIconElement'

import './ToolbarCardphoto.scss'

const Toolbar: React.FC = () => {
  const { btnsCardphoto, setBtnIconRef, handleClickBtn, handleMouseLeave } =
    useToolbar()

  return (
    <div className="toolbar-cardphoto">
      {listBtnsCardphoto.map((btn, i) => (
        <button
          key={`${i}-${btn}`}
          data-tooltip={btn}
          data-section="cardphoto"
          ref={setBtnIconRef(`cardphoto-${btn}`)}
          className={`toolbar-btn toolbar-btn-cardphoto btn-cardphoto-${btn}`}
          onClick={() => handleClickBtn(btn)}
          onMouseLeave={() => handleMouseLeave(btn)}
          onMouseEnter={(evt) => {}}
        >
          {addIconToolbar(btn)}
        </button>
      ))}
    </div>
  )
}

export default Toolbar

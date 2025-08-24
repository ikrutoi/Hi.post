import React from 'react'

import './Toolbar.scss'

import type { ToolbarProps } from '@features/date/publicApi.ts'

export const Toolbar: React.FC<ToolbarProps> = ({
  day,
  cartDay,
  handleImgCartClick,
  handleCellCartClick,
  countCart,
}) => {
  return (
    <div className="toolbar-cart">
      <div className="toolbar-cart-cell" onClick={handleCellCartClick}>
        {day}
      </div>
      <img
        className="toolbar-cart-img cell-cart-img"
        alt="cart-day"
        src={cartDay?.[0]?.preview}
        onClick={(evt) => handleImgCartClick(evt, day)}
      />
      {countCart && (
        <span className="toolbar-cart-count toolbar-cart-img-count">
          {cartDay.length}
        </span>
      )}
    </div>
  )
}

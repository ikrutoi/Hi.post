import React, { useEffect, useState } from 'react'
import './ToolbarShopping.scss'

const ToolbarShopping = ({
  day,
  shoppingDay,
  handleImgShoppingClick,
  handleCellShoppingClick,
  countShoppingCards,
}) => {
  return (
    <div className="toolbar-shopping">
      <div className="toolbar-shopping-cell" onClick={handleCellShoppingClick}>
        {day}
      </div>
      <img
        className="toolbar-shopping-img cell-shopping-img "
        alt="shopping-day"
        src={shoppingDay?.[0]?.img}
        onClick={(evt) => handleImgShoppingClick(evt, day)}
      />
      {countShoppingCards && (
        <span className="toolbar-shopping-count toolbar-shopping-img-count">
          {shoppingDay.length}
        </span>
      )}
    </div>
  )
}

export default ToolbarShopping

import React from 'react'
import './Toolbar.scss'

interface ToolbarProps {
  day: number
  shoppingDay: { img: string; date?: any }[]
  handleImgShoppingClick: (evt: React.MouseEvent, day: number) => void
  handleCellShoppingClick: () => void
  countShoppingCards: number | false | null
}

export const Toolbar: React.FC<ToolbarProps> = ({
  day,
  shoppingDay,
  handleImgShoppingClick,
  handleCellShoppingClick,
  countShoppingCards,
}) => {
  return (
    <div className="calendar-cell-toolbar">
      <div
        className="calendar-cell-toolbar__day"
        onClick={handleCellShoppingClick}
      >
        {day}
      </div>
      <img
        className="calendar-cell-toolbar__img"
        alt="shopping-day"
        src={shoppingDay?.[0]?.img}
        onClick={(evt) => handleImgShoppingClick(evt, day)}
      />
      {countShoppingCards && (
        <span className="calendar-cell-toolbar__count calendar-cell-toolbar__count--img">
          {shoppingDay.length}
        </span>
      )}
    </div>
  )
}

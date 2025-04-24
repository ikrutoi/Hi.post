import { useEffect, useState } from 'react'
import './Cell.scss'
import ToolbarShopping from './ToolbarShopping/ToolbarShopping'

const Cell = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  // currentDate,
  today,
  taboo,
  handleSelectedDate,
  selectedDate,
  selectedDateTitle,
  handleClickCell,
  shoppingDay,
}) => {
  const [toolbarShopping, setToolbarShopping] = useState(false)

  const handleCellShopping = () => {
    setToolbarShopping((state) => !state)
  }

  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : dayCurrent ? (
    <div
      className={`cell cell-day day-current ${
        today ? 'today' : ''
      } day-${dayCurrent} ${
        selectedDate ? (shoppingDay ? 'shopping' : 'selected') : ''
      } ${taboo ? 'taboo' : ''}`}
      onClick={() =>
        handleSelectedDate(
          taboo,
          selectedDateTitle.year,
          selectedDateTitle.month,
          dayCurrent
        )
      }
    >
      {shoppingDay ? (
        <div className="cell-shopping-container" onClick={handleCellShopping}>
          <span
            className={`cell-shopping-filter ${selectedDate ? 'selected' : ''}`}
          >
            {dayCurrent}
          </span>
          <img
            className="cell-shopping-img"
            alt="shopping-day"
            src={shoppingDay?.[0]?.img}
          />
          {toolbarShopping && (
            <ToolbarShopping day={dayCurrent} shoppingDay={shoppingDay} />
          )}
        </div>
      ) : (
        dayCurrent
      )}
    </div>
  ) : dayBefore ? (
    <div
      className={`cell cell-day ${
        today ? 'today' : ''
      } day-before day-${dayBefore} ${selectedDate ? 'selected' : ''}`}
      onClick={() => handleClickCell('before')}
    >
      {dayBefore}
    </div>
  ) : (
    <div
      className={`cell cell-day ${
        today ? 'today' : ''
      } day-after day-${dayAfter} ${selectedDate ? 'selected' : ''}`}
      onClick={() => handleClickCell('after')}
    >
      {dayAfter}
    </div>
  )
}

export default Cell

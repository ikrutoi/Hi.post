import { useEffect } from 'react'
import './Cell.scss'

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
  // useEffect(() => {
  //   if (shoppingDay) {
  //     console.log('shoppingDay', shoppingDay)
  //   }
  // }, [shoppingDay])
  // console.log('day shoppingDay', dayCurrent, shoppingDay)
  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : dayCurrent ? (
    <div
      className={`cell cell-day day-current ${
        today ? 'today' : ''
      } day-${dayCurrent} ${selectedDate ? 'selected' : ''} ${
        taboo ? 'taboo' : ''
      } ${shoppingDay ? 'shopping' : ''}`}
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
        <div className="cell-shopping-container">
          <span className="cell-shopping-filter">{dayCurrent}</span>
          {/* <span className="cell-shopping-day">{dayCurrent}</span> */}
          <img
            className="cell-shopping-img"
            alt="shopping-day"
            src={shoppingDay.img}
          />
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

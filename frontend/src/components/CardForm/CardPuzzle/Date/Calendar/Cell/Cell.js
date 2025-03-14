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
}) => {
  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : dayCurrent ? (
    <div
      className={`cell cell-day day-current ${
        today ? 'today' : ''
      } day-${dayCurrent} ${selectedDate ? 'selected' : ''} ${
        taboo ? 'taboo' : ''
      }`}
      onClick={() =>
        handleSelectedDate(
          taboo,
          selectedDateTitle.year,
          selectedDateTitle.month,
          dayCurrent
        )
      }
    >
      {dayCurrent}
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

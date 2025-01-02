import './Cell.scss'

const Cell = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  currentDate,
  today,
}) => {
  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : dayCurrent ? (
    today ? (
      <div className={`cell cell-day day-current today day-${dayCurrent}`}>
        {dayCurrent}
      </div>
    ) : (
      <div className={`cell cell-day day-current day-${dayCurrent}`}>
        {dayCurrent}
      </div>
    )
  ) : dayBefore ? (
    today ? (
      <div className={`cell cell-day today day-before day-${dayBefore}`}>
        {dayBefore}
      </div>
    ) : (
      <div className={`cell cell-day day-before day-${dayBefore}`}>
        {dayBefore}
      </div>
    )
  ) : today ? (
    <div className={`cell cell-day today day-after day-${dayAfter}`}>
      {dayAfter}
    </div>
  ) : (
    <div className={`cell cell-day day-after day-${dayAfter}`}>{dayAfter}</div>
  )
}

export default Cell

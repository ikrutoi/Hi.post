import './Cell.scss'

const Cell = ({ dayCounter, title, dayBefore, counter, daysOfWeek }) => {
  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : dayCounter ? (
    <div className={`cell cell-day day-${counter}`}>{counter}</div>
  ) : dayBefore ? (
    <div className="cell cell-day day-before">Before</div>
  ) : (
    <div className="cell cell-day day-after">After</div>
  )
}

export default Cell

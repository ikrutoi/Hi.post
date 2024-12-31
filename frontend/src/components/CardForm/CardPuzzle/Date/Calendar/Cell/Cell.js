import './Cell.scss'

const Cell = ({ dayValue, title }) => {
  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : (
    <div className="cell cell-day">{dayValue}</div>
  )
}

export default Cell

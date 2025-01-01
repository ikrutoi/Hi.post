import './CellCounter.scss'

const CellCounter = () => {
  const counter = 2
  return <div className={`cell cell-day day-${counter}`}>{counter}</div>
}

export default CellCounter

import './MiniDate.scss'
import listOfMonthOfYear from '../../../../data/date/monthOfYear.json'

const MiniDate = ({ valueSection, heightMinicard }) => {
  return (
    <>
      <span
        className="mini-date mini-date-year"
        style={{ heightLine: `${0.25 * heightMinicard}px` }}
      >
        {valueSection.year}
      </span>
      <span
        className="mini-date mini-date-day"
        style={{ heightLine: `${0.5 * heightMinicard}px` }}
      >
        {valueSection.day}
      </span>
      <span
        className="mini-date mini-date-month"
        style={{ heightLine: `${0.25 * heightMinicard}px` }}
      >
        {listOfMonthOfYear[valueSection.month]}
      </span>
    </>
  )
}

export default MiniDate

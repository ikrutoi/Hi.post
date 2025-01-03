import './CurrentDateTime.scss'
import nameMonths from '../../../../../data/date/monthOfYear.json'

const CurrentDateTime = ({ selectedDate }) => {
  return (
    <>
      <span className="date-title-year">{selectedDate.year}</span>
      <span className="date-title-month">{nameMonths[selectedDate.month]}</span>
      <span className="date-title-day">{selectedDate.day}</span>
    </>
  )
}

export default CurrentDateTime

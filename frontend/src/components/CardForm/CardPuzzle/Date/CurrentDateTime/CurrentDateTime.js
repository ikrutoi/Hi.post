import './CurrentDateTime.scss'
import nameMonths from '../../../../../data/date/monthOfYear.json'

const CurrentDateTime = ({
  selectedDate,
  handlerChangeYear,
  handlerChangeMonth,
}) => {
  return (
    <>
      <span className="date-title-year" onClick={handlerChangeYear}>
        {selectedDate.year}
      </span>
      <span className="date-title-month" onClick={handlerChangeMonth}>
        {nameMonths[selectedDate.month]}
      </span>
      <span className="date-title-day">{selectedDate.day}</span>
    </>
  )
}

export default CurrentDateTime

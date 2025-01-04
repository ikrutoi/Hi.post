import './CurrentDateTime.scss'
import nameMonths from '../../../../../data/date/monthOfYear.json'

const CurrentDateTime = ({
  selectedDate,
  handleChangeYear,
  handleChangeMonth,
  isActiveDateTitle,
}) => {
  return (
    <>
      <span
        className={`date-title-year ${
          isActiveDateTitle === 'year' ? 'active' : ''
        }`}
        onClick={handleChangeYear}
      >
        {selectedDate.year}
      </span>
      <span
        className={`date-title-month ${
          isActiveDateTitle === 'month' ? 'active' : ''
        }`}
        onClick={handleChangeMonth}
      >
        {nameMonths[selectedDate.month]}
      </span>
      <span className="date-title-day">{selectedDate.day}</span>
    </>
  )
}

export default CurrentDateTime

import './CurrentDateTime.scss'
import nameMonths from '../../../../../data/date/monthOfYear.json'

const CurrentDateTime = ({
  selectedDateTitle,
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
        {selectedDateTitle.year}
      </span>
      <span
        className={`date-title-month ${
          isActiveDateTitle === 'month' ? 'active' : ''
        }`}
        onClick={handleChangeMonth}
      >
        {nameMonths[selectedDateTitle.month]}
      </span>
      <span className="date-title-day">{selectedDateTitle.day}</span>
    </>
  )
}

export default CurrentDateTime

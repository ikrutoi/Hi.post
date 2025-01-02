import nameMonths from '../../../../../data/date/monthOfYear.json'

const CurrentDateTime = ({ selectedDate }) => {
  return (
    <>
      <span>{selectedDate.year}</span>
      <span>{nameMonths[selectedDate.month]}</span>
      <span>{selectedDate.day}</span>
    </>
  )
}

export default CurrentDateTime

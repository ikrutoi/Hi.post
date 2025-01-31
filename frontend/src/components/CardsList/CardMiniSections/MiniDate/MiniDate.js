import './MiniDate.scss'
import listOfMonthOfYear from '../../../../data/date/monthOfYear.json'

const MiniDate = ({ valueSection }) => {
  return (
    <>
      <span>{valueSection.year}</span>
      <span>{listOfMonthOfYear[valueSection.month]}</span>
      <span>{valueSection.day}</span>
    </>
  )
}

export default MiniDate

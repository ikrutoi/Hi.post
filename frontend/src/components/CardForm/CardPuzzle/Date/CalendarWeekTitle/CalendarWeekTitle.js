import Cell from '../Calendar/Cell/Cell'
import './CalendarWeekTitle.scss'

const CalendarWeekTitle = ({ daysOfWeek }) => {
  const fillingTitlesWeek = () => {
    let weekTitle = []
    for (let day = 0; day < daysOfWeek.length; day++) {
      weekTitle.push(
        <Cell key={`${daysOfWeek[day]}-${day}`} title={daysOfWeek[day]} />
      )
    }
    return weekTitle
  }
  return <div className={'calendar-title'}>{fillingTitlesWeek()}</div>
}

export default CalendarWeekTitle

import Cell from '../Calendar/Cell/Cell'
import SunMon from '../Calendar/SunMon/SunMon'
import './CalendarWeekTitle.scss'

const CalendarWeekTitle = ({
  daysOfWeek,
  firstDayTitle,
  setFirstDayOfWeek,
}) => {
  const fillingTitlesWeek = () => {
    let weekTitle = []
    weekTitle.push(
      <SunMon
        key={firstDayTitle}
        firstDayTitle={firstDayTitle}
        setFirstDayOfWeek={setFirstDayOfWeek}
      />
    )
    for (let day = 1; day < daysOfWeek.length; day++) {
      weekTitle.push(
        <Cell key={`${daysOfWeek[day]}-${day}`} title={daysOfWeek[day]} />
      )
    }
    return weekTitle
  }
  return <div className={'calendar-title'}>{fillingTitlesWeek()}</div>
}

export default CalendarWeekTitle

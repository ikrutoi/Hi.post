import Cell from '../Calendar/Cell/Cell'
import './Week.scss'

let dayValue = 1

const constructionDays = (weekInMonth, daysOfWeek, firstDayOfMonth) => {
  let week = []
  for (let day = 0; day < 7; day++) {
    weekInMonth === 0
      ? week.push(
          <Cell key={`${weekInMonth}-${day}`} title={daysOfWeek[day]} />
        )
      : week.push(<Cell key={`${weekInMonth}-${day}`} dayValue={dayValue++} />)
  }
  return week
}

const Week = ({ weekInMonth, daysOfWeek, firstDayOfMonth }) => {
  return weekInMonth === 0 ? (
    <div className="week week-title">
      {constructionDays(weekInMonth, daysOfWeek, firstDayOfMonth)}
    </div>
  ) : (
    <div className={`week week-day week-${weekInMonth}`}>
      {constructionDays(weekInMonth)}
    </div>
  )
}

export default Week

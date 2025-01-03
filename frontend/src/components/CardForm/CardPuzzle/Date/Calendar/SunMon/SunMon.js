import './SunMon.scss'

const SunMon = ({ firstDayTitle, setFirstDayOfWeek }) => {
  const handleFirstDayOfWeek = () =>
    firstDayTitle === 'Sun'
      ? setFirstDayOfWeek('Mon')
      : setFirstDayOfWeek('Sun')

  return (
    <div className="cell cell-sun-mon" onClick={handleFirstDayOfWeek}>
      <span>{firstDayTitle}</span>
    </div>
  )
}

export default SunMon

import './SunMon.scss'

const SunMon = ({ firstDayTitle, handleFirstDay }) => {
  const handleFirstDayOfWeek = () => {
    handleFirstDay(firstDayTitle === 'Sun' ? 'Mon' : 'Sun')
  }

  return (
    <div className="cell cell-sun-mon" onClick={handleFirstDayOfWeek}>
      <span>{firstDayTitle}</span>
    </div>
  )
}

export default SunMon

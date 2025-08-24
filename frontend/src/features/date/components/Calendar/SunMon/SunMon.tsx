import type { SunMonProps } from '@features/types'

export const SunMon: React.FC<SunMonProps> = ({
  firstDayTitle,
  handleFirstDay,
}) => {
  const handleFirstDayOfWeek = () => {
    handleFirstDay(firstDayTitle === 'Sun' ? 'Mon' : 'Sun')
  }

  return (
    <div className="cell cell-sun-mon" onClick={handleFirstDayOfWeek}>
      <span>{firstDayTitle}</span>
    </div>
  )
}

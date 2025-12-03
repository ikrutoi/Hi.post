import { formatSelectedDispatchDate } from '@entities/date/utils'
import { useDateFacade } from '../facades'

export const useFormattedSelectedDate = () => {
  const { state } = useDateFacade()
  const { selectedDate } = state

  return selectedDate ? formatSelectedDispatchDate(selectedDate) : null
}

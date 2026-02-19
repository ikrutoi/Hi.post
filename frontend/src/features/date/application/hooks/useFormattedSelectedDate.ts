import { formatSelectedDispatchDate } from '@entities/date/utils'
import { useDateFacade } from '../facades'

export const useFormattedSelectedDate = () => {
  const { selectedDate } = useDateFacade()

  return selectedDate ? formatSelectedDispatchDate(selectedDate) : null
}

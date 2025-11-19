import { formatSelectedDispatchDate } from '@entities/date/utils'
import { useDateFacade } from '../facades'

export const useFormattedSelectedDate = () => {
  const { state } = useDateFacade()
  const { selectedDispatchDate } = state

  return selectedDispatchDate
    ? formatSelectedDispatchDate(selectedDispatchDate)
    : null
}

import type { DispatchDate } from '../domain/types'

export const isCompleteDate = (
  date: DispatchDate
): date is Extract<DispatchDate, { isSelected: true }> => {
  return date.isSelected === true
}

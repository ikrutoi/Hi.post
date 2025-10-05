import { useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDispatchDateTitle = () => {
  const currentDate = getCurrentDate()
  const [dispatchDateTitle, setDispatchDateTitle] = useState<DispatchDate>({
    isSelected: true,
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
    day: currentDate.currentDay,
  })
  return { dispatchDateTitle, setDispatchDateTitle }
}

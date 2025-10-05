import { useState } from 'react'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDispatchDateState = () => {
  const [dispatchDate, setDispatchDate] = useState<DispatchDate>({
    isSelected: false,
  })
  return { dispatchDate, setDispatchDate }
}

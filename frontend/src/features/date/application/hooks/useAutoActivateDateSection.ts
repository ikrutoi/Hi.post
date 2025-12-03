import { useEffect } from 'react'
import { useLayoutFacade } from '@layout/application/facades'
import { useDateFacade } from '../facades'

export const useAutoActivateDateSection = () => {
  const { state } = useDateFacade()
  const { selectedDate } = state

  const { actions } = useLayoutFacade()
  const { setActiveSection } = actions

  useEffect(() => {
    if (selectedDate) {
      setActiveSection('date')
    }
  }, [selectedDate])
}

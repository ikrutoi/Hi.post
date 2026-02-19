import { useEffect } from 'react'
import { useLayoutFacade } from '@layout/application/facades'
import { useDateFacade } from '../facades'

export const useAutoActivateDateSection = () => {
  const { selectedDate } = useDateFacade()

  const { actions } = useLayoutFacade()
  const { setActiveSection } = actions

  useEffect(() => {
    if (selectedDate) {
      setActiveSection('date')
    }
  }, [selectedDate])
}

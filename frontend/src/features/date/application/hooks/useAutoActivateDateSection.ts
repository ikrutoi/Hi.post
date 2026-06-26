import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useDateFacade } from '../facades'

export const useAutoActivateDateSection = () => {
  const dispatch = useAppDispatch()
  const { selectedDate } = useDateFacade()
  const activeSection = useAppSelector(selectActiveSection)

  useEffect(() => {
    if (!selectedDate) return
    if (
      activeSection == null ||
      activeSection === 'date' ||
      activeSection === 'history'
    ) {
      dispatch(setActiveSection('date'))
    }
  }, [activeSection, dispatch, selectedDate])
}

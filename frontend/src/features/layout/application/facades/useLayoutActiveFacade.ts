import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setActiveSections } from '../state/layoutActions'
import { selectActiveSections } from '../state/layoutSelectors'
import type { ActiveSections } from '../../domain/types/layout.types'

export const useLayoutActiveFacade = () => {
  const dispatch = useAppDispatch()

  return {
    activeSections: useAppSelector(selectActiveSections),

    setActiveSection: (payload: Partial<ActiveSections>) =>
      dispatch(setActiveSections(payload)),
  }
}

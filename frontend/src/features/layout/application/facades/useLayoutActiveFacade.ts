import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setActiveSections } from '../state/layoutActions'
import { selectActiveSections } from '../state/layoutSelectors'
import type { ActiveSections } from '../../domain/layoutTypes'

export const useLayoutActiveFacade = () => {
  const dispatch = useAppDispatch()

  return {
    activeSections: useAppSelector(selectActiveSections),

    setActiveSection: (payload: Partial<ActiveSections>) =>
      dispatch(setActiveSections(payload)),
  }
}

import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { updateAroma } from '../state/aromaSlice'
import { selectAroma } from '../state/aromaSelectors'

export const useAromaFacade = () => {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(selectAroma)

  return {
    selected,
    update: (aroma: typeof selected) => dispatch(updateAroma(aroma)),
  }
}

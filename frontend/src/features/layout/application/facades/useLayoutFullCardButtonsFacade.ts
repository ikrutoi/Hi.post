import { useAppDispatch, useAppSelector } from '@app/hooks'
import { fullCardButtonsActions } from '../state/layoutActions'
import { selectFullCardButtons } from '../state/layoutSelectors'

export const useLayoutFullCardButtonsFacade = () => {
  const dispatch = useAppDispatch()

  return {
    fullCardButtons: useAppSelector(selectFullCardButtons),

    setButtonsVisibility: (payload: boolean) =>
      dispatch(fullCardButtonsActions.setButtonsVisibility(payload)),
    setButtonsLock: (payload: boolean) =>
      dispatch(fullCardButtonsActions.setButtonsLock(payload)),
  }
}

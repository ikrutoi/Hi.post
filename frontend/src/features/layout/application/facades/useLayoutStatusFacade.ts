import { useAppSelector } from '@app/hooks/useAppSelector'
import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { statusActions } from '../state/layoutActions'
import { selectIsLoading, selectError } from '../state/layoutSelectors'

export const useLayoutStatusFacade = () => {
  const dispatch = useAppDispatch()

  return {
    isLoading: useAppSelector(selectIsLoading),
    error: useAppSelector(selectError),

    setIsLoading: (value: boolean) => dispatch(statusActions.setLoading(value)),
    setError: (message: string | null) =>
      dispatch(statusActions.setError(message)),
  }
}

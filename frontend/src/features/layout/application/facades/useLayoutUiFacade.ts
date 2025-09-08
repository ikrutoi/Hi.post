import { useAppSelector } from '@app/hooks/useAppSelector'
import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { layoutUiActions } from '../state/layoutActions'
import { selectTheme, selectLayoutMode } from '../state/layoutSelectors'

export const useLayoutUiFacade = () => {
  const dispatch = useAppDispatch()

  return {
    theme: useAppSelector(selectTheme),
    layoutMode: useAppSelector(selectLayoutMode),

    setTheme: (value: 'light' | 'dark') =>
      dispatch(layoutUiActions.setTheme(value)),

    setLayoutMode: (mode: string) =>
      dispatch(layoutUiActions.setLayoutMode(mode)),
  }
}

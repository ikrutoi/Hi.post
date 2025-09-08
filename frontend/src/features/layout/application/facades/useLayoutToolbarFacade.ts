import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { toolbarActions } from '@layout/application/state'
import { selectBtnToolbar } from '@layout/application/state/toolbarSelectors'

export const useLayoutToolbarFacade = () => {
  const dispatch = useAppDispatch()

  return {
    btnToolbar: useAppSelector(selectBtnToolbar),
    setBtnToolbar: (
      payload: Partial<{
        firstBtn: string
        secondBtn: string
        section: string
      }>
    ) => dispatch(toolbarActions.setBtnToolbar(payload)),
  }
}

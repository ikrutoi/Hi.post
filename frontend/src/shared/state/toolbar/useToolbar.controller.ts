import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbar } from './toolbar.slice'
import { selectToolbarState } from './toolbar.selectors'

export const useToolbarController = () => {
  const dispatch = useAppDispatch()
  const toolbar = useAppSelector(selectToolbarState)

  const update = (payload: Partial<typeof toolbar>) =>
    dispatch(updateToolbar(payload))

  return { toolbar, update }
}

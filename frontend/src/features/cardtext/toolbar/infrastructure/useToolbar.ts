import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbar } from './toolbarSlice'
import { selectToolbar } from './toolbarSelectors'
import type { ToolbarState } from '../domain/toolbar.types'

export const useToolbar = () => {
  const dispatch = useAppDispatch()
  const toolbarState = useAppSelector(selectToolbar)

  const updateToolbarState = (payload: Partial<ToolbarState>) => {
    dispatch(updateToolbar(payload))
  }

  return {
    toolbarState,
    updateToolbarState,
  }
}

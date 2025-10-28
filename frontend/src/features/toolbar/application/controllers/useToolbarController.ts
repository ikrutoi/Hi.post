import { toolbarActions } from '../../infrastructure/state'
import type { AppDispatch } from '@app/state'
import type { ToolbarState } from '../../domain/types'

export const useToolbarController = (dispatch: AppDispatch) => ({
  update: (payload: Partial<ToolbarState>) =>
    dispatch(toolbarActions.updateToolbar(payload)),

  updateSection: <K extends keyof ToolbarState>(
    section: K,
    payload: Partial<ToolbarState[K]>
  ) => {
    dispatch(toolbarActions.updateToolbar({ [section]: payload }))
  },
  updateCurrent: <K extends keyof ToolbarState>(
    section: K,
    payload: Partial<ToolbarState[K]>
  ) => {
    dispatch(toolbarActions.updateToolbar({ [section]: payload }))
  },
  updateKey: <K extends keyof ToolbarState, Key extends keyof ToolbarState[K]>(
    section: K,
    key: Key,
    value: ToolbarState[K][Key]
  ) => {
    dispatch(toolbarActions.updateToolbar({ [section]: { [key]: value } }))
  },
  reset: () => dispatch(toolbarActions.resetToolbar()),
})

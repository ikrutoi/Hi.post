import type { AppDispatch } from '@app/state'
import type { ToolbarState } from '../../domain/types'
import { updateToolbar, resetToolbar } from '../../infrastructure/state'

export const useToolbarController = (dispatch: AppDispatch) => ({
  update: (payload: Partial<ToolbarState>) => dispatch(updateToolbar(payload)),
  reset: () => dispatch(resetToolbar()),
})

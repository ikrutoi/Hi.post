import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectToolbarSection } from '../../infrastructure/selectors'
import { useToolbarController } from '../../application/controllers'
import type { ToolbarState } from '../../domain/types'
import type { ToolbarSection } from '@toolbar/domain/types'

export const useToolbarFacade = <K extends ToolbarSection>(
  section: K,
  editor?: any
) => {
  const dispatch = useAppDispatch()
  const state = useAppSelector((s) => selectToolbarSection(s, section))

  const { actions } = useToolbarController(section, editor)

  return {
    state,
    actions: {
      ...actions,
      updateCurrent: (payload: Partial<ToolbarState[K]>) =>
        dispatch({
          type: 'toolbar/updateToolbar',
          payload: { [section]: payload },
        }),

      updateKey: <Key extends keyof ToolbarState[K]>(
        key: Key,
        value: ToolbarState[K][Key]
      ) =>
        dispatch({
          type: 'toolbar/updateToolbar',
          payload: { [section]: { [key]: value } },
        }),
    },
  }
}

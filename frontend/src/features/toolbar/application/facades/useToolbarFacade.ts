import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectToolbar } from '../../infrastructure/selectors'
import { useToolbarController } from '../../application/controllers'
import type { ToolbarState } from '../../domain/types'
import type { ToolbarSection } from '@toolbar/domain/types'

export const useToolbarFacade = <K extends ToolbarSection>(section: K) => {
  const dispatch = useAppDispatch()
  const toolbar = useAppSelector(selectToolbar)

  const actions = useToolbarController(dispatch)

  return {
    state: toolbar[section],
    actions: {
      ...actions,
      updateCurrent: (payload: Partial<ToolbarState[K]>) =>
        actions.updateSection(section, payload),

      updateKey: <Key extends keyof ToolbarState[K]>(
        key: Key,
        value: ToolbarState[K][Key]
      ) => actions.updateKey(section, key, value),
    },
  }
}

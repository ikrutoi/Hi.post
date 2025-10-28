import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import { selectToolbar } from '../../infrastructure/selectors'
import { useToolbarController } from '../../application/controllers'
import type { ToolbarState } from '../../domain/types'
import type { SectionsToolbar } from '@shared/config/constants'

export const useToolbarFacade = <K extends SectionsToolbar>(section: K) => {
  const dispatch = useAppDispatch()
  const toolbar = useSelector(selectToolbar)

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

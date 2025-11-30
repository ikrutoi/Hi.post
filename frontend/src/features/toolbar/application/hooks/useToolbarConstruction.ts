import { useToolbarFacade } from '../facades'
import { TOOLBAR_CONFIG } from '../../domain/config'
import type { ToolbarSection, ToolbarState } from '../../domain/types'

export const useToolbarConstruction = <S extends ToolbarSection>(
  section: S
) => {
  const { state } = useToolbarFacade(section)
  const config = TOOLBAR_CONFIG[section]

  const badges = config.getBadges
    ? config.getBadges(state as ToolbarState[S])
    : {}

  return {
    keys: config.keys,
    onAction: config.onAction,
    badges,
    state: state as ToolbarState[S],
  }
}

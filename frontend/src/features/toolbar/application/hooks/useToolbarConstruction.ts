import { useToolbarFacade } from '../facades'
import { TOOLBAR_CONFIG } from '../../domain/config'
import { buildToolbarGroup } from '../helpers'
import type {
  ToolbarSection,
  ToolbarState,
  ToolbarGroup,
  ToolbarSectionConfigMap,
} from '../../domain/types'
import type { IconState } from '@shared/config/constants'
import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'

function getToolbarConfig<S extends ToolbarSection>(
  section: S,
): ToolbarSectionConfigMap[S] {
  return TOOLBAR_CONFIG[section]
}

// export const useToolbarConstruction = <S extends ToolbarSection>(
//   section: S
// ) => {
//   const { state } = useToolbarFacade(section)
//   const config = getToolbarConfig(section)

//   const groups: ToolbarGroup[] = config.toolbar
//     ? config.toolbar.map((group) =>
//         buildToolbarGroup(
//           group.group,
//           group.icons.map((icon) => icon.key),
//           state as Record<string, IconState>
//         )
//       )
//     : [
//         buildToolbarGroup(
//           config.group,
//           config.keys,
//           state as Record<string, IconState>
//         ),
//       ]

//   const typedState = state as ToolbarState[S]
//   const badges = config.getBadges?.(typedState as any) ?? {}

//   return {
//     config: groups,
//     onAction: config.onAction as (
//       key: keyof ToolbarState[S],
//       section: S,
//       editor: ReactEditor,
//       dispatch: AppDispatch
//     ) => void,
//     badges,
//     state: typedState,
//   }
// }

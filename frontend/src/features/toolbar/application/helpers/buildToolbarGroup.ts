import type { ToolbarGroup } from '../../domain/types'
import type { IconKey, IconState } from '@shared/config/constants'

export function buildToolbarGroup(
  group: string,
  keys: ReadonlyArray<string>,
  state: Record<string, IconState>
): ToolbarGroup {
  return {
    group,
    icons: keys.map((key) => ({
      key: key as IconKey,
      state: state[key] as IconState,
    })),
  }
}

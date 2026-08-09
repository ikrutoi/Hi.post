import type { ToolbarConfig } from '../types'

/** Clone toolbar groups with every group/icon forced to disabled. */
export function withDisabledToolbarGroups(
  config: ToolbarConfig,
): ToolbarConfig {
  return config.map((group) => ({
    ...group,
    status: 'disabled',
    icons: group.icons.map((icon) => ({
      ...icon,
      state: 'disabled',
    })),
  }))
}

import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig, ToolbarIcon } from '../types'

export const flattenIcons = (groups: ToolbarConfig): [IconKey, IconState][] => {
  const result: [IconKey, IconState][] = []

  const walk = (icons: ToolbarIcon[]) => {
    for (const icon of icons) {
      result.push([icon.key, icon.state])
      if (icon.children?.length) {
        walk(icon.children)
      }
    }
  }

  for (const group of groups) {
    walk(group.icons)
  }

  return result
}

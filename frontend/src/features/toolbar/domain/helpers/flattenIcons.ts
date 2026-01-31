import type { ToolbarConfig } from '../types'

export const flattenIcons = (config: ToolbarConfig) => {
  return config.flatMap((group) =>
    group.icons.map((icon) => [
      icon.key,
      {
        state: icon.state,
        options: icon.options || {},
      },
    ]),
  )
}

import { toolbarIcons } from '@shared/assets/icons/toolbarIcons'
import type { IconKey } from '@shared/types/toolbar'

export const getToolbarIcon = (key: IconKey) => toolbarIcons[key]

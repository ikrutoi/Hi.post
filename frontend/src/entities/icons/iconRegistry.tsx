import { JSX } from 'react/jsx-runtime'
import {
  SaveIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
} from '@shared/uiLegacy/icons/index'
import { IconKey } from './types'

const iconRegistry: Record<IconKey, JSX.Element> = {
  save: <SaveIcon />,
  delete: <DeleteIcon />,
  edit: <EditIcon />,
  info: <InfoIcon />,
  custom: <div>🔧</div>,
}

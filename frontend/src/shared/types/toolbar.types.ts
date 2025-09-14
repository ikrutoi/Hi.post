export type ToolbarButton =
  | 'save'
  | 'clip'
  | 'delete'
  | 'remove'
  | 'download'
  | 'user'
  | 'turn'
  | 'edit'
  | 'maximaze'
  | 'crop'
  | 'reset'
  | 'bold'
  | 'italic'
  | 'fontSize'
  | 'color'
  | 'left'
  | 'center'
  | 'right'
  | 'justify'
  | 'shopping'
  | 'addShopping'
  | 'plus'
  | 'arrowsOut'
  | 'arrowsIn'

export type IconKey = ToolbarButton

export type ToolbarButtonGroup =
  | 'file'
  | 'user'
  | 'image'
  | 'text'
  | 'system'
  | 'misc'

export interface ToolbarButtonConfig {
  key: ToolbarButton
  iconKey: IconKey
  tooltip: string
  color?: string
  group?: ToolbarButtonGroup
  visible?: boolean
}

export interface IconMeta {
  key: ToolbarButton
  iconKey: IconKey
  tooltip: string
  color?: string
  group?: ToolbarButtonGroup
  visible?: boolean
}

export interface ToolbarState {
  download: boolean
  save: boolean
  delete: boolean
  turn: boolean
  maximize: boolean
  crop: boolean
}

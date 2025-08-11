export type IconKey = 'save' | 'delete' | 'edit' | 'info' | 'custom'

export interface IconMeta {
  key: IconKey
  label: string
  color?: string
  group?: 'system' | 'user' | 'file' | 'misc'
}

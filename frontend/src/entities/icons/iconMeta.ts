import { IconMeta } from './types'

export const iconMeta: Record<IconMeta['key'], IconMeta> = {
  save: { key: 'save', label: 'Save', group: 'file' },
  delete: { key: 'delete', label: 'Delete', group: 'user', color: 'red' },
  edit: { key: 'edit', label: 'Edit', group: 'file' },
  info: { key: 'info', label: 'Info', group: 'system' },
  custom: { key: 'custom', label: 'Custom', group: 'misc' },
}

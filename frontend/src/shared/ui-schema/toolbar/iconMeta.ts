import type { IconMeta, ToolbarButton } from '@shared/types/toolbar'

export const iconMeta: Partial<Record<ToolbarButton, IconMeta>> = {
  save: { key: 'save', iconKey: 'save', tooltip: 'Save', group: 'file' },
  delete: {
    key: 'delete',
    iconKey: 'delete',
    tooltip: 'Delete',
    group: 'user',
    color: 'red',
  },
  remove: {
    key: 'remove',
    iconKey: 'remove',
    tooltip: 'Remove',
    group: 'user',
    color: 'red',
  },

  clip: { key: 'clip', iconKey: 'clip', tooltip: 'Attach', group: 'file' },
  download: {
    key: 'download',
    iconKey: 'download',
    tooltip: 'Download',
    group: 'file',
  },
  reset: {
    key: 'reset',
    iconKey: 'reset',
    tooltip: 'Reset',
    group: 'system',
  },

  edit: { key: 'edit', iconKey: 'edit', tooltip: 'Edit', group: 'file' },
  user: { key: 'user', iconKey: 'user', tooltip: 'User', group: 'user' },
  turn: { key: 'turn', iconKey: 'turn', tooltip: 'Rotate', group: 'image' },
  maximaze: {
    key: 'maximaze',
    iconKey: 'maximaze',
    tooltip: 'Fullscreen',
    group: 'image',
  },
  crop: { key: 'crop', iconKey: 'crop', tooltip: 'Crop', group: 'image' },

  bold: { key: 'bold', iconKey: 'bold', tooltip: 'Bold', group: 'text' },
  italic: {
    key: 'italic',
    iconKey: 'italic',
    tooltip: 'Italic',
    group: 'text',
  },
  fontSize: {
    key: 'fontSize',
    iconKey: 'fontSize',
    tooltip: 'Font Size',
    group: 'text',
  },
  color: {
    key: 'color',
    iconKey: 'color',
    tooltip: 'Text Color',
    group: 'text',
  },
  left: {
    key: 'left',
    iconKey: 'left',
    tooltip: 'Align Left',
    group: 'text',
  },
  center: {
    key: 'center',
    iconKey: 'center',
    tooltip: 'Align Center',
    group: 'text',
  },
  right: {
    key: 'right',
    iconKey: 'right',
    tooltip: 'Align Right',
    group: 'text',
  },
  justify: {
    key: 'justify',
    iconKey: 'justify',
    tooltip: 'Justify',
    group: 'text',
  },

  shopping: {
    key: 'shopping',
    iconKey: 'shopping',
    tooltip: 'Cart',
    group: 'misc',
  },
  addShopping: {
    key: 'addShopping',
    iconKey: 'addShopping',
    tooltip: 'Add to Cart',
    group: 'misc',
  },
  plus: { key: 'plus', iconKey: 'plus', tooltip: 'Add', group: 'misc' },
  arrowsOut: {
    key: 'arrowsOut',
    iconKey: 'arrowsOut',
    tooltip: 'Expand',
    group: 'system',
  },
  arrowsIn: {
    key: 'arrowsIn',
    iconKey: 'arrowsIn',
    tooltip: 'Collapse',
    group: 'system',
  },
}

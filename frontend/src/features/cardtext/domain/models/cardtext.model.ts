import type { CardtextState } from '../types'

export const initialCardtextState: CardtextState = {
  text: [{ type: 'paragraph', children: [{ text: '' }] }],
  colorName: 'blueribbon',
  colorType: 'rgba(0, 122, 255, 0.8)',
  font: '',
  fontSize: 10,
  fontStyle: 'italic',
  fontWeight: 500,
  textAlign: 'left',
  lineHeight: null,
  miniCardtextStyle: { maxLines: null, fontSize: null, lineHeight: null },
}

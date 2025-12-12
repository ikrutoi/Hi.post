import type { CardtextValue } from '../types'

export function extractPlainText(value: CardtextValue): string {
  return value
    .map((block) => block.children.map((child) => child.text).join(' '))
    .join('\n')
}

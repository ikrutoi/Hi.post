import type {
  TemplateStripItem,
  TemplateStripScrollIndex,
  SliderLetter,
} from '../../domain/types'

function getFirstLetter(item: TemplateStripItem): string {
  switch (item.section) {
    case 'sender':
    case 'recipient':
      return (item.template.address?.name ?? '')[0]?.toUpperCase() ?? ''
    case 'cardtext': {
      const value = item.template.value
      const firstBlock = Array.isArray(value) ? value[0] : null
      const firstText = firstBlock?.children?.[0]
      const str =
        typeof firstText === 'object' &&
        firstText !== null &&
        'text' in firstText
          ? (firstText as { text: string }).text
          : ''
      return str[0]?.toUpperCase() ?? ''
    }
    case 'cardphoto':
      return (
        (item.template.theme ?? item.template.id ?? '')[0]?.toUpperCase() ?? ''
      )
    default:
      return ''
  }
}

export function buildTemplateStripScrollIndex(
  items: TemplateStripItem[],
): TemplateStripScrollIndex {
  const firstLetters: SliderLetter[] = items.map((item, index) => ({
    letter: getFirstLetter(item),
    id: String(item.template.id ?? index),
    index,
  }))
  return {
    totalCount: items.length,
    firstLetters,
  }
}

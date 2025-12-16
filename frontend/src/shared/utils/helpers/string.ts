export const capitalize = (str: string | null | undefined): string =>
  str && str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : ''

export const camelCase = (str: string | null | undefined): string =>
  str
    ? str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (c) => c.toLowerCase())
    : ''

export const kebabCase = (str: string | null | undefined): string =>
  str
    ? str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase()
    : ''

export const capitalize = (str: string | null | undefined): string =>
  str && str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : ''

/** First character of the string and of each word after whitespace → uppercase. */
export const capitalizeWords = (str: string): string =>
  str.replace(/(^|\s)(\S)/g, (_, lead: string, ch: string) => lead + ch.toUpperCase())

/**
 * Soft title-case for address fields without fighting the keyboard.
 * - single keystroke (incl. new word after space) → keep typed case (Shift/Caps)
 * - delete / same-length overwrite → keep user text as-is
 * - paste / multi-insert → title-case the inserted slice only
 *
 * Mobile also uses `autoCapitalize="words"` for the usual “start with capital”
 * assist; desktop users capitalize with Shift when they want it.
 */
export const applyTitleCaseInput = (prev: string, next: string): string => {
  if (next === prev) return next
  if (next.length < prev.length) return next
  if (next.length === prev.length) return next

  let prefixLen = 0
  const minLen = Math.min(prev.length, next.length)
  while (prefixLen < minLen && prev[prefixLen] === next[prefixLen]) {
    prefixLen++
  }

  let suffixLen = 0
  while (
    suffixLen < prev.length - prefixLen &&
    suffixLen < next.length - prefixLen &&
    prev[prev.length - 1 - suffixLen] === next[next.length - 1 - suffixLen]
  ) {
    suffixLen++
  }

  const inserted = next.slice(prefixLen, next.length - suffixLen)
  if (!inserted) return next

  /** One key at a time: never override keyboard case. */
  if (inserted.length === 1) return next

  const atWordStart =
    prefixLen === 0 || /\s/.test(next[prefixLen - 1] ?? '')

  const titledInserted = atWordStart
    ? capitalizeWords(inserted)
    : inserted.replace(/(\s)(\S)/g, (_, lead: string, ch: string) =>
        lead + ch.toUpperCase(),
      )

  return (
    next.slice(0, prefixLen) +
    titledInserted +
    next.slice(next.length - suffixLen)
  )
}

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

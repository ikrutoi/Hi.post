import { describe, expect, it } from 'vitest'
import { nextFocusedDispatchDateKey } from './nextFocusedDispatchDateKey'

describe('nextFocusedDispatchDateKey', () => {
  const keys = ['2026-8-14', '2026-8-15']

  it('from overview goes to the first date', () => {
    expect(nextFocusedDispatchDateKey(keys, null)).toBe('2026-8-14')
  })

  it('from the first date goes to the second', () => {
    expect(nextFocusedDispatchDateKey(keys, '2026-8-14')).toBe('2026-8-15')
  })

  it('from the last date returns to overview', () => {
    expect(nextFocusedDispatchDateKey(keys, '2026-8-15')).toBeNull()
  })

  it('does not cycle a single date', () => {
    expect(nextFocusedDispatchDateKey(['2026-8-14'], null)).toBeNull()
    expect(nextFocusedDispatchDateKey(['2026-8-14'], '2026-8-14')).toBe(
      '2026-8-14',
    )
  })
})

import { describe, expect, it } from 'vitest'
import { nextFocusedRecipientSlotKey } from './nextFocusedRecipientSlotKey'

describe('nextFocusedRecipientSlotKey', () => {
  const ids = ['a', 'b']

  it('from overview goes to the first address', () => {
    expect(nextFocusedRecipientSlotKey(ids, null)).toBe('a')
  })

  it('from the first address goes to the second', () => {
    expect(nextFocusedRecipientSlotKey(ids, 'a')).toBe('b')
  })

  it('from the last address returns to overview', () => {
    expect(nextFocusedRecipientSlotKey(ids, 'b')).toBeNull()
  })

  it('does not cycle a single address', () => {
    expect(nextFocusedRecipientSlotKey(['a'], null)).toBeNull()
    expect(nextFocusedRecipientSlotKey(['a'], 'a')).toBe('a')
  })
})

import { describe, expect, it } from 'vitest'
import type { PostcardHydrated } from '@entities/postcard'
import { separateDuplicatePostcardLocalIds } from './separateDuplicatePostcardLocalIds'

function stub(
  partial: Partial<PostcardHydrated> & { id: string; localId: number },
): PostcardHydrated {
  return {
    status: 'cart',
    price: '',
    createdAt: 1,
    updatedAt: 1,
    date: { year: 2026, month: 1, day: 1 },
    postcard: { cardphoto: '', cardtext: '', recipient: '', aroma: '0' },
    card: {
      id: partial.id,
      thumbnailUrl: '',
      cardphoto: {} as PostcardHydrated['card']['cardphoto'],
      cardtext: {} as PostcardHydrated['card']['cardtext'],
      envelope: {} as PostcardHydrated['card']['envelope'],
      aroma: { index: 0 },
      date: { year: 2026, month: 1, day: 1 },
    },
    ...partial,
  }
}

describe('separateDuplicatePostcardLocalIds', () => {
  it('gives the later postcard a free localId and keeps the earlier one', () => {
    const early = stub({ id: 'a', localId: 2, createdAt: 10 })
    const late = stub({ id: 'b', localId: 2, createdAt: 20 })
    const other = stub({ id: 'c', localId: 4, createdAt: 15 })

    const { rows, changed } = separateDuplicatePostcardLocalIds(
      [late, other, early],
      99,
    )

    expect(rows.find((row) => row.id === 'a')?.localId).toBe(2)
    expect(rows.find((row) => row.id === 'b')?.localId).toBe(5)
    expect(rows.find((row) => row.id === 'b')?.updatedAt).toBe(99)
    expect(rows.find((row) => row.id === 'c')?.localId).toBe(4)
    expect(changed.map((row) => row.id)).toEqual(['b'])
    expect(rows.map((row) => row.id)).toEqual(['b', 'c', 'a'])
  })

  it('leaves unique localIds unchanged', () => {
    const rows = [
      stub({ id: 'a', localId: 1 }),
      stub({ id: 'b', localId: 2 }),
    ]
    const separated = separateDuplicatePostcardLocalIds(rows, 50)
    expect(separated.changed).toEqual([])
    expect(separated.rows).toEqual(rows)
  })
})

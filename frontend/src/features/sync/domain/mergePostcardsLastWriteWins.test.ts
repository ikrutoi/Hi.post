import { describe, expect, it } from 'vitest'
import type { PostcardHydrated } from '@entities/postcard'
import { mergePostcardsLastWriteWins } from './mergePostcardsLastWriteWins'

function stub(partial: Partial<PostcardHydrated> & { id: string }): PostcardHydrated {
  return {
    localId: 1,
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

describe('mergePostcardsLastWriteWins', () => {
  it('keeps the newer row and pushes local-only or local-newer', () => {
    const localNewer = stub({ id: 'a', updatedAt: 20 })
    const remoteOlder = stub({ id: 'a', updatedAt: 10, status: 'ready' })
    const localOnly = stub({ id: 'b', updatedAt: 5 })
    const remoteOnly = stub({ id: 'c', updatedAt: 8, status: 'sent' })

    const { nextLocal, push } = mergePostcardsLastWriteWins(
      [localNewer, localOnly],
      [remoteOlder, remoteOnly],
    )

    const byId = Object.fromEntries(nextLocal.map((row) => [row.id, row]))
    expect(byId.a?.updatedAt).toBe(20)
    expect(byId.b?.id).toBe('b')
    expect(byId.c?.status).toBe('sent')
    expect(push.map((row) => row.id).sort()).toEqual(['a', 'b'])
  })

  it('keeps remote when updatedAt is equal', () => {
    const local = stub({ id: 'a', updatedAt: 10, status: 'cart' })
    const remote = stub({ id: 'a', updatedAt: 10, status: 'ready' })
    const { nextLocal, push } = mergePostcardsLastWriteWins([local], [remote])
    expect(nextLocal[0]?.status).toBe('ready')
    expect(push).toEqual([])
  })
})

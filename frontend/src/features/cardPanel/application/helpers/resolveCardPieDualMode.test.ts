import { describe, expect, it } from 'vitest'
import {
  mayWriteAssemblyFromMiniOpen,
  resolveCardPieDualMode,
} from './resolveCardPieDualMode'

describe('resolveCardPieDualMode', () => {
  it('maps left station to assembly branch in view', () => {
    const snap = resolveCardPieDualMode({
      activePieSide: 'left',
      archiveLocalId: 12,
      archiveSource: 'cart',
      archiveStatus: 'cart',
      archiveEditEngaged: false,
    })
    expect(snap.dataBranch).toBe('assembly')
    expect(snap.interaction).toBe('view')
    expect(snap.archive).toBeNull()
  })

  it('maps right station to archive branch with postcard ref', () => {
    const snap = resolveCardPieDualMode({
      activePieSide: 'right',
      archiveLocalId: 12,
      archiveSource: 'cart',
      archiveStatus: 'cartBlocked',
      archiveEditEngaged: false,
    })
    expect(snap.dataBranch).toBe('archive')
    expect(snap.interaction).toBe('view')
    expect(snap.archive).toEqual({
      branch: 'archive',
      localId: 12,
      source: 'cart',
      status: 'cartBlocked',
    })
  })

  it('marks archive edit interaction when cardPieEdit engaged', () => {
    const snap = resolveCardPieDualMode({
      activePieSide: 'right',
      archiveLocalId: 3,
      archiveSource: 'history',
      archiveStatus: 'sent',
      archiveEditEngaged: true,
    })
    expect(snap.dataBranch).toBe('archive')
    expect(snap.interaction).toBe('edit')
  })
})

describe('mayWriteAssemblyFromMiniOpen', () => {
  const assemblyOk = {
    dataBranch: 'assembly' as const,
    archiveEditEngaged: false,
    peekToolbarOnMiniOpen: false,
    mirrorTargetLocalId: null as number | null,
  }

  it('allows assembly mini open in left view', () => {
    expect(mayWriteAssemblyFromMiniOpen(assemblyOk)).toBe(true)
  })

  it('blocks archive face', () => {
    expect(
      mayWriteAssemblyFromMiniOpen({
        ...assemblyOk,
        dataBranch: 'archive',
      }),
    ).toBe(false)
  })

  it('blocks when archive postcard is mirrored into the strip', () => {
    expect(
      mayWriteAssemblyFromMiniOpen({
        ...assemblyOk,
        mirrorTargetLocalId: 9,
      }),
    ).toBe(false)
  })

  it('blocks peek and archive-edit', () => {
    expect(
      mayWriteAssemblyFromMiniOpen({
        ...assemblyOk,
        peekToolbarOnMiniOpen: true,
      }),
    ).toBe(false)
    expect(
      mayWriteAssemblyFromMiniOpen({
        ...assemblyOk,
        archiveEditEngaged: true,
      }),
    ).toBe(false)
  })
})

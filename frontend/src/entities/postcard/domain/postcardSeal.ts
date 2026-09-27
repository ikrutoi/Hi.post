import type {
  PostcardHydrated,
  PostcardSeal,
  PostcardStatus,
} from './types/postcard.types'

const SEAL_SHIFT_LEFT_RATIO = 0.03
const SEAL_SHIFT_RIGHT_RATIO = 0.06
const SEAL_SHIFT_UP_RATIO = 0.06
const SEAL_SHIFT_DOWN_RATIO = 0.02
const SEAL_ROTATION_DEG = 40

export function postcardKeepsSeal(status: PostcardStatus): boolean {
  return status === 'sent' || status === 'delivered'
}

export function createPostcardSeal(): PostcardSeal {
  return {
    x:
      -SEAL_SHIFT_LEFT_RATIO +
      Math.random() * (SEAL_SHIFT_LEFT_RATIO + SEAL_SHIFT_RIGHT_RATIO),
    y:
      -SEAL_SHIFT_UP_RATIO +
      Math.random() * (SEAL_SHIFT_UP_RATIO + SEAL_SHIFT_DOWN_RATIO),
    rotate: (Math.random() * 2 - 1) * SEAL_ROTATION_DEG,
    outline: Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3,
    outlineRotate: Math.random() * 360,
  }
}

/** Sent/delivered получают печать один раз. Остальные статусы поле не хранят. */
export function applyPostcardSeal(postcard: PostcardHydrated): PostcardHydrated {
  if (!postcardKeepsSeal(postcard.status)) {
    if (postcard.seal == null) return postcard
    const { seal: _removed, ...rest } = postcard
    return { ...rest, updatedAt: Date.now() }
  }
  if (postcard.seal != null) return postcard
  return {
    ...postcard,
    seal: createPostcardSeal(),
    updatedAt: Date.now(),
  }
}

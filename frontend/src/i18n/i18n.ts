import { getActiveLang } from './langPreference'
import type { Lang } from './types'

export const i18n = {
  get language(): Lang {
    return getActiveLang()
  },
}

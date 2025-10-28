import { getSafeLang } from './helpers'
import { DEFAULT_LANG } from './config'

export const i18n = {
  language: getSafeLang(
    localStorage.getItem('lang') ?? navigator.language ?? DEFAULT_LANG
  ),
}

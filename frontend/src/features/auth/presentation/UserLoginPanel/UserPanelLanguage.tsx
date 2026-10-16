import React from 'react'
import clsx from 'clsx'
import {
  LANG_ENDONYMS,
  LANGS_BY_ENDONYM,
} from '@i18n/catalogs/languageNames'
import { setLangPreference, useLangSnapshot } from '@i18n/langPreference'
import type { Lang } from '@i18n/types'
import { IconLanguage } from '@shared/ui/icons'
import styles from './UserLoginPanel.module.scss'

export const UserPanelLanguage: React.FC = () => {
  const { preference, detected } = useLangSnapshot()

  return (
    <div className={styles.languageList} role="radiogroup" aria-label="Language">
      <button
        type="button"
        role="radio"
        className={clsx(
          styles.languageRow,
          preference === 'auto' && styles.languageRowSelected,
        )}
        aria-checked={preference === 'auto'}
        onClick={() => setLangPreference('auto')}
      >
        <IconLanguage className={styles.languageRowIcon} aria-hidden />
        <span>Auto</span>
        <span className={styles.languageRowResolved}>
          {LANG_ENDONYMS[detected]}
        </span>
      </button>
      {LANGS_BY_ENDONYM.map((lang) => (
        <LanguageRow
          key={lang}
          lang={lang}
          selected={preference === lang}
        />
      ))}
    </div>
  )
}

const LanguageRow: React.FC<{ lang: Lang; selected: boolean }> = ({
  lang,
  selected,
}) => (
  <button
    type="button"
    role="radio"
    className={clsx(styles.languageRow, selected && styles.languageRowSelected)}
    aria-checked={selected}
    dir="auto"
    onClick={() => setLangPreference(lang)}
  >
    {LANG_ENDONYMS[lang]}
  </button>
)

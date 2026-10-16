import React from 'react'
import { IconLanguage } from '@shared/ui/icons'
import styles from './UserLoginPanel.module.scss'

type UserPanelSettingsProps = {
  onOpenLanguage: () => void
}

export const UserPanelSettings: React.FC<UserPanelSettingsProps> = ({
  onOpenLanguage,
}) => (
  <div className={styles.settingsGrid} role="list" aria-label="Settings">
    <button
      type="button"
      className={styles.settingsCell}
      aria-label="Language"
      onClick={onOpenLanguage}
    >
      <IconLanguage
        className={`${styles.hubTileIcon} ${styles.settingsLanguageIcon}`}
        aria-hidden
      />
    </button>
  </div>
)

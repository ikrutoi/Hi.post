import React from 'react'
import { IconInfo } from '@shared/ui/icons'
import styles from './UserLoginPanel.module.scss'

export type UserPanelHubSection = 'registration' | 'info' | 'settings'

const HUB_TILES: ReadonlyArray<{
  id: UserPanelHubSection
  label: string
}> = [
  { id: 'registration', label: 'Registration' },
  { id: 'info', label: 'Info' },
  { id: 'settings', label: 'Settings' },
]

type UserPanelHubProps = {
  onOpenSection: (section: UserPanelHubSection) => void
}

export const UserPanelHub: React.FC<UserPanelHubProps> = ({
  onOpenSection,
}) => (
  <div
    className={styles.hubGrid}
    role="list"
    aria-label="Account sections"
  >
    {HUB_TILES.map((tile) => (
      <button
        key={tile.id}
        type="button"
        className={styles.hubTile}
        aria-label={tile.label}
        onClick={() => onOpenSection(tile.id)}
      >
        {tile.id === 'info' ? (
          <IconInfo className={styles.hubTileIcon} aria-hidden />
        ) : (
          <span className={styles.hubTileLabel}>{tile.label}</span>
        )}
      </button>
    ))}
  </div>
)

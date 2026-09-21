import React from 'react'
import styles from './UserLoginPanel.module.scss'

export type UserPanelHubSection = 'registration' | 'info' | 'settings'

const HUB_COLUMNS = 3
const HUB_ROWS = 2
const HUB_SLOTS = HUB_COLUMNS * HUB_ROWS

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
    {Array.from({ length: HUB_SLOTS }, (_, index) => {
      const tile = HUB_TILES[index]
      if (tile == null) {
        return (
          <div
            key={`hub-empty-${index}`}
            className={styles.hubTileEmpty}
            role="presentation"
          />
        )
      }

      return (
        <button
          key={tile.id}
          type="button"
          className={styles.hubTile}
          onClick={() => onOpenSection(tile.id)}
        >
          <span className={styles.hubTileLabel}>{tile.label}</span>
        </button>
      )
    })}
  </div>
)

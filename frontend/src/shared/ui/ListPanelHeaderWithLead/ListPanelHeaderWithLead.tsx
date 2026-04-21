import React, { type ReactNode } from 'react'
import type { IconKey } from '@shared/config/constants'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './ListPanelHeaderWithLead.module.scss'

type Props = {
  /** Toolbar list key icon (same asset as the strip / list action). */
  leadIconKey: IconKey
  /** List row toolbar; omit when the panel has no actions (e.g. empty address book). */
  toolbar?: ReactNode | null
}

export const ListPanelHeaderWithLead: React.FC<Props> = ({
  leadIconKey,
  toolbar,
}) => {
  return (
    <div className={styles.row}>
      <div
        className={styles.lead}
        aria-hidden
        data-icon-state="disabled"
      >
        {getToolbarIcon({ key: leadIconKey })}
      </div>
      {toolbar != null && toolbar !== false ? (
        <div className={styles.toolbarGrow}>{toolbar}</div>
      ) : null}
    </div>
  )
}

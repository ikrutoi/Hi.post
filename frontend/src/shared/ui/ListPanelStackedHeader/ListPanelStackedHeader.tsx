import React, { type ReactNode } from 'react'
import type { IconKey } from '@shared/config/constants'
import { IconX } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import clsx from 'clsx'
import styles from './ListPanelStackedHeader.module.scss'

export type ListPanelStackedHeaderProps = {
  leadIconKey: IconKey
  /** Second row under the divider; omit when the panel has no list toolbar. */
  toolbar?: ReactNode | null | false
  onClose: () => void
  closeAriaLabel: string
}

export const ListPanelStackedHeader: React.FC<ListPanelStackedHeaderProps> = ({
  leadIconKey,
  toolbar,
  onClose,
  closeAriaLabel,
}) => {
  const hasToolbar = toolbar != null && toolbar !== false

  return (
    <div
      className={clsx(styles.header, !hasToolbar && styles.headerCompact)}
    >
      <div className={styles.headerTopRow}>
        <div
          className={styles.headerLead}
          aria-hidden
          data-icon-state="disabled"
        >
          {getToolbarIcon({ key: leadIconKey })}
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={closeAriaLabel}
        >
          <IconX />
        </button>
      </div>
      {hasToolbar ? (
        <>
          <div className={styles.headerDivider} role="separator" aria-hidden />
          <div className={styles.headerToolbarRow}>{toolbar}</div>
        </>
      ) : null}
    </div>
  )
}

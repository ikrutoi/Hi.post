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
  /**
   * Линия под строкой с иконкой и закрытием, если тулбара нет (например кнопки вынесены в полосу под шапкой).
   */
  showDividerWithoutToolbar?: boolean
  onClose: () => void
  closeAriaLabel: string
}

export const ListPanelStackedHeader: React.FC<ListPanelStackedHeaderProps> = ({
  leadIconKey,
  toolbar,
  showDividerWithoutToolbar = false,
  onClose,
  closeAriaLabel,
}) => {
  const hasToolbar = toolbar != null && toolbar !== false
  const showDividerOnly = !hasToolbar && showDividerWithoutToolbar

  return (
    <div
      className={clsx(
        styles.header,
        !hasToolbar &&
          (showDividerOnly
            ? styles.headerCompactWithDivider
            : styles.headerCompact),
      )}
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
      ) : showDividerOnly ? (
        <div className={styles.headerDivider} role="separator" aria-hidden />
      ) : null}
    </div>
  )
}

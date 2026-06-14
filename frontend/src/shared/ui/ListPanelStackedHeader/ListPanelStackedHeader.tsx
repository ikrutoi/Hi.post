import React, { type ReactNode } from 'react'
import type { IconKey } from '@shared/config/constants'
import { IconX } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import clsx from 'clsx'
import styles from './ListPanelStackedHeader.module.scss'

export type ListPanelStackedHeaderProps = {
  leadIconKey: IconKey
  /** Replaces the default lead toolbar icon (e.g. user avatar). */
  leadIconOverride?: ReactNode
  /**
   * Контент по центру верхней строки (между ведущей иконкой и закрытием),
   * например переключатели сегментов в списке корзины.
   */
  headerTopCenter?: ReactNode | null | false
  /** Second row under the divider; omit when the panel has no list toolbar. */
  toolbar?: ReactNode | null | false
  /**
   * Линия под строкой с иконкой и закрытием, если тулбара нет (например кнопки вынесены в полосу под шапкой).
   */
  showDividerWithoutToolbar?: boolean
  /** sectionToolbar: иконки как в toolbar cardphoto (1.2rem). */
  variant?: 'default' | 'sectionToolbar'
  onClose: () => void
  closeAriaLabel: string
}

export const ListPanelStackedHeader: React.FC<ListPanelStackedHeaderProps> = ({
  leadIconKey,
  leadIconOverride,
  headerTopCenter,
  toolbar,
  showDividerWithoutToolbar = false,
  variant = 'default',
  onClose,
  closeAriaLabel,
}) => {
  const hasToolbar = toolbar != null && toolbar !== false
  const showDividerOnly = !hasToolbar && showDividerWithoutToolbar
  const hasTopCenter = headerTopCenter != null && headerTopCenter !== false

  return (
    <div
      className={clsx(
        styles.header,
        variant === 'sectionToolbar' && styles.headerSectionToolbar,
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
          data-icon-state="enabled"
        >
          {leadIconOverride ?? getToolbarIcon({ key: leadIconKey })}
        </div>
        <div
          className={styles.headerTopCenterSlot}
          {...(!hasTopCenter ? { 'aria-hidden': true as const } : {})}
        >
          {hasTopCenter ? headerTopCenter : null}
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

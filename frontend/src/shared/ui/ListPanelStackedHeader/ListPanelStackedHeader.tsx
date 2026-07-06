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
  /** Archive list panels (CardPie, cart, history, …): header icons at 85% of standard. */
  cardPieListHeaderIcons?: boolean
  /** Клик по ведущей иконке (например мобильный список → календарь). */
  onLeadIconClick?: () => void
  leadIconAriaLabel?: string
  /** Скрыть ведущую иконку (мобильные списки cart/history). */
  hideLeadIcon?: boolean
  /** Скрыть кнопку закрытия (мобильные списки cart/history). */
  hideClose?: boolean
  onClose?: () => void
  closeAriaLabel?: string
}

export const ListPanelStackedHeader: React.FC<ListPanelStackedHeaderProps> = ({
  leadIconKey,
  leadIconOverride,
  headerTopCenter,
  toolbar,
  showDividerWithoutToolbar = false,
  variant = 'default',
  cardPieListHeaderIcons = false,
  onLeadIconClick,
  leadIconAriaLabel,
  hideLeadIcon = false,
  hideClose = false,
  onClose,
  closeAriaLabel = 'Close list',
}) => {
  const hasToolbar = toolbar != null && toolbar !== false
  const showDividerOnly = !hasToolbar && showDividerWithoutToolbar
  const hasTopCenter = headerTopCenter != null && headerTopCenter !== false
  const showLeadIcon = !hideLeadIcon
  const showClose = !hideClose
  const leadIconContent = leadIconOverride ?? getToolbarIcon({ key: leadIconKey })
  const leadIconClassName = clsx(
    styles.headerLead,
    onLeadIconClick != null && styles.headerLeadClickable,
  )

  return (
    <div
      className={clsx(
        styles.header,
        variant === 'sectionToolbar' && styles.headerSectionToolbar,
        cardPieListHeaderIcons && styles.headerCardPieListArchive,
        !hasToolbar &&
          (showDividerOnly
            ? styles.headerCompactWithDivider
            : styles.headerCompact),
      )}
    >
      <div
        className={clsx(
          styles.headerTopRow,
          !showLeadIcon && !showClose && styles.headerTopRowMinimal,
        )}
      >
        {showLeadIcon ? (
          onLeadIconClick != null ? (
            <button
              type="button"
              className={leadIconClassName}
              data-icon-state="enabled"
              data-lead-icon={leadIconOverride ? undefined : leadIconKey}
              onClick={onLeadIconClick}
              aria-label={leadIconAriaLabel ?? 'Open calendar'}
            >
              {leadIconContent}
            </button>
          ) : (
            <div
              className={leadIconClassName}
              aria-hidden
              data-icon-state="enabled"
              data-lead-icon={leadIconOverride ? undefined : leadIconKey}
            >
              {leadIconContent}
            </div>
          )
        ) : null}
        <div
          className={styles.headerTopCenterSlot}
          {...(!hasTopCenter ? { 'aria-hidden': true as const } : {})}
        >
          {hasTopCenter ? headerTopCenter : null}
        </div>
        {showClose ? (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <IconX />
          </button>
        ) : null}
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

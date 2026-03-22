import React from 'react'
import clsx from 'clsx'
import { IconStar, IconDelete, IconMoreVertical } from '@shared/ui/icons'
import styles from './CardphotoListThumb.module.scss'

type Props = {
  id: string
  src: string
  cellPx: number
  favorite: boolean
  compactActions: boolean
  menuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
  onFavorite: () => void | Promise<void>
  onDelete: () => void | Promise<void>
}

function btnSize(cell: number) {
  return Math.min(22, Math.max(17, Math.round(cell * 0.32)))
}

function iconSize(cell: number) {
  return Math.min(12, Math.max(9, Math.round(cell * 0.18)))
}

export const CardphotoListThumb: React.FC<Props> = ({
  id,
  src,
  cellPx,
  favorite,
  compactActions,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onFavorite,
  onDelete,
}) => {
  const bp = btnSize(cellPx)
  const ip = iconSize(cellPx)
  const actionBtnStyle: React.CSSProperties = {
    width: bp,
    height: bp,
    minWidth: bp,
    minHeight: bp,
  }
  const iconStyle: React.CSSProperties = { width: ip, height: ip }

  const runFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    void Promise.resolve(onFavorite()).then(() => {
      if (compactActions) onCloseMenu()
    })
  }

  const runDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    void Promise.resolve(onDelete()).then(() => {
      if (compactActions) onCloseMenu()
    })
  }

  return (
    <div
      className={styles.thumbCell}
      data-cardphoto-thumb={id}
      data-menu-open={menuOpen ? 'true' : undefined}
      style={{ width: cellPx, height: cellPx }}
    >
      <img
        className={styles.thumbImg}
        src={src}
        alt=""
        width={cellPx}
        height={cellPx}
        decoding="async"
      />
      <div
        className={clsx(
          styles.thumbOverlay,
          compactActions && styles.thumbOverlayCompact,
        )}
      >
        {!compactActions && (
          <div className={styles.thumbActionsColumn}>
            <button
              type="button"
              className={clsx(styles.thumbActionBtn, styles.thumbActionFavorite)}
              data-active={favorite ? true : undefined}
              style={actionBtnStyle}
              onClick={runFavorite}
              aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
              title={favorite ? 'Убрать из избранного' : 'В избранное'}
            >
              <IconStar style={iconStyle} />
            </button>
            <button
              type="button"
              className={clsx(styles.thumbActionBtn, styles.thumbActionDelete)}
              style={actionBtnStyle}
              onClick={runDelete}
              aria-label="Удалить шаблон"
              title="Удалить"
            >
              <IconDelete style={iconStyle} />
            </button>
          </div>
        )}
        {compactActions && (
          <div className={styles.thumbMenuWrap}>
            <button
              type="button"
              className={styles.thumbActionBtn}
              style={actionBtnStyle}
              onClick={(e) => {
                e.stopPropagation()
                onToggleMenu()
              }}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="Действия с шаблоном"
              title="Действия"
            >
              <IconMoreVertical style={iconStyle} />
            </button>
            {menuOpen && (
              <div className={styles.thumbMenuPopover} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className={clsx(
                    styles.thumbMenuItem,
                    styles.thumbActionFavorite,
                  )}
                  data-active={favorite ? true : undefined}
                  style={actionBtnStyle}
                  onClick={runFavorite}
                  aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
                >
                  <IconStar style={iconStyle} />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={clsx(
                    styles.thumbMenuItem,
                    styles.thumbActionDelete,
                  )}
                  style={actionBtnStyle}
                  onClick={runDelete}
                  aria-label="Удалить шаблон"
                >
                  <IconDelete style={iconStyle} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

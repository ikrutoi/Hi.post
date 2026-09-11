import React from 'react'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './ListPanelCornerReturn.module.scss'

type ListPanelCornerReturnProps = {
  onClick: () => void
  ariaLabel?: string
}

export const ListPanelCornerReturn: React.FC<ListPanelCornerReturnProps> = ({
  onClick,
  ariaLabel = 'Close list',
}) => {
  const { isMobileLayout } = useSizeFacade()
  if (!isMobileLayout) return null

  return (
    <button
      type="button"
      className={styles.returnBtn}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={ariaLabel}
      title="Close"
    >
      {getToolbarIcon({ key: 'close' })}
    </button>
  )
}

export const listPanelCornerReturnPanelProps = (
  isMobileLayout: boolean,
): { 'data-list-panel-corner-return'?: 'true' } =>
  isMobileLayout ? { 'data-list-panel-corner-return': 'true' } : {}

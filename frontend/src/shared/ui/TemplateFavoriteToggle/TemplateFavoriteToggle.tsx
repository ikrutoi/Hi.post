import React from 'react'
import clsx from 'clsx'
import { IconStarFilled } from '@shared/ui/icons'
import styles from './TemplateFavoriteToggle.module.scss'

export type TemplateFavoriteCorner = 'top-right' | 'top-left'

type Props = {
  active: boolean
  onToggle: () => void
  corner?: TemplateFavoriteCorner
  className?: string
  'aria-label'?: string
  title?: string
}

/** Filled star: gray = not in templates, favorite yellow = in templates. */
export const TemplateFavoriteToggle: React.FC<Props> = ({
  active,
  onToggle,
  corner = 'top-right',
  className,
  'aria-label': ariaLabel,
  title,
}) => (
  <button
    type="button"
    className={clsx(
      styles.root,
      corner === 'top-left' ? styles.cornerTopLeft : styles.cornerTopRight,
      active && styles.rootActive,
      className,
    )}
    data-template-favorite
    aria-pressed={active}
    aria-label={
      ariaLabel ?? (active ? 'Remove from templates' : 'Add to templates')
    }
    title={title ?? (active ? 'In templates' : 'Add to templates')}
    onMouseDown={(e) => e.preventDefault()}
    onClick={(e) => {
      e.stopPropagation()
      onToggle()
    }}
  >
    <IconStarFilled aria-hidden />
  </button>
)

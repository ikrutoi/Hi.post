import React from 'react'
import type { TemplateStripCardProps } from './TemplateStripCard.types'
import styles from './TemplateStripCard.module.scss'

export const TemplateStripCard: React.FC<TemplateStripCardProps> = ({
  item,
  size,
  index,
  onSelect,
  onDelete,
  cardRef,
  compact = true,
}) => {
  // TODO: реализовать рендер по item.section (cardphoto | cardtext | sender | recipient)
  return (
    <div
      ref={cardRef}
      className={styles.templateStripCard}
      data-index={index}
      data-section={item.section}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(item)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(item)}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <span>{item.section}</span>
    </div>
  )
}

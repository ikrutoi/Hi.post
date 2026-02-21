import React from 'react'
import { TemplateStripCard } from '../TemplateStripCard'
import { TemplateSlider } from '../TemplateSlider'
import type { TemplateStripProps } from './TemplateStrip.types'

export const TemplateStrip: React.FC<TemplateStripProps> = ({
  section,
  items,
  scrollIndex,
  scrollValue,
  cardSize,
  maxVisibleCount,
  deltaEnd = null,
  onScrollChange,
  onLetterClick,
  onSelectTemplate,
  onDeleteTemplate,
}) => {
  const showSlider =
    scrollIndex &&
    scrollIndex.totalCount > maxVisibleCount &&
    (section === 'sender' || section === 'recipient' || section === 'cardtext')

  return (
    <div data-template-strip-section={section}>
      <div aria-label={`templates: ${section}`} role="list">
        {items.map((item, index) => (
          <TemplateStripCard
            key={`${item.section}-${item.template.id ?? index}`}
            item={item}
            size={cardSize}
            index={index}
            onSelect={onSelectTemplate}
            onDelete={onDeleteTemplate}
          />
        ))}
      </div>
      {showSlider && (
        <TemplateSlider
          value={scrollValue}
          scrollIndex={scrollIndex}
          maxVisibleCount={maxVisibleCount}
          deltaEnd={deltaEnd}
          onChange={onScrollChange}
          onLetterClick={onLetterClick}
        />
      )}
    </div>
  )
}

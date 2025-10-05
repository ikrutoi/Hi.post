import React, { useRef } from 'react'

import styles from './MiniCard.module.scss'

import { useRemSize } from '@/shared/helpers'
import { addIconToolbar } from '@data/toolbar/getIconElement'

import {
  useMiniCardRender,
  useMiniCardKebab,
  useMiniCardIconVisibility,
} from '../application/hooks'
import { MiniCardProps } from '../domain/types/miniCard.props'

export const MiniCard: React.FC<MiniCardProps> = ({
  valueSection,
  sizeMiniCard,
  infoSection,
  minimize,
  infoMinimize,
  showIconMinimize,
  onClickSection,
}) => {
  const remSize = useRemSize()
  const miniCardRef = useRef<HTMLDivElement>(null)

  const { render } = useMiniCardRender()
  const { handleClick } = useMiniCardKebab()

  const showIcon = useMiniCardIconVisibility({
    infoMinimize,
    showIconMinimize,
    infoSection,
    minimize,
  })

  const handleClickSection = () => {
    onClickSection?.(infoSection.section.section, 'single')
  }

  return (
    <div
      ref={miniCardRef}
      className={`${styles['mini-card']} ${styles[`mini-card-${infoSection.section.section}`]}`}
      style={{
        left: minimize
          ? '0'
          : `${sizeMiniCard.width + remSize + (sizeMiniCard.width * 4) / 24 + (sizeMiniCard.width + remSize) * infoSection.i}px`,
        padding: infoSection.section.section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
        boxShadow: minimize
          ? '2px 1px 5px 2px rgba(255, 255, 255, 0.2)'
          : '2px 1px 5px 2px rgba(34, 60, 80, 0.3)',
        zIndex: infoSection.section.index,
        transition: `left ${0.3 + 0.15 * infoSection.i}s ease, box-shadow 0.3s`,
      }}
      onClick={handleClickSection}
    >
      {render({
        section: infoSection.section.section,
        valueSection,
        sizeMiniCard,
        ref: miniCardRef.current,
      })}

      {!minimize && (
        <button
          className={styles['mini-card__kebab']}
          style={{
            color: showIcon ? 'rgba(71, 71, 71, 1)' : 'rgba(71, 71, 71, 0)',
            backgroundColor: showIcon
              ? 'rgba(240, 240, 240, 0.85)'
              : 'rgba(240, 240, 240, 0)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
          onClick={handleClick}
        >
          {addIconToolbar('remove')}
        </button>
      )}
    </div>
  )
}

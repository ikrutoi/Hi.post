import React, { useRef } from 'react'
import clsx from 'clsx'
import { useRemSize } from '@shared/helpers'
import { getToolbarIcon } from '@shared/utils/icons'
import { capitalize } from '@shared/utils/helpers'
import {
  useMiniCardRender,
  useMiniCardKebab,
  useMiniCardIconVisibility,
} from '../application/hooks'
import styles from './MiniCard.module.scss'
import type { CardSection } from '@entities/card/domain/types'
import type { SizeCard } from '@layout/domain/types'

interface MiniCardProps {
  section: CardSection
  sizeMiniCard: SizeCard
  zIndex: number
  position: number
  isPacked: boolean
}

export const MiniCard: React.FC<MiniCardProps> = ({
  section,
  sizeMiniCard,
  zIndex,
  position,
  isPacked,
}) => {
  const remSize = useRemSize()
  const miniCardRef = useRef<HTMLDivElement>(null)

  const { render } = useMiniCardRender()

  // const { handleClick } = useMiniCardKebab(
  //   infoSection.section.section as CardSection
  // )

  // const showIcon = useMiniCardIconVisibility({
  //   infoMinimize,
  //   showsIconMinimize,
  //   infoSection,
  //   isPacked,
  // })

  // const handleClickSection = () => {
  //   onClickSection?.(infoSection.section.section, 'single')
  // }

  return (
    <div
      ref={miniCardRef}
      className={clsx(
        styles.miniCard,
        styles[`miniCard${capitalize(section)}`]
      )}
      style={{
        left: isPacked
          ? '0'
          : `${sizeMiniCard.width + remSize + (sizeMiniCard.width * 4) / 24 + (sizeMiniCard.width + remSize) * position}px`,
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
        boxShadow: isPacked
          ? '2px 1px 5px 2px rgba(255, 255, 255, 0.2)'
          : '2px 1px 5px 2px rgba(34, 60, 80, 0.3)',
        zIndex,
        transition: `left ${0.3 + 0.15 * position}s ease, box-shadow 0.3s`,
      }}
    >
      {render({
        section,
        sizeMiniCard,
        cardMiniSectionRef: miniCardRef.current,
      })}

      <button
        className={styles.miniCardKebab}
        style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
      >
        {/* {getToolbarIcon('remove')} */}
      </button>
    </div>
  )
}

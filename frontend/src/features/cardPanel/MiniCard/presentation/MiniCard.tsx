import React, { useRef } from 'react'
import { useRemSize } from '@shared/helpers'
import { getToolbarIcon } from '@shared/utils/icons'
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
  // valueSection: unknown
  sizeMiniCard: SizeCard
  zIndex: number
  position: number
  isPacked: boolean
  // infoSection: SectionInfo
  // isPacked: boolean
  // infoMinimize: boolean
  // showsIconMinimize: boolean
  // onClickSection?: (section: string, area: string) => void
}

export const MiniCard: React.FC<MiniCardProps> = ({
  section,
  // valueSection,
  sizeMiniCard,
  zIndex,
  position,
  isPacked,
  // infoSection,
  // isPacked,
  // infoMinimize,
  // showsIconMinimize,
  // onClickSection,
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
      className={`${styles['mini-card']} ${styles[`mini-card-${section}`]}`}
      style={{
        left: isPacked
          ? '0'
          : `${sizeMiniCard.width + remSize + (sizeMiniCard.width * 4) / 24 + (sizeMiniCard.width + remSize) * position}px`,
        // padding: section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
        boxShadow: isPacked
          ? '2px 1px 5px 2px rgba(255, 255, 255, 0.2)'
          : '2px 1px 5px 2px rgba(34, 60, 80, 0.3)',
        zIndex,
        transition: `left ${0.3 + 0.15 * position}s ease, box-shadow 0.3s`,
      }}
      // onClick={handleClickSection}
    >
      {render({
        section,
        // valueSection,
        sizeMiniCard,
        ref: miniCardRef.current,
      })}

      {
        // !isPacked &&
        <button
          className={styles['mini-card__kebab']}
          style={{
            // color: showIcon ? 'rgba(71, 71, 71, 1)' : 'rgba(71, 71, 71, 0)',
            // backgroundColor: showIcon
            //   ? 'rgba(240, 240, 240, 0.85)'
            //   : 'rgba(240, 240, 240, 0)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
          // onClick={handleClick}
        >
          {/* {getToolbarIcon('remove')} */}
        </button>
      }
    </div>
  )
}

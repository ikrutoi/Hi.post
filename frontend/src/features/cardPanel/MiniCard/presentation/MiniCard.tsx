import React, { useRef } from 'react'
import clsx from 'clsx'
import { useRemSize } from '@shared/helpers'
import { capitalize } from '@shared/utils/helpers'
import { useMiniCardRender } from '../application/hooks'
import { useCardMenuFacade } from '@cardMenu/application/facades'
import styles from './MiniCard.module.scss'
import type { CardSection } from '@shared/config/constants'
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
  const { actions: actionsCardMenu } = useCardMenuFacade()
  const { setActiveSection } = actionsCardMenu

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
      onClick={() => setActiveSection(section)}
    >
      {render({
        section,
      })}

      <button
        className={styles.miniCardKebab}
        style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
      ></button>
    </div>
  )
}

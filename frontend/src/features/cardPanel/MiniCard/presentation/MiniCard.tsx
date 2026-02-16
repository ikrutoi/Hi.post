import React, { useRef } from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'
import { useRemSize } from '@shared/helpers'
import { capitalize } from '@shared/utils/helpers'
import { useMiniCardRender } from '../application/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
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

  const { changeSection } = useSectionMenuFacade()

  const { render } = useMiniCardRender()

  const handleDeleteMiniCard = () => {}

  return (
    <div
      ref={miniCardRef}
      className={clsx(
        styles.miniCard,
        styles[`miniCard${capitalize(section)}`],
      )}
      style={{
        left: isPacked
          ? '0'
          : `${sizeMiniCard.height * 1.42 + remSize + (sizeMiniCard.height * 4) / 24 + (sizeMiniCard.height + remSize) * position}px`,
        width: `${sizeMiniCard.height}px`,
        height: `${sizeMiniCard.height}px`,
        zIndex,
        transition: `left ${0.3 + 0.15 * position}s ease, box-shadow 0.3s`,
      }}
      onClick={() => changeSection(section)}
    >
      {render({
        section,
      })}

      <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        onClick={(e) => {
          e.stopPropagation()
          // removeCropId(cropId)
        }}
      >
        {getToolbarIcon({ key: 'deleteSmall' })}
      </button>
    </div>
  )
}

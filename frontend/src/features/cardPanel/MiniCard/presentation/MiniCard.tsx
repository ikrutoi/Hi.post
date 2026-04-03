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
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { useAppSelector } from '@app/hooks'
import { selectHasEnvelopeAppliedContent } from '@envelope/infrastructure/selectors'

interface MiniCardProps {
  section: CardSection
  sizeMiniCard: SizeCard
  zIndex: number
  position: number
  isPacked: boolean
  isEmpty?: boolean
}

export const MiniCard: React.FC<MiniCardProps> = ({
  section,
  sizeMiniCard,
  zIndex,
  position,
  isPacked,
  isEmpty = false,
}) => {
  const remSize = useRemSize()
  const miniCardRef = useRef<HTMLDivElement>(null)

  const { changeSection } = useSectionMenuFacade()
  const { editorState, removeSection } = useCardEditorFacade()
  const hasEnvelopeApplied = useAppSelector(selectHasEnvelopeAppliedContent)

  const { render } = useMiniCardRender()

  const showClearButton = !!editorState
    ? section === 'envelope'
      ? hasEnvelopeApplied
      : (editorState as any)?.[section]?.isComplete === true
    : false

  return (
    <div
      ref={miniCardRef}
      className={clsx(
        styles.miniCard,
        styles[`miniCard${capitalize(section)}`],
        isEmpty && styles.miniCardEmpty,
      )}
      style={{
        left: isPacked
          ? '0'
          : `${remSize + (sizeMiniCard.height + remSize) * position}px`,
        top: isPacked ? 0 : undefined,
        width: `${sizeMiniCard.height}px`,
        height: `${sizeMiniCard.height}px`,
        zIndex,
        transition: `left ${0.3 + 0.15 * position}s ease, box-shadow 0.3s`,
      }}
      onClick={() => changeSection(section)}
    >
      {isEmpty && (
        <div className={styles.miniCardIconBg}>
          {getToolbarIcon({ key: section as any })}
        </div>
      )}
      {render({
        section,
      })}

      {showClearButton && (
        <button
          type="button"
          className={styles.miniClearButton}
          aria-label={`Clear ${section}`}
          onClick={(e) => {
            e.stopPropagation()
            removeSection(section)
          }}
        >
          {getToolbarIcon({ key: 'clearInput' })}
        </button>
      )}

      {/* <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        onClick={(e) => {
          e.stopPropagation()
          // removeCropId(cropId)
        }}
      >
        {getToolbarIcon({ key: 'deleteSmall' })}
      </button> */}
    </div>
  )
}

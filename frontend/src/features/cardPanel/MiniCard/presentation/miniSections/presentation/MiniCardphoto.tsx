import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import cardStyles from '../../MiniCard.module.scss'
import { selectCardphotoMiniPreview } from '@cardphoto/infrastructure/selectors'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { getToolbarIcon } from '@/shared/utils/icons'

export const MiniCardphoto = () => {
  const photoPreview = useAppSelector(selectCardphotoMiniPreview)
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardphoto')

  if (!photoPreview?.previewUrl) {
    return (
      <div
        className={clsx(cardStyles.miniCard, cardStyles.miniCardEmpty)}
        style={{ position: 'absolute', inset: 0 }}
      >
        <div className={cardStyles.miniCardIconBg}>
          {getToolbarIcon({ key: 'cardphoto' })}
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        styles.miniCardphoto,
        styles.visible,
        isHovered && styles.hovered,
      )}
      onMouseEnter={() => setHovered('cardphoto')}
      onMouseLeave={() => setHovered(null)}
    >
      <img
        key={photoPreview.id}
        src={photoPreview.previewUrl}
        alt="MiniCard photo"
        // className={clsx(
        //   styles.miniCardphoto,
        //   styles.visible,
        //   isHovered && styles.hovered,
        // )}
        // onMouseEnter={() => setHovered('cardphoto')}
        // onMouseLeave={() => setHovered(null)}
      />
      {/* <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        aria-label="Delete section content"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {getToolbarIcon({ key: 'clearInput' })}
      </button> */}
    </div>
  )
}

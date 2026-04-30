import React from 'react'
import { useAppDispatch } from '@app/hooks'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { setCartItemCardAroma } from '@cart/infrastructure/state'
import styles from './Aroma.module.scss'
import type { AromaItem } from '@entities/aroma/domain/types'

export const Aroma: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedAroma, chooseAroma } = useAromaFacade()
  const {
    centerStripListMirrorEnabled,
    mirrorInner,
    mirrorTargetLocalId,
  } = useRightListArchiveMini()

  /** In right list mode, highlight the tile that matches the open postcard on the right CardPie. */
  const tileHighlightAroma =
    centerStripListMirrorEnabled && mirrorInner != null
      ? mirrorInner.aroma
      : selectedAroma

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault()
    /** Right pie mode: never touch editor aroma slice — left CardPie stays on draft data. */
    if (centerStripListMirrorEnabled) return
    if (!selectedAroma) return
    chooseAroma(selectedAroma)
  }

  const handleClickAroma = (aromaItem: AromaItem) => {
    if (centerStripListMirrorEnabled) {
      if (mirrorTargetLocalId != null) {
        dispatch(
          setCartItemCardAroma({
            localId: mirrorTargetLocalId,
            aroma: aromaItem,
          }),
        )
      }
      return
    }
    chooseAroma(aromaItem)
  }

  return (
    <div className={styles.aroma}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {AROMA_LIST.map((el, i) => (
          <AromaTile
            key={`aroma-${el.index}-${i}`}
            selectedAroma={tileHighlightAroma}
            aromaItem={el}
            onSelectAroma={handleClickAroma}
          />
        ))}
      </form>
    </div>
  )
}

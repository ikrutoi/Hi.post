import React from 'react'
import clsx from 'clsx'
import { useAppDispatch } from '@app/hooks'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { setCartItemCardAroma } from '@cart/infrastructure/state'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import styles from './Aroma.module.scss'
import type { AromaItem } from '@entities/aroma/domain/types'

export const Aroma: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedAroma, chooseAroma } = useAromaFacade()
  const {
    centerStripListMirrorEnabled,
    mirrorInner,
    mirrorTargetLocalId,
    rightPieAromaPeekNoToolbar,
    listRowInner,
    listRowLocalId,
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

  if (rightPieAromaPeekNoToolbar) {
    const rowAroma = listRowInner?.aroma ?? null
    const peekSrc =
      rowAroma != null ? getAromaImage(rowAroma.index) : null
    return (
      <NotebookPeekShell>
        <div
          key={
            listRowLocalId != null
              ? `peek-aroma-${listRowLocalId}`
              : 'peek-aroma'
          }
          className={styles.aroma}
        >
          <div className={clsx(styles.form, styles.formPeek)}>
            {peekSrc ? (
              <img
                className={styles.peekMask}
                src={peekSrc}
                alt={
                  rowAroma?.index === 0
                    ? ''
                    : `Aroma slot ${rowAroma?.index ?? ''}`
                }
                draggable={false}
              />
            ) : null}
          </div>
        </div>
      </NotebookPeekShell>
    )
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

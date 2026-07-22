import React from 'react'
import clsx from 'clsx'
import { useAppDispatch } from '@app/hooks'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { MobileInlineToolbarRow } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCartItemCardAroma } from '@cart/infrastructure/state'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import styles from './Aroma.module.scss'
import type { AromaItem } from '@entities/aroma/domain/types'

const AromaSectionShell: React.FC<{
  children: React.ReactNode
  peekToolbar?: boolean
}> = ({ children, peekToolbar = false }) => (
  <div className={styles.aroma}>
    <div className={styles.aromaViewWrap}>
      {peekToolbar ? (
        <MobileInlineToolbarRow
          className={styles.aromaToolbarRow}
          emptyClassName={styles.aromaToolbarRowEmpty}
          show={false}
        >
          {null}
        </MobileInlineToolbarRow>
      ) : null}
      <div className={styles.aromaViewContent}>{children}</div>
    </div>
  </div>
)

function AromaFullSectionPeek({
  aroma,
  peekKey,
}: {
  aroma: AromaItem | null
  peekKey: string
}) {
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const peekSrc = aroma != null ? getAromaImage(aroma.index) : null
  const peek = (
    <AromaSectionShell key={peekKey} peekToolbar>
      <div className={clsx(styles.form, styles.formPeek)}>
        {peekSrc ? (
          <img
            className={styles.peekMask}
            src={peekSrc}
            alt={aroma?.index === 0 ? '' : `Aroma slot ${aroma?.index ?? ''}`}
            draggable={false}
          />
        ) : null}
      </div>
    </AromaSectionShell>
  )
  return notebookTabsOuter ? peek : <NotebookPeekShell>{peek}</NotebookPeekShell>
}

export const Aroma: React.FC = () => {
  const dispatch = useAppDispatch()
  const { viewAroma, selectedAroma, previewAroma } = useAromaFacade()
  const { assemblyAromaSimplifiedPeek } = useMobileFactoryListChrome()
  const {
    centerStripListMirrorEnabled,
    mirrorInner,
    mirrorTargetLocalId,
    rightPieAromaPeekNoToolbar,
    listRowInner,
    listRowLocalId,
    cardPieEditEngaged,
  } = useRightListArchiveMini()

  /**
   * Archive edit uses the same preview→Apply loop as left assembly.
   * Mirror highlight / instant cart write only when not editing.
   */
  const useAssemblyPickFlow =
    cardPieEditEngaged || !centerStripListMirrorEnabled

  /** Подсветка ячейки — только при превью в центральном CardPie. */
  const tileHighlightAroma = useAssemblyPickFlow
    ? viewAroma
    : (mirrorInner?.aroma ?? null)

  const handleClickAroma = (aromaItem: AromaItem) => {
    if (!useAssemblyPickFlow) {
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
    previewAroma(aromaItem)
  }

  if (rightPieAromaPeekNoToolbar) {
    return (
      <AromaFullSectionPeek
        aroma={listRowInner?.aroma ?? null}
        peekKey={
          listRowLocalId != null ? `peek-aroma-${listRowLocalId}` : 'peek-aroma'
        }
      />
    )
  }

  if (assemblyAromaSimplifiedPeek) {
    return (
      <AromaFullSectionPeek
        aroma={selectedAroma}
        peekKey={
          selectedAroma != null
            ? `peek-aroma-applied-${selectedAroma.index}`
            : 'peek-aroma-applied'
        }
      />
    )
  }

  return (
    <AromaSectionShell>
      <div className={styles.form}>
        {AROMA_LIST.map((el, i) => (
          <AromaTile
            key={`aroma-${el.index}-${i}`}
            selectedAroma={tileHighlightAroma}
            aromaItem={el}
            onSelectAroma={handleClickAroma}
          />
        ))}
      </div>
    </AromaSectionShell>
  )
}

import React from 'react'
import { Slate, Editable } from 'slate-react'
import {
  buildMiniCardtextMiniSurfaceStyle,
  useMiniCardtext,
} from '../application/hooks'
import { renderLeaf } from '@cardtext/presentation/renderLeaf'
import { renderElement } from '@cardtext/presentation/renderElement'
import styles from './MiniCardtext.module.scss'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectListArchiveCardPieBundle } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'
import { useSizeFacade } from '@layout/application/facades'
import { MINI_CARD_HEIGHT_RATIO } from '@shared/utils/layout/getSizeMiniCard'
import { useMiniStripCellSidePx } from '@cardPanel/presentation/MiniSectionsSlot/MiniStripCellSideContext'
import {
  cardtextHasRenderableContent,
  cardtextValueForReadOnlyPreview,
} from '@cardtext/domain/editor/editor.types'

export const MiniCardtext: React.FC = () => {
  const stripCellSidePx = useMiniStripCellSidePx()
  const {
    centerStripListMirrorEnabled,
    mirrorInner,
    mirrorTargetLocalId,
    mirrorListArchiveSource,
  } = useRightListArchiveMini()

  const mirrorBundleRow = useAppSelector((state) =>
    centerStripListMirrorEnabled && mirrorTargetLocalId != null
      ? selectListArchiveCardPieBundle(
          state,
          String(mirrorTargetLocalId),
          mirrorListArchiveSource ?? 'cart',
        )
      : null,
  )

  const rowMirrorInner =
    mirrorInner ?? mirrorBundleRow?.currentData?.data ?? null

  const usingMirror =
    centerStripListMirrorEnabled && rowMirrorInner != null

  const mirrorEditorKey = usingMirror
    ? `mirror:${rowMirrorInner.cardtext?.id ?? 'x'}:${rowMirrorInner.cardphoto?.id ?? 'p'}`
    : 'editor'
  const mini = useMiniCardtext(mirrorEditorKey)
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardtext')

  const ct = rowMirrorInner?.cardtext

  const shouldShowMiniText = usingMirror
    ? Boolean(ct && cardtextHasRenderableContent(ct))
    : mini.shouldShowMiniText

  const mirrorLayoutHeightPx =
    stripCellSidePx != null && stripCellSidePx > 0
      ? Math.round(stripCellSidePx * MINI_CARD_HEIGHT_RATIO)
      : sizeMiniCard?.height

  const value =
    usingMirror && ct
      ? cardtextValueForReadOnlyPreview(ct)
      : mini.value
  const style =
    usingMirror && ct
      ? buildMiniCardtextMiniSurfaceStyle(
          ct.style,
          ct.cardtextLines ?? 15,
          mirrorLayoutHeightPx,
        )
      : mini.style
  const editor = mini.editor

  if (!shouldShowMiniText) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.miniCardtext,
        styles.visible,
        isHovered && styles.hovered,
      )}
    >
      <Slate key={JSON.stringify(value)} editor={editor} initialValue={value}>
        <Editable
          readOnly
          className={styles.miniCardtextEditable}
          style={style}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onMouseEnter={() => setHovered('cardtext')}
          onMouseLeave={() => setHovered(null)}
        />
      </Slate>
    </div>
  )
}

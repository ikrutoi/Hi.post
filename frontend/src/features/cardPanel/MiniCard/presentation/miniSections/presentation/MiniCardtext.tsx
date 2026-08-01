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
import { selectCardtextDisplayForMiniStrip } from '@cardtext/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { isMirrorSectionAppliedToEditor } from '@cardPanel/application/helpers/mirrorSectionEditorSync'

function cardtextMiniSlateKey(
  prefix: string,
  id: string | null | undefined,
  timestamp: number | undefined,
  plainText: string | undefined,
  valueLength: number,
): string {
  return `${prefix}:${id ?? 'x'}:${timestamp ?? 0}:${(plainText ?? '').length}:${valueLength}`
}

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
  const factoryDisplay = useAppSelector(selectCardtextDisplayForMiniStrip)
  const cartItems = useAppSelector(selectCartItems)
  const cardtextApplied = useAppSelector((s) => s.cardtext.appliedData)

  const rowMirrorInner =
    mirrorInner ?? mirrorBundleRow?.currentData?.data ?? null

  const mirrorActive =
    centerStripListMirrorEnabled && rowMirrorInner != null

  /** Include `mirrorTargetLocalId` so Slate/editor remount when the list row changes. */
  const mirrorEditorKey = mirrorActive
    ? `mirror:${mirrorTargetLocalId ?? 'na'}:${rowMirrorInner.cardtext?.id ?? 'x'}:${rowMirrorInner.cardphoto?.id ?? 'p'}`
    : 'editor'
  const mini = useMiniCardtext(mirrorEditorKey)
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardtext')

  const sourcePostcard =
    mirrorTargetLocalId != null
      ? (cartItems.find((p) => p.localId === mirrorTargetLocalId) ?? null)
      : null
  const mirrorCopyInFactory =
    mirrorActive &&
    isMirrorSectionAppliedToEditor('cardtext', rowMirrorInner, sourcePostcard, {
      cardphotoAppliedData: null,
      cardtextApplied,
      appliedRecipientAddress: null,
      appliedSenderAddress: null,
      selectedAroma: null,
      selectedDates: [],
    })

  const mirrorCt = rowMirrorInner?.cardtext
  const mirrorHasText =
    mirrorActive && cardtextHasRenderableContent(mirrorCt)
  /**
   * After cardPieCopy / section apply: show factory session immediately.
   * Otherwise mirror archive text; if mirror has nothing renderable, fall
   * through to factory (same idea as MiniAroma).
   */
  const useFactoryPreview =
    mini.shouldShowMiniText && (!mirrorHasText || mirrorCopyInFactory)
  const useMirrorPreview = !useFactoryPreview && mirrorHasText
  const shouldShowMiniText = useFactoryPreview || useMirrorPreview

  const mirrorPreviewValue =
    useMirrorPreview && mirrorCt != null
      ? cardtextValueForReadOnlyPreview(mirrorCt)
      : null

  const value = useFactoryPreview ? mini.value : (mirrorPreviewValue ?? mini.value)
  const styleSource =
    useMirrorPreview && mirrorCt != null && !useFactoryPreview ? mirrorCt : null

  const mirrorLayoutHeightPx =
    stripCellSidePx != null && stripCellSidePx > 0
      ? Math.round(stripCellSidePx * MINI_CARD_HEIGHT_RATIO)
      : sizeMiniCard?.height

  const style =
    styleSource != null
      ? buildMiniCardtextMiniSurfaceStyle(
          styleSource.style,
          styleSource.cardtextLines ?? 15,
          mirrorLayoutHeightPx,
        )
      : mini.style
  const editor = mini.editor

  const slateKey = useFactoryPreview
    ? cardtextMiniSlateKey(
        'f',
        factoryDisplay.id,
        factoryDisplay.timestamp,
        factoryDisplay.plainText,
        value?.length ?? 0,
      )
    : mirrorCt != null
      ? cardtextMiniSlateKey(
          `m-${mirrorTargetLocalId ?? 'na'}`,
          mirrorCt.id,
          mirrorCt.timestamp,
          mirrorCt.plainText,
          mirrorPreviewValue?.length ?? 0,
        )
      : 'empty'

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
      <Slate key={slateKey} editor={editor} initialValue={value}>
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

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
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useSizeFacade } from '@layout/application/facades'
import { cardtextHasRenderableContent } from '@cardtext/domain/editor/editor.types'

export const MiniCardtext: React.FC = () => {
  const { centerStripListMirrorEnabled, mirrorInner } = useRightListArchiveMini()
  const usingMirror =
    centerStripListMirrorEnabled && mirrorInner != null
  const mirrorEditorKey = usingMirror
    ? `mirror:${mirrorInner.cardtext?.id ?? 'x'}:${mirrorInner.cardphoto?.id ?? 'p'}`
    : 'editor'
  const mini = useMiniCardtext(mirrorEditorKey)
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardtext')

  const ct = mirrorInner?.cardtext

  const shouldShowMiniText = usingMirror
    ? Boolean(ct && cardtextHasRenderableContent(ct))
    : mini.shouldShowMiniText

  const value =
    usingMirror && ct ? (ct.value ?? mini.value) : mini.value
  const style =
    usingMirror && ct
      ? buildMiniCardtextMiniSurfaceStyle(
          ct.style,
          ct.cardtextLines ?? 15,
          sizeMiniCard?.height,
        )
      : mini.style
  const editor = mini.editor

  if (centerStripListMirrorEnabled && mirrorInner == null) {
    return null
  }

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

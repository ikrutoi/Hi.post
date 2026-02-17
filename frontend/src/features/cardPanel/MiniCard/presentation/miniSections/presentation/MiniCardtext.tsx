import React from 'react'
import { Slate, Editable } from 'slate-react'
import { useMiniCardtext } from '../application/hooks'
import { renderLeaf } from '@cardtext/presentation/renderLeaf'
import { renderElement } from '@cardtext/presentation/renderElement'
import styles from './MiniCardtext.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'

export const MiniCardtext: React.FC = () => {
  const { editor, value, style } = useMiniCardtext()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardtext')

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
      <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        aria-label="Delete section content"
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

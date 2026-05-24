import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { STEP_TO_PX, clampCardtextFontSizeStep } from '../../domain/types'
import type { CardtextValue, CardtextStyle } from '../../domain/types'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './CardtextView.module.scss'

const COLOR_CLASS_MAP: Record<string, keyof typeof styles> = {
  deepBlack: 'colorDeepBlack',
  blue: 'colorBlue',
  burgundy: 'colorBurgundy',
  forestGreen: 'colorForestGreen',
}

type Props = {
  value: CardtextValue
  style: CardtextStyle
  contentKey?: string
  /** Tighter top padding when the floating title strip is in edit mode */
  titleStripEditing?: boolean
  onDelete?: () => void
}

export const CardtextView: React.FC<Props> = ({
  value,
  style,
  contentKey,
  titleStripEditing,
  onDelete,
}) => {
  const slateKey =
    contentKey ??
    (value?.length
      ? String(value.length) + (value[0]?.children?.[0]?.text ?? '')
      : 'empty')
  const editor = useMemo(() => withReact(createEditor()), [slateKey])

  const fontSizeStep = clampCardtextFontSizeStep(style?.fontSizeStep ?? 3)
  const currentPxSize = STEP_TO_PX[fontSizeStep - 1] ?? STEP_TO_PX[0]
  const lineHeight = Math.round(currentPxSize * 1.5)
  const colorKey = style?.color ?? 'deepBlack'
  const colorClass = styles[COLOR_CLASS_MAP[colorKey] ?? 'colorDeepBlack']
  const initialValue = (
    value?.length
      ? value
      : [{ type: 'paragraph', align: 'left', children: [{ text: '' }] }]
  ) as Descendant[]

  return (
    <div
      className={clsx(
        styles.viewContainer,
        titleStripEditing && styles.viewContainerTitleStripEditing,
        colorClass,
      )}
      style={{
        fontSize: `${currentPxSize}px`,
        lineHeight: `${lineHeight}px`,
        textAlign: style?.align ?? 'left',
      }}
    >
      <div className={styles.viewBody}>
        {/** `initialValue` только при mount — без key Slate не подхватывает смену строки/данных при том же editor memo. */}
        <Slate key={slateKey} editor={editor} initialValue={initialValue}>
          <Editable
            readOnly
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            className={styles.viewEditable}
          />
        </Slate>
      </div>
      {onDelete ? (
        <button
          type="button"
          className={styles.viewDeleteBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Delete text template"
          title="Delete template"
        >
          {getToolbarIcon({ key: 'delete' })}
        </button>
      ) : null}
    </div>
  )
}

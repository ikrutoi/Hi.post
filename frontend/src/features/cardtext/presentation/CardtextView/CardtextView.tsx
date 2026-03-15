import React, { useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { STEP_TO_PX } from '../../domain/types'
import type { CardtextValue, CardtextStyle } from '../../domain/types'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import styles from './CardtextView.module.scss'

const TEXT_COLOR_MAP: Record<string, string> = {
  deepBlack: '#1a1a1b',
  blue: '#1e3a8a',
  burgundy: '#741b47',
  forestGreen: '#064e3b',
}

type Props = {
  value: CardtextValue
  style: CardtextStyle
  contentKey?: string
}

export const CardtextView: React.FC<Props> = ({ value, style, contentKey }) => {
  const slateKey =
    contentKey ??
    (value?.length
      ? String(value.length) + (value[0]?.children?.[0]?.text ?? '')
      : 'empty')
  const editor = useMemo(() => withReact(createEditor()), [slateKey])

  const fontSizeStep = style?.fontSizeStep ?? 3
  const currentPxSize = STEP_TO_PX[fontSizeStep - 1] ?? 16
  const lineHeight = Math.round(currentPxSize * 1.5)
  const color = TEXT_COLOR_MAP.deepBlack
  const initialValue = (
    value?.length
      ? value
      : [{ type: 'paragraph', align: 'left', children: [{ text: '' }] }]
  ) as Descendant[]

  return (
    <div
      className={styles.viewContainer}
      style={{
        fontSize: `${currentPxSize}px`,
        lineHeight: `${lineHeight}px`,
        color,
        textAlign: style?.align ?? 'left',
      }}
    >
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          readOnly
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          className={styles.viewEditable}
        />
      </Slate>
    </div>
  )
}

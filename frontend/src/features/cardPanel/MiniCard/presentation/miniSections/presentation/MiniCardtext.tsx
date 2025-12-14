import React from 'react'
import { Slate, Editable } from 'slate-react'
import { useMiniCardtext } from '../application/hooks'
import { renderLeaf } from '@cardtext/presentation/renderLeaf'
import { renderElement } from '@cardtext/presentation/renderElement'
import styles from './MiniCardtext.module.scss'

export const MiniCardtext: React.FC = () => {
  const { editor, value, style } = useMiniCardtext()

  return (
    <div className={styles.miniCardtext}>
      <Slate key={JSON.stringify(value)} editor={editor} initialValue={value}>
        <Editable
          readOnly
          className={styles.miniCardtextEditable}
          style={style}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
        />
      </Slate>
    </div>
  )
}

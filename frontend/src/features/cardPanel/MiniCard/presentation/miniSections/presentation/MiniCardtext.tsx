import React from 'react'
import { Slate, Editable } from 'slate-react'
import styles from './MiniCardtext.module.scss'
import { useMiniCardtext } from '../application/hooks'

interface MiniCardtextProps {
  cardMiniSectionRef: HTMLDivElement | null
}

export const MiniCardtext: React.FC<MiniCardtextProps> = ({
  cardMiniSectionRef,
}) => {
  const { editor, value, style } = useMiniCardtext(cardMiniSectionRef)

  return (
    <div className={styles.miniCardtext}>
      <Slate editor={editor} initialValue={value}>
        <Editable readOnly style={style} />
      </Slate>
    </div>
  )
}

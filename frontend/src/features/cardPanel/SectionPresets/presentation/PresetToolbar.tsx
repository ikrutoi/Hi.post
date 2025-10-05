import React from 'react'
import styles from './SectionPresets.module.scss'
import { addIconToolbar } from '@data/toolbar/getIconElement'

interface Props {
  cardId: number
  buttons: string[]
  remSize: number
  onClick: (btn: string, id: number) => void
  setRef?: (btn: string, el: HTMLElement | null) => void
}

export const PresetToolbar: React.FC<Props> = ({
  cardId,
  buttons,
  remSize,
  onClick,
  setRef,
}) => {
  return (
    <>
      {buttons.map((btn, i) => (
        <button
          key={`${btn}-${i}`}
          className={styles['section-presets__btn']}
          data-id={cardId}
          data-tooltip={btn}
          style={{
            top: `${0.3 * remSize + i * (1.7 * remSize + 0.3 * remSize)}px`,
          }}
          ref={setRef ? (el) => setRef(btn, el) : undefined}
          onClick={() => onClick(btn, cardId)}
        >
          {addIconToolbar(btn)}
        </button>
      ))}
    </>
  )
}

import React from 'react'
import styles from './Toolbar.module.scss'
import { addIconToolbar } from '@features/cardtext/utils/getIconElement'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '@features/cardtext/utils/handleMouse'
import { TooltipColor } from '@features/cardtext/tooltipColor/presentation/TooltipColor.view'
import { useToolbarController } from '@features/cardtext/toolbar/application/Toolbar.controller'

interface ToolbarProps {
  listBtns: string[]
  listBtnsMain: string[]
  btnColor: boolean
  remSize: number
  setBtnColor: (value: boolean) => void
  infoButtonsCardtext: Record<string, any>
  onSelectColor: (colorName: string, colorType: string) => void
  styleLeftCardPuzzle: number
  btnIconRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>
  setBtnIconRefs: (key: string) => (el: HTMLButtonElement | null) => void
  handleClickBtn: (
    evt: React.MouseEvent<HTMLButtonElement>,
    btn: string
  ) => void
  handleClickBtnMain: (evt: React.MouseEvent<HTMLButtonElement>) => void
  btnsCardtext: Record<string, any>
}

export const Toolbar: React.FC<ToolbarProps> = ({
  listBtns,
  listBtnsMain,
  btnColor,
  remSize,
  setBtnColor,
  infoButtonsCardtext,
  onSelectColor,
  styleLeftCardPuzzle,
  btnIconRefs,
  setBtnIconRefs,
  // handleClickBtn,
  // handleClickBtnMain,
  btnsCardtext,
}) => {
  const {
    handleClickBtn,
    handleClickBtnMain,
    handleMouseEnter,
    handleMouseLeave,
    setBtnIconRefs,
  } = useToolbarController({ btnsCardtext, setBtnIconRefs })
  return (
    <div className={styles.toolbar}>
      <div className={styles['toolbar__left']}>
        {listBtns.map((btn, i) => (
          <button
            key={`${i}-${btn}`}
            className={`toolbar-btn toolbar-btn-cardtext btn-cardtext-${btn}`}
            data-tooltip={btn}
            data-section="cardtext"
            ref={setBtnIconRefs(`cardtext-${btn}`)}
            onClick={(evt) => handleClickBtn(evt, btn)}
            onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardtext)}
            onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardtext)}
          >
            {addIconToolbar(btn)}
          </button>
        ))}
        {btnColor && (
          <TooltipColor
            remSize={remSize}
            setBtnColor={setBtnColor}
            infoButtonsCardtext={infoButtonsCardtext}
            onSelectColor={onSelectColor}
            styleLeft={
              (btnIconRefs.current['cardtext-color']?.getBoundingClientRect()
                .left ?? 0) - styleLeftCardPuzzle
            }
          />
        )}
      </div>
      <div className={styles['toolbar__right']}>
        {listBtnsMain.map((btn, i) => (
          <button
            key={`main-${i}-${btn}`}
            className={`toolbar-btn toolbar-btn-cardtext-main btn-cardtext-main-${btn}`}
            data-tooltip={btn}
            data-section="cardtext"
            ref={setBtnIconRefs(`cardtext-${btn}`)}
            onClick={handleClickBtnMain}
            onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardtext)}
            onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardtext)}
          >
            {addIconToolbar(btn)}
          </button>
        ))}
      </div>
    </div>
  )
}

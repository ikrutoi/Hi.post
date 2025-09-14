import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './TooltipColor.scss'

import { RootState } from '@app/state/store'
import listColors from '@shared/data/toolbar/listColors.json'
import { addCardtext } from '@features/cardedit/model/store/cardEditSlice'

import { TooltipColorProps } from '@features/cardtext/model/types'

const TooltipColor: React.FC<TooltipColorProps> = ({
  setBtnColor,
  infoButtonsCardtext,
  styleLeft,
}) => {
  const btnTooltipColorRef = useRef<HTMLDivElement | null>(null)
  const [leftBtnTooltip, setLeftBtnTooltip] = useState(0)
  const [isVisibility, setIsVisibility] = useState<'visible' | 'hidden'>(
    'hidden'
  )

  const remSize = useSelector((state: RootState) => state.layout.remSize)
  const dispatch = useDispatch()

  useEffect(() => {
    if (btnTooltipColorRef.current && remSize) {
      const widthBtn = btnTooltipColorRef.current.offsetWidth
      const calcLeft = styleLeft - widthBtn / 2 - 2 * remSize + 1
      setLeftBtnTooltip(calcLeft)
      setIsVisibility('visible')
    }
  }, [styleLeft, remSize])

  const handleClickBtnColor = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const target = evt.currentTarget
    const colorName = target.dataset.colorName
    const colorType = target.dataset.colorType

    if (colorName && colorType) {
      dispatch(
        addCardtext({
          colorName,
          colorType,
        })
      )
      setBtnColor(false)
    }
  }

  return (
    <div
      ref={btnTooltipColorRef}
      className="cardeditor-tooltip-color"
      style={{ left: `${leftBtnTooltip}px`, visibility: isVisibility }}
    >
      {listColors.map((color, i) => (
        <button
          key={`${i}-${color.name}`}
          className={`btn-color btn-color-${color.name}`}
          style={{ backgroundColor: color.code }}
          data-color-name={color.name}
          data-color-type={color.code}
          onClick={handleClickBtnColor}
        />
      ))}
    </div>
  )
}

export default TooltipColor

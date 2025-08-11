import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './TooltipColor.scss'
import listColors from '../../../../../data/toolbar/listColors.json'
import { addCardtext } from '../../../../../store/slices/cardEditSlice'

const TooltipColor = ({ setBtnColor, infoButtonsCardtext, styleLeft }) => {
  const btnTooltipColorRef = useRef(null)
  const [leftBtnTooltip, setLeftBtnTooltip] = useState(0)
  const [isVisibility, setIsVisibility] = useState('hidden')
  const remSize = useSelector((state) => state.layout.remSize)

  const dispatch = useDispatch()

  useEffect(() => {
    if (btnTooltipColorRef.current && remSize) {
      const widthBtn = btnTooltipColorRef.current.offsetWidth
      const calcLeft = styleLeft - widthBtn / 2 - 2 * remSize + 1
      setLeftBtnTooltip(calcLeft)
      setIsVisibility('visible')
    }
  }, [])

  const handleClickBtnColor = (evt) => {
    dispatch(
      addCardtext({
        colorName: evt.target.dataset.colorName,
        colorType: evt.target.dataset.colorType,
      })
    )
    setBtnColor(false)
  }

  return (
    <div
      ref={btnTooltipColorRef}
      className="cardeditor-tooltip-color"
      style={{ left: `${leftBtnTooltip}px`, visibility: isVisibility }}
    >
      {listColors &&
        listColors.map((color, i) => {
          return (
            <button
              key={`${i}-${color.name}`}
              className={`btn-color btn-color-${color.name}`}
              style={{ backgroundColor: color.code }}
              data-color-name={color.name}
              data-color-type={color.code}
              onClick={handleClickBtnColor}
            ></button>
          )
        })}
    </div>
  )
}

export default TooltipColor

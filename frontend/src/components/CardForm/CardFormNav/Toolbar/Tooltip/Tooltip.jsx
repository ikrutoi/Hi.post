import React, { useEffect, useRef, useState } from 'react'
import './Tooltip.scss'

const Tooltip = ({ tooltip }) => {
  const btnTooltipRef = useRef(null)
  const [leftBtnTooltip, setLeftBtnTooltip] = useState(0)
  const [isVisibility, setIsVisibility] = useState('hidden')

  useEffect(() => {
    if (btnTooltipRef.current) {
      const widthBtn = btnTooltipRef.current.offsetWidth
      const calcLeft = tooltip.left - widthBtn / 2 + tooltip.widthbtn / 2
      setLeftBtnTooltip(calcLeft)
      setIsVisibility('visible')
    }
  }, [tooltip.left, tooltip.widthbtn])

  return (
    <span
      className="toolbar-tooltip"
      ref={btnTooltipRef}
      style={{ left: `${leftBtnTooltip}px`, visibility: isVisibility }}
    >
      {tooltip.text}
    </span>
  )
}

export default Tooltip

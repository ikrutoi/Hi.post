// import { useRef } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'
import './CardFormNav.scss'

const CardFormNav = () => {
  const sizeCard = useSelector((state) => state.layout.sizeCard)

  return (
    <div
      // ref={cardFormNavRef}
      className="card-form-nav"
      style={{ width: `${sizeCard.width}px` }}
    >
      {/* {section(layoutChoiceSection.nameSection)} */}
    </div>
  )
}

export default CardFormNav

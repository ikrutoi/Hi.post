import React from 'react'
import './CurrentDateTime.scss'
import { colorSchemeMain } from '../../../../../data/main/colorSchemeMain'
import TitleBtn from './TitleBtn/TitleBtn'

const CurrentDateTime = ({
  selectedDateTitle,
  isActiveDateTitle,
  handleChangeTitle,
}) => {
  const titleBtns = ['year', 'month']
  return (
    <>
      {titleBtns.map((btn, i) => {
        return (
          <TitleBtn
            key={`${i}-${btn}`}
            onClick={handleChangeTitle}
            isActiveDateTitle={isActiveDateTitle}
            selectedDateTitle={selectedDateTitle}
            handleChangeTitle={handleChangeTitle}
            nameBtn={btn}
          />
        )
      })}
    </>
  )
}

export default CurrentDateTime

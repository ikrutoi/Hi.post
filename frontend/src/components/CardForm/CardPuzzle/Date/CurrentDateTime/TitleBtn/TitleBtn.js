import './TitleBtn.scss'
import nameMonths from '../../../../../../data/date/monthOfYear.json'
import { colorSchemeMain } from '../../../../../../data/main/colorSchemeMain'

const TitleBtn = ({
  handleChangeTitle,
  isActiveDateTitle,
  selectedDateTitle,
  nameBtn,
}) => {
  return (
    <span
      className={`date-title date-title-${nameBtn}`}
      onClick={handleChangeTitle}
      data-name={nameBtn}
      style={{
        backgroundColor:
          isActiveDateTitle === nameBtn
            ? colorSchemeMain.active
            : colorSchemeMain.lightGray,
        color: isActiveDateTitle === nameBtn ? colorSchemeMain.white : '',
      }}
    >
      {nameBtn === 'month'
        ? nameMonths[selectedDateTitle.month]
        : selectedDateTitle.year}
    </span>
  )
}

export default TitleBtn

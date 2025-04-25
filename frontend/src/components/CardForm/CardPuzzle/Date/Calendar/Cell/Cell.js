import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import './Cell.scss'
import ToolbarShopping from './ToolbarShopping/ToolbarShopping'
import {
  choiceClip,
  dateShoppingCards,
  lockDateShoppingCards,
} from '../../../../../../redux/layout/actionCreators'

const Cell = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  // currentDate,
  today,
  taboo,
  handleSelectedDate,
  selectedDate,
  selectedDateTitle,
  handleClickCell,
  shoppingDay,
}) => {
  const [toolbarShopping, setToolbarShopping] = useState(false)
  const dispatch = useDispatch()
  const [countShoppingCards, setCountShoppingCards] = useState(null)

  useEffect(() => {
    if (shoppingDay && shoppingDay.length > 1) {
      setCountShoppingCards(shoppingDay.length)
    }
    if (shoppingDay && shoppingDay.length === 1) {
      setCountShoppingCards(false)
    }
  }, [shoppingDay])

  const handleCellContainerShoppingClick = () => {
    setToolbarShopping((state) => !state)
  }

  useEffect(() => {
    if (
      shoppingDay?.date?.year !== selectedDateTitle?.year ||
      shoppingDay?.date?.month !== selectedDateTitle?.month
    ) {
      setToolbarShopping(false)
    }
  }, [shoppingDay, selectedDateTitle])

  const addSelectedDate = () => {
    handleSelectedDate(
      taboo,
      selectedDateTitle.year,
      selectedDateTitle.month,
      dayCurrent
    )
  }

  const handleCellShoppingClick = () => {
    addSelectedDate()
  }

  const handleImgShoppingClick = (evt, day) => {
    // evt.stopPropagation()
    dispatch(lockDateShoppingCards(true))
    dispatch(choiceClip(toolbarShopping ? 'date' : false))
    dispatch(
      dateShoppingCards({
        year: selectedDateTitle.year,
        month: selectedDateTitle.month,
        day,
      })
    )
  }

  const handleCellClick = () => {
    if (!shoppingDay) {
      addSelectedDate()
    }
  }

  return title ? (
    <div className="cell cell-title">{title}</div>
  ) : dayCurrent ? (
    <div
      className={`cell cell-day day-current ${
        today ? 'today' : ''
      } day-${dayCurrent} ${selectedDate ? 'selected' : ''} ${
        taboo ? 'taboo' : ''
      } ${shoppingDay ? 'shopping' : ''}`}
      onClick={handleCellClick}
    >
      {shoppingDay ? (
        <div
          className="cell-shopping-container"
          onClick={handleCellContainerShoppingClick}
        >
          <span
            className={`cell-shopping-filter ${selectedDate ? 'selected' : ''}`}
          >
            <span className="cell-shopping-shadow">{dayCurrent}</span>
          </span>
          <img
            className="cell-shopping-img"
            alt="shopping-day"
            src={shoppingDay?.[0]?.img}
          />
          {countShoppingCards && !toolbarShopping && (
            <span className="toolbar-shopping-count toolbar-shopping-container-count">
              {shoppingDay.length}
            </span>
          )}
          {toolbarShopping && (
            <ToolbarShopping
              day={dayCurrent}
              shoppingDay={shoppingDay}
              handleImgShoppingClick={handleImgShoppingClick}
              handleCellShoppingClick={handleCellShoppingClick}
              countShoppingCards={countShoppingCards}
            />
          )}
        </div>
      ) : (
        dayCurrent
      )}
    </div>
  ) : dayBefore ? (
    <div
      className={`cell cell-day ${
        today ? 'today' : ''
      } day-before day-${dayBefore} ${selectedDate ? 'selected' : ''}`}
      onClick={() => handleClickCell('before')}
    >
      {dayBefore}
    </div>
  ) : (
    <div
      className={`cell cell-day ${
        today ? 'today' : ''
      } day-after day-${dayAfter} ${selectedDate ? 'selected' : ''}`}
      onClick={() => handleClickCell('after')}
    >
      {dayAfter}
    </div>
  )
}

export default Cell

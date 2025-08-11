import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaAngleLeft,
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import {
  LuCalendarArrowUp,
  LuCalendarArrowDown,
  LuCalendar,
} from 'react-icons/lu'
import './Date.scss'
import { addDate } from '../../../../store/slices/cardEditSlice'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'
import { currentDate } from '../../../../utils/date/date'
import Slider from './Slider/Slider'
import nameMonths from '../../../../data/date/monthOfYear.json'
import {
  setActiveSections,
  addChoiceSection,
} from '../../../../store/slices/layoutSlice'
import ToolbarDate from './ToolbarDate/ToolbarDate'
import { colorSchemeMain } from '../../../../data/main/colorSchemeMain'
import { searchParent } from '../../../../utils/searchParent'
import { getAllShopping } from '../../../../utils/cardFormNav/indexDB/indexDb'
import type { RootState } from '../../../../store/store'

interface DateState {
  year: number
  month: number
  day: number
}

interface ShoppingCard {
  date: string
  img: string
  id: string
  personalId: string
}

const Date: React.FC = () => {
  const selectorCardEditDate = useSelector(
    (state: RootState) => state.cardEdit.date
  )
  const selectorLayoutShoppingCards = useSelector(
    (state: RootState) => state.layout.shoppingCards
  )
  const selectorLayoutActiveSections = useSelector(
    (state: RootState) => state.layout.setActiveSections
  )

  const inputValueSelectedDate: DateState = selectorCardEditDate ?? {
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
    day: currentDate.currentDay,
  }

  const dispatch = useDispatch()
  const [selectedDateTitle, setSelectedDateTitle] = useState<DateState>(
    inputValueSelectedDate
  )
  const [selectedDate, setSelectedDate] = useState<DateState | null>(null)
  const [isActiveDateTitle, setIsActiveDateTitle] = useState<string | false>(
    false
  )
  const [dataShoppingCards, setDataShoppingCards] = useState<
    ShoppingCard[] | null
  >(null)

  useEffect(() => {
    selectorCardEditDate
      ? setSelectedDate(selectorCardEditDate)
      : setSelectedDate(null)
    if (!selectorCardEditDate) {
      setIsActiveDateTitle(false)
    }
  }, [selectorCardEditDate])

  function resizeImage(blob: Blob): Promise<string> {
    const width = 128
    const height = 90
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(blob)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((resizedBlob) => {
            if (resizedBlob) {
              resolve(URL.createObjectURL(resizedBlob))
            } else {
              reject(new Error('Failed to resize image'))
            }
          }, blob.type)
        } else {
          reject(new Error('Canvas context is null'))
        }
      }

      img.onerror = (e) => reject(e)
    })
  }

  const getShoppingCards = async () => {
    const shoppings = await getAllShopping()
    const dataShoppingCardsPromises = shoppings.map(async (card) => {
      return {
        date: card.shopping.date,
        img: await resizeImage(card.shopping.cardphoto),
        id: card.id,
        personalId: card.personalId,
      }
    })

    const dataShoppingCards = await Promise.all(dataShoppingCardsPromises)
    setDataShoppingCards(dataShoppingCards)
  }

  useEffect(() => {
    if (selectorLayoutShoppingCards) {
      getShoppingCards()
    }
  }, [selectorLayoutShoppingCards])

  const handleSelectedDate = (
    taboo: boolean,
    selectedYear: number,
    selectedMonth: number,
    selectedDay: number
  ) => {
    if (!taboo) {
      const newDate: DateState = {
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
      }
      setSelectedDate(newDate)
      setSelectedDateTitle((state) => ({ ...state, day: selectedDay }))
      dispatch(addDate(newDate))
    }
  }

  useEffect(() => {
    if (selectedDate) {
      dispatch(
        setActiveSections({
          ...selectorLayoutActiveSections,
          date: Boolean(selectedDate),
        })
      )
    }
  }, [selectedDate, dispatch])

  const handleChangeTitle = (evt: React.MouseEvent<HTMLElement>) => {
    const parentElement = searchParent(evt.target as HTMLElement, 'date-title')
    if (parentElement?.dataset.name) {
      setIsActiveDateTitle((prev) =>
        prev === parentElement.dataset.name ? false : parentElement.dataset.name
      )
    }
  }

  const changeMonthTitleMinus = () => {
    setSelectedDateTitle((state) => {
      if (state.month > 0) {
        return { ...state, month: state.month - 1 }
      }
      return { ...state, month: 11, year: state.year - 1 }
    })
  }

  const handleChangeDateFromSlider = (
    sectionDate: 'year' | 'month',
    value: number
  ) => {
    setSelectedDateTitle((state) => ({ ...state, [sectionDate]: value }))
  }

  const handleArrowMinus = () => {
    if (!isActiveDateTitle) {
      setIsActiveDateTitle('month')
    }
    if (isActiveDateTitle === 'year') {
      setSelectedDateTitle((state) => ({ ...state, year: state.year - 1 }))
    }
    if (isActiveDateTitle === 'month') {
      changeMonthTitleMinus()
    }
  }

  const changeMonthTitlePlus = () => {
    setSelectedDateTitle((state) => {
      if (state.month < 11) {
        return { ...state, month: state.month + 1 }
      }
      return { ...state, month: 0, year: state.year + 1 }
    })
  }

  const handleClickCell = (month: 'before' | 'after') => {
    if (month === 'before') changeMonthTitleMinus()
    if (month === 'after') changeMonthTitlePlus()
  }

  const handleArrowPlus = () => {
    if (!isActiveDateTitle) {
      setIsActiveDateTitle('month')
    }
    if (isActiveDateTitle === 'year') {
      setSelectedDateTitle((state) => ({ ...state, year: state.year + 1 }))
    }
    if (isActiveDateTitle === 'month') {
      changeMonthTitlePlus()
    }
  }

  const handleTransitionTodayDate = () => {
    setSelectedDateTitle((state) => ({
      ...state,
      year: currentDate.currentYear,
      month: currentDate.currentMonth,
    }))
  }

  const handleTransitionSelectedDate = () => {
    if (selectedDate) {
      setSelectedDateTitle((state) => ({
        ...state,
        year: selectedDate.year,
        month: selectedDate.month,
      }))
    }
  }

  const checkingCurrentMonth = (): boolean => {
    return (
      selectedDateTitle.year === currentDate.currentYear &&
      selectedDateTitle.month === currentDate.currentMonth
    )
  }

  return <div className="date-wrapper">{/* Здесь будет твой JSX */}</div>
}

export default Date

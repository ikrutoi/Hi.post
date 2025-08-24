import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './Date.scss'
import { Toolbar } from './Toolbar/Toolbar'
import { DateTitleSwitcher } from './DateTitleSwitcher/DateTitleSwitcher'
import { PostcardPreview } from './PostcardPreview/PostcardPreview'
import { Calendar } from './Calendar/Calendar'

import type { RootState } from '@app/store/store'
import { Cart } from '@features/cart/publicApi'
import {
  FaAngleLeft,
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import type {
  DateState,
  PostcardBase,
  DateField,
  DateTextTitle,
} from '@features/date/publicApi.ts'
import {
  LuCalendarArrowUp,
  LuCalendarArrowDown,
  LuCalendar,
} from 'react-icons/lu'
import { addDate } from '@store/slices/cardEditSlice'
import { currentDate } from '@features/date/publicApi.ts'
import { Slider } from './Slider/Slider'
import { MONTH_NAMES } from '../constants/months'
import { setActiveSections } from '@features/layout'
import { themeColors } from '@shared/theme/themeColors'
import { findParentByClass } from '@shared/lib/date/findParentByClass'
import { cartAdapter } from '@features/cart/publicApi'
// import { getAllShopping } from '@db/index'
// import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
// import { getAllShopping } from '../../../../utils/cardFormNav/indexDB/indexDb'

// interface DateState {
//   year: number
//   month: number
//   day: number
// }

// interface PostcardBase {
//   date: string
//   img: string
//   id: string
//   personalId: string
// }

const Date: React.FC = () => {
  const selectorCardEditDate = useSelector(
    (state: RootState) => state.cardEdit.date
  )
  const selectorLayoutPostcardBases = useSelector(
    (state: RootState) => state.layout.cart.cartCards
  )
  const selectorLayoutActiveSections = useSelector(
    (state: RootState) => state.layout.activeSections
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
  const [isActiveDateTitle, setIsActiveDateTitle] = useState<
    DateField | undefined
  >(undefined)

  const [cart, setCart] = useState<Cart | null>(null)

  useEffect(() => {
    selectorCardEditDate
      ? setSelectedDate(selectorCardEditDate)
      : setSelectedDate(null)
    if (!selectorCardEditDate) {
      setIsActiveDateTitle(undefined)
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

  const getCart = async () => {
    const cartItems = await cartAdapter.getAll()

    const preparedCart: Cart = await Promise.all(
      cartItems.map(async (item) => {
        const response = await fetch(item.preview)
        const blob = await response.blob()
        const resizedPreview = await resizeImage(blob)

        return {
          id: item.id.toString(),
          preview: resizedPreview,
          recipientName: item.recipientName,
          date: item.date,
          price: item.price,
        }
      })
    )

    setCart(preparedCart)
  }

  useEffect(() => {
    if (selectorLayoutPostcardBases) {
      getCart()
    }
  }, [selectorLayoutPostcardBases])

  const handleSelectedDate = (
    isTaboo: boolean,
    selectedYear: number,
    selectedMonth: number,
    selectedDay: number
  ) => {
    if (!isTaboo) {
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

  const handleChangeTitle = (field: DateField) => {
    setIsActiveDateTitle((prev) => (prev === field ? undefined : field))
  }

  // const handleChangeTitle = (evt: React.MouseEvent<HTMLElement>) => {
  //   const parentElement = findParentByClass(
  //     evt.target as HTMLElement,
  //     'date-title'
  //   )
  //   if (
  //     parentElement?.dataset.name &&
  //     ['year', 'month'].includes(parentElement.dataset.name)
  //   ) {
  //     const name = parentElement.dataset.name as keyof DateTextTitle
  //     setIsActiveDateTitle((prev) => (prev === name ? undefined : name))
  //   }
  // }

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

  return (
    <div className="date">
      <div className="nav-container nav-container-date">
        <Toolbar />
      </div>
      <form className="date-form">
        <div className="date-header">
          <div className="header-left-right">
            <div
              className="header-today-selected header-today"
              onClick={handleTransitionTodayDate}
              style={{
                color: checkingCurrentMonth()
                  ? themeColors.text.secondary
                  : themeColors.text.primary,
                cursor: checkingCurrentMonth() ? 'default' : 'pointer',
              }}
            >
              <LuCalendar className="icon-title-date" />
              {`${currentDate.currentYear} ${
                MONTH_NAMES[currentDate.currentMonth]
              } ${currentDate.currentDay}`}
            </div>
          </div>
          <div className="header-center">
            <div
              className="header-sign"
              style={{
                color: isActiveDateTitle
                  ? themeColors.text.primary
                  : themeColors.text.secondary,
                backgroundColor: themeColors.background.default,
                cursor: 'pointer',
              }}
              onClick={handleArrowMinus}
            >
              <FaChevronLeft className="icon-date" />
            </div>
            <div className="header-date">
              <DateTitleSwitcher
                selectedDateTitle={selectedDateTitle}
                isActiveDateTitle={isActiveDateTitle}
                handleChangeTitle={handleChangeTitle}
              />
            </div>
            <div
              className="header-sign"
              style={{
                color: isActiveDateTitle
                  ? themeColors.text.primary
                  : themeColors.text.secondary,
                backgroundColor: themeColors.background.default,
                cursor: 'pointer',
              }}
              onClick={handleArrowPlus}
            >
              <FaChevronRight className="icon-date" />
            </div>
          </div>
          <div className="header-left-right">
            <div
              className="header-today-selected header-selected"
              onClick={handleTransitionSelectedDate}
            >
              {selectedDate ? (
                <LuCalendarArrowUp className="icon-title-date" />
              ) : (
                ''
              )}
              {selectedDate
                ? `${selectedDate.year} ${MONTH_NAMES[selectedDate.month]} ${
                    selectedDate.day
                  }`
                : ''}
            </div>
          </div>
        </div>
        <div className="date-slider">
          <Slider
            selectedDateTitle={selectedDateTitle}
            isActiveDateTitle={isActiveDateTitle}
            handleChangeDateFromSlider={handleChangeDateFromSlider}
          />
        </div>
        <div className="date-calendar">
          <Calendar
            selectedDate={selectedDate}
            selectedDateTitle={selectedDateTitle}
            handleSelectedDate={handleSelectedDate}
            handleClickCell={handleClickCell}
            cart={cart}
          />
        </div>
      </form>
    </div>
  )
}

export default Date

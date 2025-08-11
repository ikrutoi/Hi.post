import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './MemoryList.scss'
import { updateButtonsState } from '../../../store/slices/infoButtonsSlice'
import {
  getAllShopping,
  deleteShopping,
  getAllBlanks,
  deleteBlank,
  getAllRecordsAddresses,
  deleteToAddress,
  deleteMyAddress,
  addUniqueBlank,
} from '../../../utils/cardFormNav/indexDB/indexDb'
import { addIconToolbar } from '../../../data/toolbar/getIconElement'
import {
  setFullCard,
  setChoiceClip,
  setExpendMemoryCard,
  setDeltaEnd,
  setFullCardPersonalId,
  setLockExpendMemoryCard,
  setLockDateShoppingCards,
} from '../../../store/slices/layoutSlice'
import { current } from '@reduxjs/toolkit'
import shotMonths from '../../../data/date/monthsShotOfYear.json'

const MemoryList = ({
  sizeMiniCard,
  widthCardsList,
  setInfoCardsList,
  valueScroll,
  setValueScroll,
}) => {
  const selectorLayoutChoiceClip = useSelector(
    (state) => state.layout.setChoiceClip
  )
  const selectorIBEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const selectorLayoutPersonalId = useSelector(
    (state) => state.layout.personalId
  )
  // const selectorCardEditDate = useSelector((state) => state.cardEdit.date)
  const selectorLayoutDateShoppingCards = useSelector(
    (state) => state.layout.dateShoppingCards
  )
  const selectorLayoutLockDateShoppingCards = useSelector(
    (state) => state.layout.setLockDateShoppingCards
  )
  const [memoryList, setMemoryList] = useState(null)
  // const [selectedSource, setSelectedSource] = useState(null)
  const [listIconsSource, setListIconsSource] = useState(null)
  const btnIconRefs = useRef({})
  const cardRefs = useRef({})
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const filterRefs = useRef({})
  const setFilterRef = (id) => (element) => {
    filterRefs.current[id] = element
  }
  const remSize = useSelector((state) => state.layout.remSize)
  const selectorLayoutMaxCardsList = useSelector(
    (state) => state.layout.maxCardsList
  )
  const selectorLayoutSliderLetter = useSelector(
    (state) => state.layout.sliderLetter
  )
  const selectorLayoutSliderLine = useSelector(
    (state) => state.layout.sliderLine
  )
  const [sectionClip, setSectionClip] = useState(null)
  const [elementSave, setElementSave] = useState(null)
  const [infoElementSave, setInfoElementSave] = useState(null)
  const [firstLetterElementSave, setFirstLetterElementSave] = useState(null)
  const myaddressNameRef = useRef(null)
  const toaddressNameRef = useRef(null)
  const spanNameRefs = useRef({})
  const [trimmedText, setTrimmedText] = useState()
  const [infoFirstLetterCardsList, setFirstLetterCardsList] = useState(null)
  const [isDeleteCard, setIsDeleteCard] = useState(null)
  const dispatch = useDispatch()

  const margin = parseFloat(
    (
      (widthCardsList - sizeMiniCard.width * selectorLayoutMaxCardsList) /
      (selectorLayoutMaxCardsList - 1)
    ).toFixed(1)
  )

  const setCardRef = (id) => (element) => {
    cardRefs.current[id] = element
  }

  const processMemoryCards = (records, getName) => {
    const sortedRecords = records.sort((a, b) =>
      getName(a).localeCompare(getName(b))
    )
    const firstLetterList = sortedRecords.map((card, i) => {
      return {
        letter: getName(card)[0],
        id: card.id,
        index: i,
      }
    })
    firstLetterList.push(firstLetterList[firstLetterList.length - 1])
    return { sortedRecords, firstLetterList }
  }

  const getMemoryCards = async (source) => {
    let memoryCards = []
    let firstLetterList = []
    const iconConfig = {
      toaddress: ['remove'],
      myaddress: ['remove'],
      shopping: ['save', 'remove'],
      blanks: ['addShopping', 'remove'],
    }

    setListIconsSource(
      iconConfig[source === 'date' ? 'shopping' : source] || []
    )

    switch (source) {
      case 'toaddress': {
        const records = await getAllRecordsAddresses('toaddress')
        const { sortedRecords, firstLetterList: letters } = processMemoryCards(
          records,
          (card) => card.address.name
        )
        memoryCards = sortedRecords
        firstLetterList = letters
        break
      }
      case 'myaddress': {
        const records = await getAllRecordsAddresses('myaddress')
        const { sortedRecords, firstLetterList: letters } = processMemoryCards(
          records,
          (card) => card.address.name
        )
        memoryCards = sortedRecords
        firstLetterList = letters
        break
      }
      case 'shopping': {
        const records = await getAllShopping()
        const { sortedRecords, firstLetterList: letters } = processMemoryCards(
          records,
          (card) => card.shopping.envelope.toaddress.name
        )
        memoryCards = sortedRecords
        firstLetterList = letters
        break
      }
      case 'blanks': {
        const records = await getAllBlanks()
        const { sortedRecords, firstLetterList: letters } = processMemoryCards(
          records,
          (card) => card.blanks.envelope.toaddress.name
        )
        memoryCards = sortedRecords
        firstLetterList = letters
        break
        // }
      }
      case 'date': {
        const records = await getAllShopping()
        const dateRecords = records.filter(
          (card) =>
            card.shopping.date.year === selectorLayoutDateShoppingCards.year &&
            card.shopping.date.month ===
              selectorLayoutDateShoppingCards.month &&
            card.shopping.date.day === selectorLayoutDateShoppingCards.day
        )
        const { sortedRecords, firstLetterList: letters } = processMemoryCards(
          dateRecords,
          (card) => card.shopping.envelope.toaddress.name
        )
        memoryCards = sortedRecords
        firstLetterList = letters
        // dispatch(setChoiceClip('shopping'))
        break
      }
      default:
        console.error('Unknown source:', source)
        break
    }

    setMemoryList(memoryCards)
    // setSelectedSource(source)
    if (memoryCards.length) {
      setInfoCardsList({
        length: memoryCards.length,
        firstLetters: firstLetterList,
      })
      setFirstLetterCardsList(firstLetterList)
    }
    if (selectorLayoutChoiceClip === 'date') {
      setSectionClip('shopping')
    } else {
      setSectionClip(selectorLayoutChoiceClip)
    }
    // changeStyleFirstAndLastCards()
  }

  const findElementByPersonalId = (id, source) => {
    if (cardRefs.current) {
      for (const key in cardRefs.current) {
        const element = cardRefs.current[key]
        if (element && element.dataset.personalId === id) {
          setElementSave(element)
          const firstLetter = element.querySelector(
            `.memory-list-${source}-name`
          ).textContent[0]
          setInfoElementSave({
            index: Number(element.dataset.index),
            firstLetter,
          })
        }
      }
    }
    return null
  }

  const getPositionCard = (index, firstLetter) => {
    if (infoFirstLetterCardsList) {
      const listElements = []
      memoryList.forEach((elem, i) => {
        if (elem.address.name[0] === firstLetter) {
          listElements.push({ name: elem.address.name, index: i })
        }
      })

      if (
        listElements.length === 1 ||
        (listElements.length !== 1 &&
          listElements.length >= selectorLayoutMaxCardsList)
      ) {
        return index
      }
      if (
        listElements.length !== 1 &&
        listElements.length < selectorLayoutMaxCardsList
      ) {
        return listElements[0].index
      }
    }
  }

  useEffect(() => {
    if (elementSave instanceof HTMLElement) {
      elementSave.classList.add('save')
      const fadeOutTimer = setTimeout(() => {
        elementSave.classList.add('save-fade-out')
        elementSave.classList.remove('save')
        setTimeout(() => {
          elementSave.classList.remove('save-fade-out')
          dispatch(setFullCardPersonalId(false))
        }, 500)
      }, 1000)

      return () => clearTimeout(fadeOutTimer)
    }
  }, [elementSave, dispatch])

  useEffect(() => {
    if (selectorLayoutSliderLine) {
      // console.log('0')
      movingCards(Number(selectorLayoutSliderLine))
    }
  }, [selectorLayoutSliderLine])

  useEffect(() => {
    if (selectorLayoutSliderLetter && selectorLayoutSliderLetter.index) {
      // console.log('1')
      movingCards(Number(selectorLayoutSliderLetter.index))
    }
  }, [selectorLayoutSliderLetter])

  useEffect(() => {
    if (selectorLayoutMaxCardsList && selectorLayoutChoiceClip) {
      getMemoryCards(selectorLayoutChoiceClip)
    }
  }, [selectorLayoutChoiceClip, selectorLayoutMaxCardsList])

  useEffect(() => {
    if (
      selectorLayoutChoiceClip === 'date' &&
      selectorLayoutLockDateShoppingCards
    ) {
      getMemoryCards(selectorLayoutChoiceClip)
      dispatch(setLockDateShoppingCards(false))
    }
  }, [selectorLayoutChoiceClip, selectorLayoutLockDateShoppingCards])

  useEffect(() => {
    if (selectorIBEnvelopeSave && selectorLayoutPersonalId) {
      getMemoryCards(selectorIBEnvelopeSave)
      dispatch(
        updateButtonsState({ envelopeSaveSecond: selectorIBEnvelopeSave })
      )
    }
  }, [selectorIBEnvelopeSave, selectorLayoutPersonalId, dispatch])

  useEffect(() => {
    if (selectorLayoutPersonalId && selectorIBEnvelopeSave) {
      findElementByPersonalId(selectorLayoutPersonalId, selectorIBEnvelopeSave)
    }
  }, [memoryList, selectorLayoutPersonalId, selectorIBEnvelopeSave])

  useEffect(() => {
    if (memoryList) {
      if (infoElementSave) {
        // console.log('2')
        movingCards(
          getPositionCard(infoElementSave.index, infoElementSave.firstLetter)
        )
      } else {
        if (!isDeleteCard && !selectorLayoutSliderLine) {
          // console.log('3')
          movingCards(0)
        } else {
          // console.log('4')
          movingCards(Number(selectorLayoutSliderLine))
        }
      }
    }
  }, [memoryList, infoElementSave, isDeleteCard])

  // const getIndexFirstLetter = async (source) => {
  //   const records = await getAllRecordsAddresses(source)
  //   const { sortedRecords, firstLetterList: letters } = processMemoryCards(
  //     records,
  //     (card) => card.shopping.envelope.toaddress.name
  //   )
  // }

  const getFirstIndex = () => {
    const cards = Object.values(cardRefs.current)
    const sizes = [remSize, 0.5 * remSize, 0]

    for (const size of sizes) {
      for (const card of cards) {
        if (card) {
          const computedStyle = window.getComputedStyle(card)
          if (parseInt(computedStyle.left, 10) === size) {
            return Number(card.dataset.index)
          }
        }
      }
    }
  }

  // const changeStyleFirstAndLastCards = () => {
  //   const cards = Object.values(cardRefs.current)
  //   const sizes = [
  //     0,
  //     parseInt((maxCardsList - 1) * (margin + sizeMiniCard.width)),
  //   ]
  //   let firstCards = []
  //   let lastCards = []

  //   for (const card of cards) {
  //     if (card && card.dataset.index) {
  //       const computedStyle = window.getComputedStyle(card)
  //       if (parseInt(computedStyle.left, 10) === sizes[0]) {
  //         firstCards.push(Number(card.dataset.index))
  //       }
  //       if (parseInt(computedStyle.left, 10) === sizes[1]) {
  //         lastCards.push(Number(card.dataset.index))
  //       }
  //       const handleTransitionEnd = (event) => {
  //         if (event.propertyName === 'left') {
  //           card.classList.add('transition-completed')
  //         }
  //       }
  //       card.addEventListener('transitionend', handleTransitionEnd)
  //     }
  //   }

  //   cards.forEach((card) => {
  //     if (card?.classList?.contains('cancel-shadow')) {
  //       card.classList.remove('cancel-shadow')
  //     }
  //   })

  //   if (firstCards.length > 1) {
  //     firstCards.pop()
  //     firstCards.forEach((index) => {
  //       const targetCard = cardRefs.current[`card-${index}`]
  //       if (targetCard) {
  //         console.log('remove')
  //         targetCard.classList.add('cancel-shadow')
  //       }
  //     })
  //   }
  //   if (lastCards.length > 1) {
  //     lastCards.pop()
  //     lastCards.forEach((index) => {
  //       const targetCard = cardRefs.current[`card-${index}`]
  //       if (targetCard) {
  //         targetCard.classList.add('cancel-shadow')
  //       }
  //     })
  //   }
  // }

  // // useEffect(() => {
  // //   if (cardRefs.current) {
  // //     changeStyleFirstAndLastCards()
  // //   }
  // // }, [cardRefs])

  const movingCards = (index) => {
    // console.log('index: ', index)
    if (cardRefs.current && memoryList) {
      const restEnd = memoryList.length - index - selectorLayoutMaxCardsList
      const baseLeft = margin + sizeMiniCard.width

      const updatePosition = (index, leftValue) => {
        if (cardRefs.current[`card-${index}`]) {
          cardRefs.current[`card-${index}`].style.left = `${leftValue}px`
        }
      }

      if (index === 0) {
        // console.log('index0')
        for (let i = 1; i < selectorLayoutMaxCardsList; i++) {
          updatePosition(i, baseLeft * i)
        }
        for (
          let i = selectorLayoutMaxCardsList;
          i < memoryList.length - 3;
          i++
        ) {
          updatePosition(i, baseLeft * (selectorLayoutMaxCardsList - 1))
        }
      }

      if (index === 1) {
        // console.log('index1')
        updatePosition(0, 0)
        updatePosition(1, 0.5 * remSize)
        for (let i = 2; i < selectorLayoutMaxCardsList + index; i++) {
          updatePosition(i, baseLeft * (i - 1))
        }
      }

      if (index === 2) {
        // console.log('index2')
        updatePosition(1, 0.5 * remSize)
        updatePosition(index, remSize)
        let newIndex = 1
        for (let i = index + 1; i < selectorLayoutMaxCardsList + index; i++) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      if (
        index > 2 &&
        memoryList.length - index >= selectorLayoutMaxCardsList
      ) {
        // console.log('index>2')
        for (let i = 0; i < index - 2; i++) {
          updatePosition(i, 0)
        }
        updatePosition(index - 2, 0)
        updatePosition(index - 1, 0.5 * remSize)
        updatePosition(index, remSize)
        let newIndex = 1
        for (let i = index + 1; i < selectorLayoutMaxCardsList + index; i++) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      if (restEnd >= 2) {
        // console.log('restEnd>=2')
        updatePosition(
          index + (selectorLayoutMaxCardsList - 1),
          baseLeft * (selectorLayoutMaxCardsList - 1) - remSize
        )
        updatePosition(
          index + selectorLayoutMaxCardsList,
          baseLeft * (selectorLayoutMaxCardsList - 1) - 0.5 * remSize
        )
        for (
          let i = index + selectorLayoutMaxCardsList + 1;
          i < memoryList.length;
          i++
        ) {
          updatePosition(i, baseLeft * (selectorLayoutMaxCardsList - 1))
        }
      }

      if (restEnd === 1) {
        // console.log('restEnd1')
        updatePosition(
          index + selectorLayoutMaxCardsList - 1,
          baseLeft * (selectorLayoutMaxCardsList - 1) - 0.5 * remSize
        )
        updatePosition(
          index + selectorLayoutMaxCardsList,
          baseLeft * (selectorLayoutMaxCardsList - 1)
        )
      }

      if (restEnd < 0 && memoryList.length >= selectorLayoutMaxCardsList) {
        // console.log('restEnd<0')
        if (memoryList.length - selectorLayoutMaxCardsList >= 2) {
          updatePosition(memoryList.length - selectorLayoutMaxCardsList - 2, 0)
          updatePosition(
            memoryList.length - selectorLayoutMaxCardsList - 1,
            0.5 * remSize
          )
          updatePosition(
            memoryList.length - selectorLayoutMaxCardsList,
            remSize
          )
          for (
            let i = 0;
            i < memoryList.length - selectorLayoutMaxCardsList - 2;
            i++
          ) {
            updatePosition(i, 0)
          }
        }
        if (memoryList.length - selectorLayoutMaxCardsList === 1) {
          updatePosition(memoryList.length - selectorLayoutMaxCardsList - 1, 0)
          updatePosition(
            memoryList.length - selectorLayoutMaxCardsList,
            0.5 * remSize
          )
          for (
            let i = 0;
            i < memoryList.length - selectorLayoutMaxCardsList - 2;
            i++
          ) {
            updatePosition(i, 0)
          }
        }
        let newIndex = 1
        for (
          let i = memoryList.length - selectorLayoutMaxCardsList + 1;
          i < memoryList.length;
          i++
        ) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      // changeStyleFirstAndLastCards()
      dispatch(setDeltaEnd(restEnd === 0))
    }

    const handleBtnCardClick = async (evt) => {
      evt.stopPropagation()
      try {
        const parentBtn = evt.target.closest('.memory-list-btn')
        const nameParentBtn = parentBtn.dataset.tooltip
        console.log('nameParent', nameParentBtn)
        if (!parentBtn && !parentBtn.dataset.id) {
          return
        }
        if (nameParentBtn === 'save') {
          const idSaveElement = parentBtn.dataset.id
          const saveElement = memoryList.filter(
            (card) => card.id === Number(idSaveElement)
          )
          console.log('personalId', saveElement[0].personalId)
          await addUniqueBlank(saveElement, saveElement[0].personalId)
        }
        if (nameParentBtn === 'remove') {
          switch (sectionClip) {
            case 'shopping':
              await deleteShopping(Number(parentBtn.dataset.id))
              break
            case 'blanks':
              await deleteBlank(Number(parentBtn.dataset.id))
              break
            case 'myaddress':
              await deleteMyAddress(Number(parentBtn.dataset.id))
              dispatch(
                updateButtonsState({ envelopeRemoveAddress: sectionClip })
              )
              break
            case 'toaddress':
              await deleteToAddress(Number(parentBtn.dataset.id))
              dispatch(
                updateButtonsState({ envelopeRemoveAddress: sectionClip })
              )
              break

            default:
              break
          }
        }
        await getMemoryCards(sectionClip)
        dispatch(setFullCard(true))
        setIsDeleteCard(true)
      } catch (error) {
        console.log('Error deleting card:', error)
      }
    }

    const handleFilterMouseEnter = (evt) => {
      if (evt.target.dataset.id) {
        filterRefs.current[
          `filter-${evt.target.dataset.id}`
        ].style.backgroundColor = 'rgba(163, 163, 163, 0)'
      }
    }

    const handleFilterMouseLeave = (evt) => {
      if (evt.target.dataset.id) {
        filterRefs.current[
          `filter-${evt.target.dataset.id}`
        ].style.backgroundColor = 'rgba(163, 163, 163, 0.3)'
      }
    }

    const handleClickCard = (evt) => {
      dispatch(setLockExpendMemoryCard(false))
      dispatch(
        setExpendMemoryCard({
          source: sectionClip,
          id: evt.target.dataset.id,
        })
      )
      if (sectionClip === 'shopping' || sectionClip === 'blanks') {
        dispatch(setChoiceClip(false))
      }
    }

    const trimLines = (source, text) => {
      const arrText = text.trim().split(' ')
      const arrTextNoEmpty = arrText.filter((word) => word !== '')
      let limitLettersSingle
      let limitLettersAll
      switch (source) {
        case 'shopping':
          limitLettersSingle = 13
          limitLettersAll = 15
          break
        case 'blanks':
          limitLettersSingle = 13
          limitLettersAll = 15
          break
        case 'myaddress':
          limitLettersSingle = 11
          limitLettersAll = 22
          break
        case 'toaddress':
          limitLettersSingle = 15
          limitLettersAll = 30
          break

        default:
          break
      }

      for (let i = 0; i < arrTextNoEmpty.length; i++) {
        if (i === 0 && arrTextNoEmpty[i].length > limitLettersSingle) {
          return arrTextNoEmpty[i].slice(0, limitLettersSingle) + '...'
        } else {
          if (arrTextNoEmpty.length === 1) {
            return arrTextNoEmpty[i]
          }
        }
        if (i === 1) {
          if (
            arrTextNoEmpty[0].length + arrTextNoEmpty[i].length >
              limitLettersAll ||
            arrTextNoEmpty[i].length > limitLettersSingle
          ) {
            if (source === 'myaddress' || source === 'toaddress') {
              return `${arrTextNoEmpty[0]} ${arrTextNoEmpty[i].slice(
                0,
                limitLettersSingle
              )}...`
            } else {
              if (
                limitLettersAll - arrTextNoEmpty[0].length + 1 ===
                arrTextNoEmpty[i].length
              ) {
                return `${arrTextNoEmpty[0]} ${arrTextNoEmpty[i]}`
              } else {
                return `${arrTextNoEmpty[0]} ${arrTextNoEmpty[i].slice(
                  0,
                  limitLettersAll - arrTextNoEmpty[0].length
                )}...`
              }
            }
          } else {
            if (arrTextNoEmpty.length === 2) {
              return `${arrTextNoEmpty[0]} ${arrTextNoEmpty[1]}`
            }
          }
        }
        if (i === 2) {
          if (
            arrTextNoEmpty[0].length + arrTextNoEmpty[1].length + 1 >
            limitLettersSingle
          ) {
            return (
              `${arrTextNoEmpty[0]} ${arrTextNoEmpty[1]}` +
              arrTextNoEmpty[i].slice(
                0,
                limitLettersSingle - arrTextNoEmpty[1].length
              ) +
              '...'
            )
          } else {
            if (
              arrTextNoEmpty[i].length > limitLettersSingle ||
              (arrTextNoEmpty[i].length < limitLettersSingle &&
                arrTextNoEmpty.length > 3)
            ) {
              return (
                `${arrTextNoEmpty[0]} ${arrTextNoEmpty[1]} ` +
                arrTextNoEmpty[i].slice(0, limitLettersSingle) +
                '...'
              )
            } else {
              return `${arrTextNoEmpty[0]} ${arrTextNoEmpty[1]} ${arrTextNoEmpty[2]}`
            }
          }
        }
      }
    }

    const memorySections = ['shopping', 'blanks']

    console.log('MemoryList')

    return (
      <div className="memory-list-container">
        {memoryList &&
          sectionClip &&
          memoryList.map((card, i) => {
            return (
              <div
                className={`memory-list-card memory-list-card-${sectionClip}`}
                key={`${i}`}
                ref={setCardRef(`card-${i}`)}
                data-id={card.id}
                data-index={i}
                data-personal-id={card?.personalId}
                style={{
                  width: `${sizeMiniCard.width}px`,
                  height: `${sizeMiniCard.height}px`,
                }}
                onClick={handleClickCard}
              >
                {memorySections.includes(sectionClip) && (
                  <div
                    className="memory-list-card-filter"
                    ref={setFilterRef(`filter-${card.id}`)}
                    data-id={card.id}
                    onMouseEnter={handleFilterMouseEnter}
                    onMouseLeave={handleFilterMouseLeave}
                  ></div>
                )}
                {memorySections.includes(sectionClip) && (
                  <img
                    className="memory-list-card-photo"
                    src={URL.createObjectURL(card[sectionClip].cardphoto)}
                    style={{
                      width: `${sizeMiniCard.width}px`,
                      height: `${sizeMiniCard.height}px`,
                    }}
                    alt="memoryCardPhoto"
                  ></img>
                )}

                {memorySections.includes(sectionClip) ? (
                  <>
                    {sectionClip === 'shopping' && card?.shopping?.date && (
                      <span className="memory-list-shopping-date-container">
                        <span className="memory-list-shopping-date">
                          {card.shopping.date.year}
                        </span>
                        <span className="memory-list-shopping-date">
                          {'\xA0'}
                          {shotMonths[card.shopping.date.month]}
                          {'\xA0'}
                        </span>
                        <span className="memory-list-shopping-date">
                          {card.shopping.date.day}
                        </span>
                      </span>
                    )}
                    <span
                      className={`memory-list-card-name memory-list-card-name-${sectionClip}`}
                      data-id={card.id}
                      onClick={handleClickCard}
                      onMouseEnter={handleFilterMouseEnter}
                      onMouseLeave={handleFilterMouseLeave}
                    >
                      {/* {card[infoChoiceClip].envelope.toaddress.name} */}
                      {trimLines(
                        sectionClip,
                        card[sectionClip].envelope.toaddress.name
                      )}
                    </span>
                  </>
                ) : sectionClip === 'myaddress' ? (
                  <span className={`memory-list-address-container`}>
                    <span
                      className={`memory-list-${sectionClip}-country`}
                      data-id={card.id}
                    >
                      {card.address.country}
                    </span>
                    <span
                      ref={myaddressNameRef}
                      className={`memory-list-${sectionClip}-name`}
                      data-id={card.id}
                    >
                      {trimLines(sectionClip, card.address.name)}
                    </span>
                  </span>
                ) : sectionClip === 'toaddress' ? (
                  <span className={`memory-list-address-container`}>
                    <span
                      ref={(el) =>
                        (spanNameRefs.current[`span-name-${i}`] = el)
                      }
                      className={`memory-list-${sectionClip}-name`}
                      data-id={card.id}
                    >
                      {trimLines(sectionClip, card.address.name)}
                    </span>
                    <span
                      className={`memory-list-${sectionClip}-country`}
                      data-id={card.id}
                    >
                      {card.address.country}
                    </span>
                  </span>
                ) : null}
                {listIconsSource &&
                  listIconsSource.map((btn, i) => {
                    return sectionClip === 'shopping' ||
                      sectionClip === 'blanks' ? (
                      <button
                        key={`${btn}-${i}`}
                        className="memory-list-btn"
                        ref={setBtnIconRef(`fullCard-${btn}`)}
                        data-id={card.id}
                        data-tooltip={btn}
                        style={{
                          color: 'rgb(71, 71, 71)',
                          backgroundColor: 'rgba(240, 240, 240, 0.75)',
                          top:
                            0.3 * remSize +
                            i * (1.7 * remSize + 0.3 * remSize) +
                            'px',
                        }}
                        onClick={handleBtnCardClick}
                        onMouseEnter={handleFilterMouseEnter}
                        onMouseLeave={handleFilterMouseLeave}
                      >
                        {addIconToolbar(btn)}
                      </button>
                    ) : (
                      <button
                        key={`${btn}-${i}`}
                        className="memory-list-btn"
                        ref={setBtnIconRef(`fullCard-${btn}`)}
                        data-id={card.id}
                        style={{
                          color: 'rgb(71, 71, 71)',
                          backgroundColor: 'rgba(240, 240, 240, 0.75)',
                          top:
                            0.3 * remSize +
                            i * (1.7 * remSize + 0.3 * remSize) +
                            'px',
                        }}
                        onClick={handleBtnCardClick}
                      >
                        {addIconToolbar(btn)}
                      </button>
                    )
                  })}
              </div>
            )
          })}
      </div>
    )
  }
}

export default MemoryList

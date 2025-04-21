import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './MemoryList.scss'
import { infoButtons } from '../../../redux/infoButtons/actionCreators'
import {
  getAllShopping,
  deleteShopping,
  getAllBlanks,
  deleteBlank,
  getAllRecordsAddresses,
  deleteToAddress,
  deleteMyAddress,
} from '../../../utils/cardFormNav/indexDB/indexDb'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'
import {
  addFullCard,
  choiceClip,
  expendMemoryCard,
  deltaEnd,
  choiceSave,
  addressPersonalId,
  choiceAddress,
  lockExpendMemoryCard,
} from '../../../redux/layout/actionCreators'
import { current } from '@reduxjs/toolkit'

const MemoryList = ({
  sizeMiniCard,
  // source: infoChoiceClip,
  widthCardsList,
  setInfoCardsList,
  valueScroll,
  setValueScroll,
}) => {
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
  const infoEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const personalId = useSelector((state) => state.layout.personalId)
  const [memoryList, setMemoryList] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
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
  const maxCardsList = useSelector((state) => state.layout.maxCardsList)
  const sliderLetter = useSelector((state) => state.layout.sliderLetter)
  const sliderLine = useSelector((state) => state.layout.sliderLine)
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
      (widthCardsList - sizeMiniCard.width * maxCardsList) /
      (maxCardsList - 1)
    ).toFixed(1)
  )

  const setCardRef = (id) => (element) => {
    cardRefs.current[id] = element
  }

  const processMemoryCards = (records, getName) => {
    const sortedRecords = records.sort((a, b) =>
      getName(a).localeCompare(getName(b))
    )
    const firstLetterList = sortedRecords.map((card, i) => ({
      letter: getName(card)[0],
      id: card.id,
      index: i,
    }))
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
      blanks: ['plus', 'remove'],
    }

    setListIconsSource(iconConfig[source] || [])

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
      }
      default:
        console.error('Unknown source:', source)
        break
    }

    setMemoryList(memoryCards)
    setSelectedSource(source)
    if (memoryCards.length) {
      setInfoCardsList({
        length: memoryCards.length,
        firstLetters: firstLetterList,
      })
      setFirstLetterCardsList(firstLetterList)
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
        (listElements.length !== 1 && listElements.length >= maxCardsList)
      ) {
        return index
      }
      if (listElements.length !== 1 && listElements.length < maxCardsList) {
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
          dispatch(addressPersonalId(false))
          dispatch(infoButtons({ envelopeSave: false }))
        }, 500)
      }, 1000)

      return () => clearTimeout(fadeOutTimer)
    }
  }, [elementSave, dispatch])

  useEffect(() => {
    if (sliderLine) {
      // console.log('0')
      movingCards(Number(sliderLine))
    }
  }, [sliderLine])

  useEffect(() => {
    if (sliderLetter && sliderLetter.index) {
      // console.log('1')
      movingCards(Number(sliderLetter.index))
    }
  }, [sliderLetter])

  useEffect(() => {
    if (maxCardsList && infoChoiceClip) {
      getMemoryCards(infoChoiceClip)
    }
  }, [infoChoiceClip, maxCardsList])

  useEffect(() => {
    if (infoEnvelopeSave && personalId) {
      getMemoryCards(infoEnvelopeSave)
      dispatch(infoButtons({ envelopeSaveSecond: infoEnvelopeSave }))
    }
  }, [infoEnvelopeSave, personalId, dispatch])

  useEffect(() => {
    if (personalId && infoEnvelopeSave) {
      findElementByPersonalId(personalId, infoEnvelopeSave)
    }
  }, [memoryList, personalId, infoEnvelopeSave])

  useEffect(() => {
    if (memoryList) {
      if (infoElementSave) {
        // console.log('2')
        movingCards(
          getPositionCard(infoElementSave.index, infoElementSave.firstLetter)
        )
      } else {
        if (!isDeleteCard && !sliderLine) {
          // console.log('3')
          movingCards(0)
        } else {
          // console.log('4')
          movingCards(Number(sliderLine))
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
      const restEnd = memoryList.length - index - maxCardsList
      const baseLeft = margin + sizeMiniCard.width

      const updatePosition = (index, leftValue) => {
        if (cardRefs.current[`card-${index}`]) {
          cardRefs.current[`card-${index}`].style.left = `${leftValue}px`
        }
      }

      if (index === 0) {
        // console.log('index0')
        for (let i = 1; i < maxCardsList; i++) {
          updatePosition(i, baseLeft * i)
        }
        for (let i = maxCardsList; i < memoryList.length - 3; i++) {
          updatePosition(i, baseLeft * (maxCardsList - 1))
        }
      }

      if (index === 1) {
        // console.log('index1')
        updatePosition(0, 0)
        updatePosition(1, 0.5 * remSize)
        for (let i = 2; i < maxCardsList + index; i++) {
          updatePosition(i, baseLeft * (i - 1))
        }
      }

      if (index === 2) {
        // console.log('index2')
        updatePosition(1, 0.5 * remSize)
        updatePosition(index, remSize)
        let newIndex = 1
        for (let i = index + 1; i < maxCardsList + index; i++) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      if (index > 2 && memoryList.length - index >= maxCardsList) {
        // console.log('index>2')
        for (let i = 0; i < index - 2; i++) {
          updatePosition(i, 0)
        }
        updatePosition(index - 2, 0)
        updatePosition(index - 1, 0.5 * remSize)
        updatePosition(index, remSize)
        let newIndex = 1
        for (let i = index + 1; i < maxCardsList + index; i++) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      if (restEnd >= 2) {
        // console.log('restEnd>=2')
        updatePosition(
          index + (maxCardsList - 1),
          baseLeft * (maxCardsList - 1) - remSize
        )
        updatePosition(
          index + maxCardsList,
          baseLeft * (maxCardsList - 1) - 0.5 * remSize
        )
        for (let i = index + maxCardsList + 1; i < memoryList.length; i++) {
          updatePosition(i, baseLeft * (maxCardsList - 1))
        }
      }

      if (restEnd === 1) {
        // console.log('restEnd1')
        updatePosition(
          index + maxCardsList - 1,
          baseLeft * (maxCardsList - 1) - 0.5 * remSize
        )
        updatePosition(index + maxCardsList, baseLeft * (maxCardsList - 1))
      }

      if (restEnd < 0 && memoryList.length >= maxCardsList) {
        // console.log('restEnd<0')
        if (memoryList.length - maxCardsList >= 2) {
          updatePosition(memoryList.length - maxCardsList - 2, 0)
          updatePosition(memoryList.length - maxCardsList - 1, 0.5 * remSize)
          updatePosition(memoryList.length - maxCardsList, remSize)
          for (let i = 0; i < memoryList.length - maxCardsList - 2; i++) {
            updatePosition(i, 0)
          }
        }
        if (memoryList.length - maxCardsList === 1) {
          updatePosition(memoryList.length - maxCardsList - 1, 0)
          updatePosition(memoryList.length - maxCardsList, 0.5 * remSize)
          for (let i = 0; i < memoryList.length - maxCardsList - 2; i++) {
            updatePosition(i, 0)
          }
        }
        let newIndex = 1
        for (
          let i = memoryList.length - maxCardsList + 1;
          i < memoryList.length;
          i++
        ) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      // changeStyleFirstAndLastCards()
      dispatch(deltaEnd(restEnd === 0))
    }
  }

  const handleClickCardBtn = async (evt) => {
    evt.stopPropagation()
    try {
      const parentBtn = evt.target.closest('.memory-list-btn')
      if (!parentBtn && !parentBtn.dataset.id) {
        return
      }
      switch (infoChoiceClip) {
        case 'shopping':
          await deleteShopping(Number(parentBtn.dataset.id))
          break
        case 'blanks':
          await deleteBlank(Number(parentBtn.dataset.id))
          break
        case 'myaddress':
          await deleteMyAddress(Number(parentBtn.dataset.id))
          dispatch(infoButtons({ envelopeRemoveAddress: infoChoiceClip }))
          break
        case 'toaddress':
          await deleteToAddress(Number(parentBtn.dataset.id))
          dispatch(infoButtons({ envelopeRemoveAddress: infoChoiceClip }))
          break

        default:
          break
      }
      await getMemoryCards(infoChoiceClip)
      dispatch(addFullCard(true))
      setIsDeleteCard(true)
    } catch (error) {
      console.log('Error deleting card:', error)
    }
  }

  const handleMouseEnterFilter = (evt) => {
    if (evt.target.dataset.id) {
      filterRefs.current[
        `filter-${evt.target.dataset.id}`
      ].style.backgroundColor = 'rgba(163, 163, 163, 0)'
    }
  }

  const handleMouseLeaveFilter = (evt) => {
    if (evt.target.dataset.id) {
      filterRefs.current[
        `filter-${evt.target.dataset.id}`
      ].style.backgroundColor = 'rgba(163, 163, 163, 0.3)'
    }
  }

  const handleClickCard = (evt) => {
    dispatch(lockExpendMemoryCard(false))
    dispatch(
      expendMemoryCard({ source: infoChoiceClip, id: evt.target.dataset.id })
    )
    if (infoChoiceClip === 'shopping' || infoChoiceClip === 'blanks') {
      dispatch(choiceClip(false))
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

  return (
    <div className="memory-list-container">
      {memoryList &&
        infoChoiceClip === selectedSource &&
        memoryList.map((card, i) => {
          return (
            <div
              className={`memory-list-card memory-list-card-${infoChoiceClip}`}
              key={`${i}`}
              ref={setCardRef(`card-${i}`)}
              data-id={card.id}
              data-index={i}
              data-personal-id={card.personalId}
              style={{
                width: `${sizeMiniCard.width}px`,
                height: `${sizeMiniCard.height}px`,
              }}
              onClick={handleClickCard}
            >
              {(infoChoiceClip === 'shopping' ||
                infoChoiceClip === 'blanks') && (
                <div
                  className="memory-list-card-filter"
                  ref={setFilterRef(`filter-${card.id}`)}
                  data-id={card.id}
                  onMouseEnter={handleMouseEnterFilter}
                  onMouseLeave={handleMouseLeaveFilter}
                ></div>
              )}
              {(infoChoiceClip === 'shopping' ||
                infoChoiceClip === 'blanks') && (
                <img
                  className="memory-list-card-photo"
                  src={URL.createObjectURL(card[infoChoiceClip].cardphoto)}
                  style={{
                    width: `${sizeMiniCard.width}px`,
                    height: `${sizeMiniCard.height}px`,
                  }}
                  alt="memoryCardPhoto"
                ></img>
              )}
              {infoChoiceClip === 'shopping' || infoChoiceClip === 'blanks' ? (
                <span
                  className={`memory-list-card-name memory-list-card-name-${infoChoiceClip}`}
                  data-id={card.id}
                  onClick={handleClickCard}
                  onMouseEnter={handleMouseEnterFilter}
                  onMouseLeave={handleMouseLeaveFilter}
                >
                  {/* {card[infoChoiceClip].envelope.toaddress.name} */}
                  {trimLines(
                    infoChoiceClip,
                    card[infoChoiceClip].envelope.toaddress.name
                  )}
                </span>
              ) : infoChoiceClip === 'myaddress' ? (
                <span className={`memory-list-address-container`}>
                  <span
                    className={`memory-list-${infoChoiceClip}-country`}
                    data-id={card.id}
                  >
                    {card.address.country}
                  </span>
                  <span
                    ref={myaddressNameRef}
                    className={`memory-list-${infoChoiceClip}-name`}
                    data-id={card.id}
                  >
                    {trimLines(infoChoiceClip, card.address.name)}
                  </span>
                </span>
              ) : infoChoiceClip === 'toaddress' ? (
                <span className={`memory-list-address-container`}>
                  <span
                    ref={(el) => (spanNameRefs.current[`span-name-${i}`] = el)}
                    className={`memory-list-${infoChoiceClip}-name`}
                    data-id={card.id}
                  >
                    {trimLines(infoChoiceClip, card.address.name)}
                  </span>
                  <span
                    className={`memory-list-${infoChoiceClip}-country`}
                    data-id={card.id}
                  >
                    {card.address.country}
                  </span>
                </span>
              ) : null}
              {listIconsSource &&
                listIconsSource.map((btn, i) => {
                  return infoChoiceClip === 'shopping' ||
                    infoChoiceClip === 'blanks' ? (
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
                      onClick={handleClickCardBtn}
                      onMouseEnter={handleMouseEnterFilter}
                      onMouseLeave={handleMouseLeaveFilter}
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
                      onClick={handleClickCardBtn}
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

export default MemoryList

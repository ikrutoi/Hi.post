import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './MemoryList.scss'
import {
  getAllShopping,
  deleteShopping,
  getAllBlanks,
  deleteBlank,
  getAllRecordsAddresses,
} from '../../../utils/cardFormNav/indexDB/indexDb'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'
import {
  addFullCard,
  choiceClip,
  expendStatusCard,
  deltaEnd,
} from '../../../redux/layout/actionCreators'

const MemoryList = ({
  sizeMiniCard,
  // source: infoChoiceClip,
  widthCardsList,
  setInfoCardsList,
}) => {
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
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

  const getMemoryCards = async (source) => {
    let memoryCards
    let firstLetterList = []
    switch (source) {
      case 'toaddress':
        setListIconsSource(['remove'])
        const memoryCardsToAddress = await getAllRecordsAddresses('toAddress')
        memoryCards = memoryCardsToAddress.sort((a, b) => {
          return a.address.name.localeCompare(b.address.name)
        })
        memoryCards.forEach((card, i) => {
          const cardId = {
            letter: card.address.name[0],
            id: card.id,
            index: i,
          }
          firstLetterList.push(cardId)
        })
        firstLetterList.push(firstLetterList[firstLetterList.length - 1])
        break
      case 'myaddress':
        setListIconsSource(['remove'])
        const memoryCardsMyAddress = await getAllRecordsAddresses('myAddress')
        memoryCards = memoryCardsMyAddress.sort((a, b) => {
          return a.address.name.localeCompare(b.address.name)
        })
        memoryCards.forEach((card, i) => {
          const cardId = {
            letter: card.address.name[0],
            id: card.id,
            index: i,
          }
          firstLetterList.push(cardId)
        })
        firstLetterList.push(firstLetterList[firstLetterList.length - 1])
        break
      case 'shopping':
        setListIconsSource(['save', 'remove'])
        const memoryCardsShopping = await getAllShopping()
        memoryCards = memoryCardsShopping.sort((a, b) => {
          return a.shopping.envelope.toaddress.name.localeCompare(
            b.shopping.envelope.toaddress.name
          )
        })
        memoryCards.forEach((card, i) => {
          const cardId = {
            letter: card.shopping.envelope.toaddress.name[0],
            id: card.id,
            index: i,
          }
          firstLetterList.push(cardId)
        })
        firstLetterList.push(firstLetterList[firstLetterList.length - 1])
        break
      case 'blanks':
        setListIconsSource(['plus', 'remove'])
        const memoryCardsBlanks = await getAllBlanks()
        memoryCards = memoryCardsBlanks.sort((a, b) => {
          return a.blanks.envelope.toaddress.name.localeCompare(
            b.blanks.envelope.toaddress.name
          )
        })
        memoryCards.forEach((card, i) => {
          const cardId = {
            letter: card.blanks.envelope.toaddress.name[0],
            id: card.id,
            index: i,
          }
          firstLetterList.push(cardId)
        })
        firstLetterList.push(firstLetterList[firstLetterList.length - 1])
        break

      default:
        break
    }
    setMemoryList(memoryCards)
    setSelectedSource(source)
    setInfoCardsList({
      length: memoryCards.length,
      firstLetters: firstLetterList,
    })
  }

  useEffect(() => {
    if (cardRefs.current && memoryList && sliderLine !== undefined) {
      const currentDeltaEnd =
        memoryList.length - Number(sliderLine) - maxCardsList

      const updatePosition = (index, leftValue) => {
        if (cardRefs.current[`card-${index}`]) {
          cardRefs.current[`card-${index}`].style.left = `${leftValue}px`
        }
      }

      if (Number(sliderLine) === 0) {
        console.log('0')
        for (let i = 1; i < maxCardsList; i++) {
          updatePosition(i, (margin + sizeMiniCard.width) * i)
        }
      }

      if (Number(sliderLine) === 1) {
        console.log('1')
        updatePosition(1, 0.5 * remSize)
        for (let i = 2; i < maxCardsList + Number(sliderLine); i++) {
          updatePosition(i, (margin + sizeMiniCard.width) * (i - 1))
        }
      }

      if (Number(sliderLine) > 1) {
        console.log('>1')
        updatePosition(Number(sliderLine) - 1, 0.5 * remSize)
        updatePosition(Number(sliderLine), remSize)
        let index = 1
        for (
          let i = Number(sliderLine) + 1;
          i < maxCardsList + Number(sliderLine);
          i++
        ) {
          updatePosition(i, (margin + sizeMiniCard.width) * index)
          index++
        }
      }

      dispatch(deltaEnd(currentDeltaEnd === 0))

      if (currentDeltaEnd > 0) {
        console.log('>0')
        if (currentDeltaEnd > 1) {
          console.log('>01')
          updatePosition(
            memoryList.length - 2,
            (margin + sizeMiniCard.width) * (maxCardsList - 1) - 0.5 * remSize
          )
          updatePosition(
            memoryList.length - 3,
            (margin + sizeMiniCard.width) * (maxCardsList - 1) - remSize
          )
        } else {
          console.log('else>1')
          updatePosition(
            memoryList.length - 2,
            (margin + sizeMiniCard.width) * (maxCardsList - 1) - 0.5 * remSize
          )
        }
      }

      if (currentDeltaEnd < 0) {
        for (let i = 1; i < memoryList.length - maxCardsList; i++) {
          updatePosition(i, 0)
        }
        let index = 0
        for (
          let i = memoryList.length - maxCardsList;
          i < memoryList.length;
          i++
        ) {
          updatePosition(i, (margin + sizeMiniCard.width) * index)
          index++
        }
      }
    }
  }, [
    sliderLine,
    cardRefs,
    maxCardsList,
    memoryList,
    remSize,
    sizeMiniCard,
    margin,
    dispatch,
  ])

  useEffect(() => {
    if (maxCardsList) {
      getMemoryCards(infoChoiceClip)
    }
  }, [infoChoiceClip, maxCardsList])

  const handleClickCardBtn = async (evt) => {
    try {
      const parentBtn = evt.target.closest('.memory-status-card-btn')
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

        default:
          break
      }
      await getMemoryCards(infoChoiceClip)
      dispatch(addFullCard(true))
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

  const handleClickFilter = (evt) => {
    dispatch(
      expendStatusCard({ source: infoChoiceClip, id: evt.target.dataset.id })
    )
    dispatch(choiceClip(false))
  }

  const getLeft = (i) => {
    if (memoryList.length > maxCardsList) {
      if (memoryList.length === maxCardsList + 1) {
        if (i === maxCardsList - 1) {
          return (
            (maxCardsList - 1) * (margin + sizeMiniCard.width) -
            0.5 * remSize +
            'px'
          )
        }
        if (i === maxCardsList) {
          return (maxCardsList - 1) * (margin + sizeMiniCard.width) + 'px'
        }
        if (i < maxCardsList - 1) {
          return i * (margin + sizeMiniCard.width) + 'px'
        }
      } else {
        if (i === memoryList.length - 3) {
          return (
            (maxCardsList - 1) * (margin + sizeMiniCard.width) - remSize + 'px'
          )
        }
        if (i === memoryList.length - 2) {
          return (
            (maxCardsList - 1) * (margin + sizeMiniCard.width) -
            0.5 * remSize +
            'px'
          )
        }
        if (
          i >= maxCardsList - 1 &&
          i !== memoryList.length - 3 &&
          i !== memoryList.length - 2
        ) {
          return (maxCardsList - 1) * (margin + sizeMiniCard.width) + 'px'
        }
        if (i < maxCardsList - 1) {
          return i * (margin + sizeMiniCard.width) + 'px'
        }
      }
    } else {
      return i * (margin + sizeMiniCard.width) + 'px'
    }
  }

  useEffect(() => {
    if (
      memoryList &&
      sliderLetter &&
      cardRefs.current[`card-${sliderLetter.index}`]
    ) {
      const sliderIndex = Number(sliderLetter.index)
      const deltaEnd = memoryList.length - sliderIndex
      const updatePosition = (index, leftValue) => {
        if (cardRefs.current[`card-${index}`]) {
          cardRefs.current[`card-${index}`].style.left = `${leftValue}px`
        }
      }

      if (deltaEnd >= maxCardsList) {
        updatePosition(sliderIndex, remSize)

        for (let i = 0; i < sliderIndex; i++) {
          const leftValue = i === sliderIndex - 1 ? 0.5 * remSize : 0
          updatePosition(i, leftValue)
        }

        let indexStart = 0

        for (let i = sliderIndex; i < memoryList.length; i++) {
          const defaultLeft = (margin + sizeMiniCard.width) * indexStart

          if (i === sliderIndex) {
            const leftValue = i === 0 ? defaultLeft : remSize + defaultLeft
            updatePosition(i, leftValue)
          } else if (i < sliderIndex + maxCardsList) {
            if (deltaEnd - maxCardsList >= 2) {
              const leftValue =
                i === sliderIndex + maxCardsList - 1
                  ? defaultLeft - remSize
                  : i === sliderIndex + maxCardsList
                  ? defaultLeft - 0.5 * remSize
                  : defaultLeft
              updatePosition(i, leftValue)
            } else if (deltaEnd - maxCardsList === 1) {
              const leftValue =
                i === sliderIndex + maxCardsList - 1
                  ? defaultLeft - 0.5 * remSize
                  : defaultLeft
              updatePosition(i, leftValue)
            } else {
              updatePosition(i, defaultLeft)
            }
          } else {
            const adjustedIndexStart = indexStart - 1
            const leftValue =
              i === memoryList.length - 3
                ? (margin + sizeMiniCard.width) * adjustedIndexStart - remSize
                : i === memoryList.length - 2
                ? (margin + sizeMiniCard.width) * adjustedIndexStart -
                  0.5 * remSize
                : (margin + sizeMiniCard.width) * adjustedIndexStart
            updatePosition(i, leftValue)
            indexStart--
          }
          indexStart++
        }
      }
    }
  }, [sliderLetter, memoryList])

  return (
    <div className="memory-list-container">
      {memoryList &&
        infoChoiceClip === selectedSource &&
        memoryList.map((card, i) => {
          return (
            <div
              className="memory-list-card"
              key={`${i}`}
              ref={setCardRef(`card-${i}`)}
              style={{
                width: `${sizeMiniCard.width}px`,
                height: `${sizeMiniCard.height}px`,
                left: getLeft(i),
              }}
            >
              {(infoChoiceClip === 'shopping' ||
                infoChoiceClip === 'blanks') && (
                <div
                  className="memory-list-card-filter"
                  ref={setFilterRef(`filter-${card.id}`)}
                  data-id={card.id}
                  onClick={handleClickFilter}
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
                  className="memory-list-card-name"
                  data-id={card.id}
                  onClick={handleClickFilter}
                  onMouseEnter={handleMouseEnterFilter}
                  onMouseLeave={handleMouseLeaveFilter}
                >
                  {card[infoChoiceClip].envelope.toaddress.name}
                </span>
              ) : (
                <span className="memory-list-card-name" data-id={card.id}>
                  {card.address.name}
                </span>
              )}
              {listIconsSource &&
                listIconsSource.map((btn, i) => {
                  return infoChoiceClip === 'shopping' ||
                    infoChoiceClip === 'blanks' ? (
                    <button
                      key={`${btn}-${i}`}
                      className="memory-list-card-btn"
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
                      className="memory-list-card-btn"
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

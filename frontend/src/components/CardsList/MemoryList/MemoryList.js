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

  const movingCards = (index) => {
    if (cardRefs.current && memoryList) {
      const restEnd = memoryList.length - index - maxCardsList
      const baseLeft = margin + sizeMiniCard.width

      const updatePosition = (index, leftValue) => {
        if (cardRefs.current[`card-${index}`]) {
          cardRefs.current[`card-${index}`].style.left = `${leftValue}px`
        }
      }

      if (index === 0) {
        for (let i = 1; i < maxCardsList; i++) {
          updatePosition(i, baseLeft * i)
        }
        for (let i = maxCardsList; i < memoryList.length - 3; i++) {
          updatePosition(i, baseLeft * (maxCardsList - 1))
        }
      }

      if (index === 1) {
        updatePosition(0, 0)
        updatePosition(1, 0.5 * remSize)
        for (let i = 2; i < maxCardsList + index; i++) {
          updatePosition(i, baseLeft * (i - 1))
        }
      }

      if (index === 2) {
        updatePosition(index, remSize)
        let newIndex = 1
        for (let i = index + 1; i < maxCardsList + index; i++) {
          updatePosition(i, baseLeft * newIndex)
          newIndex++
        }
      }

      if (index > 2 && memoryList.length - index >= maxCardsList) {
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
        updatePosition(
          index + maxCardsList - 1,
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
        updatePosition(
          index + maxCardsList - 1,
          baseLeft * (maxCardsList - 1) - 0.5 * remSize
        )
        updatePosition(index + maxCardsList, baseLeft * (maxCardsList - 1))
      }

      if (restEnd < 0) {
        if (memoryList.length - maxCardsList >= 2) {
          updatePosition(memoryList.length - maxCardsList - 2, 0)
          updatePosition(memoryList.length - maxCardsList - 1, 0.5 * remSize)
          updatePosition(memoryList.length - maxCardsList, remSize)
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

      dispatch(deltaEnd(restEnd === 0))
    }
  }

  useEffect(() => {
    if (sliderLine) {
      movingCards(Number(sliderLine))
    }
  }, [sliderLine])

  useEffect(() => {
    if (sliderLetter && sliderLetter.index) {
      movingCards(Number(sliderLetter.index))
    }
  }, [sliderLetter])

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

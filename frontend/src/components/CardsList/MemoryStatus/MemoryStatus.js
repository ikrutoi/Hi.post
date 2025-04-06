import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './MemoryStatus.scss'
import {
  getAllShopping,
  deleteShopping,
  getAllBlanks,
  deleteBlank,
} from '../../../utils/cardFormNav/indexDB/indexDb'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'
import {
  addFullCard,
  choiceClip,
  expendStatusCard,
} from '../../../redux/layout/actionCreators'

const MemoryStatus = ({
  sizeMiniCard,
  source,
  widthCardsList,
  setInfoCardsList,
}) => {
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
  const dispatch = useDispatch()

  const setCardRef = (id) => (element) => {
    cardRefs.current[id] = element
  }

  const getMemoryCards = async (source) => {
    let memoryCards
    let firstLetterList = []
    switch (source) {
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
    if (maxCardsList) {
      getMemoryCards(source)
    }
  }, [source, maxCardsList])

  const handleClickCardBtn = async (evt) => {
    try {
      const parentBtn = evt.target.closest('.memory-status-card-btn')
      if (!parentBtn && !parentBtn.dataset.id) {
        return
      }
      switch (source) {
        case 'shopping':
          await deleteShopping(Number(parentBtn.dataset.id))
          break
        case 'blanks':
          await deleteBlank(Number(parentBtn.dataset.id))
          break

        default:
          break
      }
      await getMemoryCards(source)
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
    dispatch(expendStatusCard({ source, id: evt.target.dataset.id }))
    dispatch(choiceClip(false))
  }

  const margin = parseFloat(
    (
      (widthCardsList - sizeMiniCard.width * maxCardsList) /
      (maxCardsList - 1)
    ).toFixed(1)
  )

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
      const deltaEnd = memoryList.length - Number(sliderLetter.index)
      console.log(
        'info',
        memoryList.length,
        maxCardsList,
        sliderLetter.letter,
        sliderLetter.index,
        deltaEnd
      )
      if (deltaEnd >= maxCardsList) {
        cardRefs.current[`card-${Number(sliderLetter.index)}`].style.left =
          remSize + 'px'
        for (let i = 0; i < Number(sliderLetter.index); i++) {
          if (i === Number(sliderLetter.index) - 1) {
            cardRefs.current[`card-${i}`].style.left = 0.5 * remSize + 'px'
          } else {
            cardRefs.current[`card-${i}`].style.left = 0
          }
        }

        let indexStart = 0
        for (let i = Number(sliderLetter.index); i < memoryList.length; i++) {
          if (i === Number(sliderLetter.index)) {
            console.log('i 00', i)
            cardRefs.current[`card-${i}`].style.left =
              remSize + (margin + sizeMiniCard.width) * indexStart + 'px'
          }
          if (
            i !== Number(sliderLetter.index) &&
            i < Number(sliderLetter.index) + maxCardsList
          ) {
            if (deltaEnd - maxCardsList >= 2) {
              if (i === Number(sliderLetter.index) + maxCardsList - 1) {
                cardRefs.current[`card-${i}`].style.left =
                  (margin + sizeMiniCard.width) * indexStart - remSize + 'px'
              }
              if (i === Number(sliderLetter.index) + maxCardsList) {
                cardRefs.current[`card-${i}`].style.left =
                  (margin + sizeMiniCard.width) * indexStart -
                  0.5 * remSize +
                  'px'
              }
              if (
                i !== Number(sliderLetter.index) + maxCardsList - 1 &&
                i !== Number(sliderLetter.index) + maxCardsList
              ) {
                cardRefs.current[`card-${i}`].style.left =
                  (margin + sizeMiniCard.width) * indexStart + 'px'
              }
            }

            if (deltaEnd - maxCardsList === 1) {
              if (i === Number(sliderLetter.index) + maxCardsList - 1) {
                cardRefs.current[`card-${i}`].style.left =
                  (margin + sizeMiniCard.width) * indexStart -
                  0.5 * remSize +
                  'px'
              } else {
                cardRefs.current[`card-${i}`].style.left =
                  (margin + sizeMiniCard.width) * indexStart + 'px'
              }
            }

            if (deltaEnd - maxCardsList === 0) {
              cardRefs.current[`card-${i}`].style.left =
                (margin + sizeMiniCard.width) * indexStart + 'px'
            }
          }

          if (i >= Number(sliderLetter.index) + maxCardsList) {
            console.log('i 02', i)
            // console.log('indexStart', indexStart)
            if (i === memoryList.length - 3) {
              console.log('-3')
              cardRefs.current[`card-${i}`].style.left =
                (margin + sizeMiniCard.width) * (indexStart - 1) -
                remSize +
                'px'
            }
            if (i === memoryList.length - 2) {
              console.log('-2')
              cardRefs.current[`card-${i}`].style.left =
                (margin + sizeMiniCard.width) * (indexStart - 1) -
                0.5 * remSize +
                'px'
            }
            if (i !== memoryList.length - 3 && i !== memoryList.length - 2) {
              console.log('-1')
              cardRefs.current[`card-${i}`].style.left =
                (margin + sizeMiniCard.width) * (indexStart - 1) + 'px'
            }
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
        source === selectedSource &&
        memoryList.map((card, i) => {
          return (
            <div
              className="memory-status-card"
              key={`${i}`}
              ref={setCardRef(`card-${i}`)}
              style={{
                width: `${sizeMiniCard.width}px`,
                height: `${sizeMiniCard.height}px`,
                left: getLeft(i),
              }}
            >
              <div
                className="memory-status-card-filter"
                ref={setFilterRef(`filter-${card.id}`)}
                data-id={card.id}
                onClick={handleClickFilter}
                onMouseEnter={handleMouseEnterFilter}
                onMouseLeave={handleMouseLeaveFilter}
              ></div>
              <img
                className="memory-status-card-photo"
                src={URL.createObjectURL(card[source].cardphoto)}
                style={{
                  width: `${sizeMiniCard.width}px`,
                  height: `${sizeMiniCard.height}px`,
                }}
                alt="memoryCardPhoto"
              ></img>
              <span
                className="memory-status-card-name"
                data-id={card.id}
                onClick={handleClickFilter}
                onMouseEnter={handleMouseEnterFilter}
                onMouseLeave={handleMouseLeaveFilter}
              >
                {card[source].envelope.toaddress.name}
              </span>
              {listIconsSource &&
                listIconsSource.map((btn, i) => {
                  return (
                    <button
                      key={`${btn}-${i}`}
                      className="memory-status-card-btn"
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
                  )
                })}
            </div>
          )
        })}
    </div>
  )
}

export default MemoryStatus

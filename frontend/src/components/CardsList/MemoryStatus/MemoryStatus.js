import { useEffect, useRef, useState } from 'react'
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

const MemoryStatus = ({ sizeMiniCard, source, widthCardsList }) => {
  const [memoryList, setMemoryList] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [listIconsSource, setListIconsSource] = useState(null)
  const btnIconRefs = useRef({})
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const filterRefs = useRef({})
  const setFilterRef = (id) => (element) => {
    filterRefs.current[id] = element
  }
  const remSize = useSelector((state) => state.layout.remSize)
  const maxCardsList = useSelector((state) => state.layout.maxCardsList)
  const dispatch = useDispatch()

  const getMemoryCards = async (source) => {
    let memoryCards
    switch (source) {
      case 'shopping':
        setListIconsSource(['save', 'remove'])
        memoryCards = await getAllShopping()
        break
      case 'blanks':
        setListIconsSource(['plus', 'remove'])
        memoryCards = await getAllBlanks()
        break

      default:
        break
    }
    setMemoryList(memoryCards)
    setSelectedSource(source)
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

  const getLeft = (i) => {
    const margin = parseFloat(
      (
        (widthCardsList - sizeMiniCard.width * maxCardsList) /
        (maxCardsList - 1)
      ).toFixed(1)
    )

    if (memoryList.length > maxCardsList) {
      if (i === maxCardsList && i + 1 < memoryList.length) {
        return (
          (maxCardsList - 1) * (margin + sizeMiniCard.width) - remSize + 'px'
        )
      }
      if (i === maxCardsList + 1 && i + 1 < memoryList.length) {
        return (
          (maxCardsList - 1) * (margin + sizeMiniCard.width) -
          remSize * 0.5 +
          'px'
        )
      }
      if (i > maxCardsList + 1) {
        return (maxCardsList - 1) * (margin + sizeMiniCard.width) + 'px'
      }
      if (i < maxCardsList) {
        return i * (margin + sizeMiniCard.width) + 'px'
      }
    } else {
      return i * (margin + sizeMiniCard.width) + 'px'
    }
  }

  return (
    <div className="memory-list-container">
      {memoryList &&
        source === selectedSource &&
        memoryList.map((card, i) => {
          return (
            <div
              className="memory-status-card"
              key={`${card.id}`}
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

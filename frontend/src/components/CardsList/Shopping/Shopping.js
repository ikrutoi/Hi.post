import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import './Shopping.scss'
import { getAllCards } from '../../../utils/cardFormNav/indexDB/indexDb'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'
import { deleteCard } from '../../../utils/cardFormNav/indexDB/indexDb'
import { addFullCard } from '../../../redux/layout/actionCreators'

const Shopping = ({ sizeMiniCard }) => {
  const [shoppingCards, setShoppingCards] = useState(null)
  const listIconsFullCard = ['delete2']
  const [isFilter, setIsFilter] = useState(true)
  const btnIconRefs = useRef({})
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const filterRefs = useRef({})
  const setFilterRef = (id) => (element) => {
    filterRefs.current[id] = element
  }
  const dispatch = useDispatch()

  const getCards = async () => {
    const cards = await getAllCards()
    setShoppingCards(cards)
  }

  useEffect(() => {
    getCards()
  }, [])

  const handleClickCardBtn = async (evt) => {
    try {
      const parentBtn = evt.target.closest('.shopping-card-btn')
      if (!parentBtn && !parentBtn.dataset.id) {
        return
      }
      await deleteCard(Number(parentBtn.dataset.id))
      await getCards()
      dispatch(addFullCard(true))
    } catch (error) {
      console.log('Error deleting card:', error)
    }
  }

  const handleMouseEnterFilter = (evt) => {
    filterRefs.current[
      `filter-${evt.target.dataset.id}`
    ].style.backgroundColor = 'rgba(163, 163, 163, 0)'
    // setIsFilter(false)
  }

  const handleMouseLeaveFilter = (evt) => {
    filterRefs.current[
      `filter-${evt.target.dataset.id}`
    ].style.backgroundColor = 'rgba(163, 163, 163, 0.3)'
    // setIsFilter(true)
  }

  return (
    <div className="shopping-container">
      {shoppingCards &&
        shoppingCards.map((card, i) => {
          return (
            <div
              className="shopping-card"
              key={`${card.id}-${i}`}
              style={{
                width: `${sizeMiniCard.width}px`,
                height: `${sizeMiniCard.height}px`,
              }}
            >
              <div
                className="shopping-card-filter"
                ref={setFilterRef(`filter-${card.id}`)}
                data-id={card.id}
                // style={{
                //   backgroundColor: isFilter && card.id ===
                //     ? 'rgba(163, 163, 163, 0.3)'
                //     : 'rgba(163, 163, 163, 0)',
                // }}
                onMouseEnter={handleMouseEnterFilter}
                onMouseLeave={handleMouseLeaveFilter}
              ></div>
              {/* {cardUrl && ( */}
              <img
                className="shopping-card-photo"
                // src={imgSrc}
                src={URL.createObjectURL(card.card.cardphoto)}
                style={{
                  width: `${sizeMiniCard.width}px`,
                  height: `${sizeMiniCard.height}px`,
                  // position: 'absolute',
                }}
                alt="shoppingCardPhoto"
              ></img>

              <div className="shopping-card-btns">
                {listIconsFullCard.map((btn, i) => {
                  return (
                    <button
                      key={`${btn}-${i}`}
                      className="shopping-card-btn"
                      ref={setBtnIconRef(`fullCard-${btn}`)}
                      data-id={card.id}
                      style={{
                        color: 'rgb(71, 71, 71)',
                        backgroundColor: 'rgba(240, 240, 240, 0.75)',
                        // transition:
                        //   'background-color 0.3s ease, color 0.3s ease',
                      }}
                      onClick={handleClickCardBtn}
                    >
                      {addIconToolbar(btn)}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default Shopping

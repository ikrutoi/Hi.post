import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import './Shopping.scss'
import {
  getAllShopping,
  deleteShopping,
} from '../../../utils/cardFormNav/indexDB/indexDb'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'
import {
  addFullCard,
  choiceClip,
  expendShopping,
} from '../../../redux/layout/actionCreators'

const Shopping = ({ sizeMiniCard }) => {
  const [shopping, setShopping] = useState(null)
  const listIconsFullCard = ['remove']
  const btnIconRefs = useRef({})
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const filterRefs = useRef({})
  const setFilterRef = (id) => (element) => {
    filterRefs.current[id] = element
  }
  const dispatch = useDispatch()

  const getShopping = async () => {
    const shopping = await getAllShopping()
    setShopping(shopping)
  }

  useEffect(() => {
    getShopping()
  }, [])

  const handleClickCardBtn = async (evt) => {
    try {
      const parentBtn = evt.target.closest('.shopping-card-btn')
      if (!parentBtn && !parentBtn.dataset.id) {
        return
      }
      await deleteShopping(Number(parentBtn.dataset.id))
      await getShopping()
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
    dispatch(expendShopping(evt.target.dataset.id))
    dispatch(choiceClip(false))
  }

  return (
    <div className="shopping-container">
      {shopping &&
        shopping.map((card, i) => {
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
                onClick={handleClickFilter}
                onMouseEnter={handleMouseEnterFilter}
                onMouseLeave={handleMouseLeaveFilter}
              ></div>
              <img
                className="shopping-card-photo"
                src={URL.createObjectURL(card.shopping.cardphoto)}
                style={{
                  width: `${sizeMiniCard.width}px`,
                  height: `${sizeMiniCard.height}px`,
                }}
                alt="shoppingCardPhoto"
              ></img>
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

export default Shopping

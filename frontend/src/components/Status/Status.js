import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineShoppingCart } from 'react-icons/md'
import './Status.scss'
import { infoButtons } from '../../redux/infoButtons/actionCreators'
import { changeIconStyles } from '../../data/toolbar/changeIconStyles'

const Status = () => {
  const infoBtnsStatus = useSelector((state) => state.infoButtons.status)
  const infoFullCard = useSelector((state) => state.infoButtons.fullCard)
  const [btnsStatus, setBtnsStatus] = useState({ status: {} })
  const listBtnsStatus = ['shopping']
  const dispatch = useDispatch()

  useEffect(() => {
    if (infoBtnsStatus) {
      setBtnsStatus((state) => {
        return {
          ...state,
          status: {
            ...state.status,
            ...listBtnsStatus.reduce((acc, key) => {
              acc[key] = infoBtnsStatus[key]
              return acc
            }, {}),
          },
        }
      })
    }
    console.log('btnsStatus1', btnsStatus)
  }, [])

  useEffect(() => {
    setBtnsStatus((state) => {
      return {
        ...state,
        status: {
          ...state.status,
          shopping: infoFullCard.plus ? true : false,
        },
      }
    })
    dispatch(
      infoButtons({
        status: {
          ...infoBtnsStatus,
          shopping: infoFullCard.plus ? true : false,
        },
      })
    )
  }, [infoFullCard, setBtnsStatus, dispatch])

  // useEffect(() => {
  //   if (btnsStatus && btnIconRefs.current) {
  //     changeIconStyles(btnsCardtext, btnIconRefs.current)
  //   }
  // }, [btnsCardtext, btnIconRefs])

  console.log('btnsStatus0', btnsStatus)

  return (
    <div className="status-container">
      <button className="toolbar-btn">
        <MdOutlineShoppingCart className="toolbar-status-icon" />
      </button>
    </div>
  )
}

export default Status

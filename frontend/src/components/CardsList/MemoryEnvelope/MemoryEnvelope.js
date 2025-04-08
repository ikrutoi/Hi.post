import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CgClose } from 'react-icons/cg'
import './MemoryEnvelope.scss'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'
import { choiceAddress } from '../../../redux/layout/actionCreators'
import {
  getAllRecordsAddresses,
  deleteRecordAddress,
} from '../../../utils/cardFormNav/indexDB/indexDb'

const MemoryEnvelope = ({ sizeMiniCard }) => {
  const dispatch = useDispatch()
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
  const [currentSection, setCurrentSection] = useState(null)
  const [memoryAddress, setMemoryAddress] = useState({
    myaddress: null,
    toaddress: null,
  })

  const handleClickMiniKebab = async (evt, section, id) => {
    evt.stopPropagation()
    switch (section) {
      case 'myaddress':
        await deleteRecordAddress('myaddress', id)
        getAllAddress(section)
        break
      case 'toaddress':
        await deleteRecordAddress('toaddress', id)
        getAllAddress(section)
        break

      default:
        break
    }
  }

  useEffect(() => {
    setCurrentSection(infoChoiceClip)
    switch (infoChoiceClip) {
      case 'myaddress':
        getAllAddress('myaddress')
        break
      case 'toaddress':
        getAllAddress('toaddress')
        break

      default:
        break
    }
  }, [infoChoiceClip])

  const getAllAddress = async (section) => {
    const listAddress = await getAllRecordsAddresses(
      section === 'myaddress' ? 'myaddress' : 'toaddress'
    )
    const sortListAddress = listAddress.sort((a, b) => {
      return a.address.name.localeCompare(b.address.name)
    })
    setMemoryAddress((state) => {
      return {
        ...state,
        [section]: sortListAddress,
      }
    })
  }

  const handleClickAddress = (section, id) => {
    dispatch(choiceAddress({ section, id }))
  }

  return (
    <div className="memory-list">
      {memoryAddress[currentSection] &&
        memoryAddress[currentSection].map((address, i) => (
          <div
            key={`${i}`}
            className={`memory-card memory-envelope-card memory-envelope-${currentSection}`}
            // ref={setRef(`${currentSection}-${address.id}`)}
            style={{
              width: `${sizeMiniCard.width}px`,
              height: `${sizeMiniCard.height}px`,
            }}
            onClick={() => handleClickAddress(currentSection, address.id)}
          >
            {currentSection === 'myaddress' ? (
              <p>{address.address.name}</p>
            ) : (
              ''
            )}
            {/* <p>{address.address.street}</p>
            <p>{address.address.index}</p>
            <p>{address.address.city}</p>
            <p>{address.address.country}</p> */}
            {currentSection === 'toaddress' ? (
              <p>{address.address.name}</p>
            ) : (
              ''
            )}
            <div
              className="card-mini-kebab card-mini-kebab-envelope"
              onClick={(evt) =>
                handleClickMiniKebab(evt, currentSection, address.id)
              }
            >
              {/* <CgClose className="icon-close" /> */}
              {addIconToolbar('remove')}
            </div>
          </div>
        ))}
    </div>
  )
}

export default MemoryEnvelope

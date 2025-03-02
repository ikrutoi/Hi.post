import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Label from '../Label/Label'
import './FormAddress.scss'
import { addIconToolbarEnvelope } from '../../../../../utils/envelope/addIconToolbarEnvelope'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'
import {
  getToAddress,
  getAllMyAddress,
  getAllToAddress,
} from '../../../../../utils/cardFormNav/indexDB/indexDb'
import { dbPromise } from '../../../../../utils/cardFormNav/indexDB/indexDb'

const FormAddress = ({
  values,
  listLabelsAddress,
  handleValue,
  handleMovingBetweenInputs,
  setRef,
  handleSave,
}) => {
  const infoEnvelopeClipMyAddress = useSelector(
    (state) => state.infoButtons.envelopeClipMyAddress
  )
  const infoEnvelopeClipToAddress = useSelector(
    (state) => state.infoButtons.envelopeClipToAddress
  )
  const myAddress = useSelector((state) => state.cardEdit.envelope.myaddress)
  const toAddress = useSelector((state) => state.cardEdit.envelope.toaddress)
  const resultMyAddress = !Object.values(myAddress).some(
    (value) => value === ''
  )
  const resultToAddress = !Object.values(toAddress).some(
    (value) => value === ''
  )
  const [memoryMyAddress, setMemoryMyAddress] = useState(null)
  const [memoryToAddress, setMemoryToAddress] = useState(null)
  const myAddressLegendRef = useRef()
  const toAddressLegendRef = useRef()
  const myAddressFieldsetRef = useRef()
  const toAddressFieldsetRef = useRef()

  // const [lengthMyAddress, setLengthMyAddress] = useState(null)
  // const [lengthToAddress, setLengthToAddress] = useState(null)
  const dispatch = useDispatch()

  // const getAddress = async (section) => {
  //   switch (section) {
  //     case 'myaddress':
  //       const myAddress = await getAllMyAddress('myAddress')
  //       setMemoryMyAddress(myAddress)
  //       break
  //     case 'toaddress':
  //       const toAddress = await getAllToAddress('toAddress')
  //       setMemoryToAddress(toAddress)
  //       break
  //     default:
  //       break
  //   }
  // }

  // useEffect(() => {
  //   if (infoEnvelopeClipMyAddress) {
  //     getAddress('myaddress')
  //   }
  //   if (infoEnvelopeClipToAddress) {
  //     getAddress('toaddress')
  //   }
  // }, [infoEnvelopeClipMyAddress, infoEnvelopeClipToAddress])
  // console.log('memory', memoryMyAddress)

  const getAddressLegendRef = (section) => {
    switch (section) {
      case 'myaddress':
        return myAddressLegendRef
      case 'toaddress':
        return toAddressLegendRef
      default:
        return null
    }
  }

  const getAddressFieldsetRef = (section) => {
    switch (section) {
      case 'myaddress':
        return myAddressFieldsetRef
      case 'toaddress':
        return toAddressFieldsetRef
      default:
        return null
    }
  }

  const getLengthAddress = async (section) => {
    if (section === 'myaddress') {
      const allMyAddress = await getAllMyAddress('myAddress')
      if (allMyAddress.length > 0) {
        return true
      } else {
        return false
      }
    }
    if (section === 'toaddress') {
      const allToAddress = await getAllToAddress('toAddress')
      if (allToAddress.length > 0) {
        return true
      } else {
        return false
      }
    }
  }

  const getAddress = async () => {
    const myAddress = await getAllMyAddress('myAddress')
    setMemoryMyAddress(myAddress)
    const toAddress = await getAllToAddress('toAddress')
    setMemoryToAddress(toAddress)
  }

  useEffect(() => {
    getAddress()
  }, [])

  const handleClickBtn = async (evt, section) => {
    evt.preventDefault()

    const clearAddress = async (section) => {
      const db = await dbPromise
      const transaction = db.transaction(section, 'readwrite')
      const objectStore = transaction.objectStore(section)
      const clearRequest = objectStore.clear()

      clearRequest.onsuccess = () => {
        console.log('All entries have been cleared.')
      }

      clearRequest.onerror = (event) => {
        console.error('Error clearing entries:', event.target.error)
      }
    }

    const parentBtn = searchParentBtnNav(evt.target, section)
    if (parentBtn.dataset.tooltip === 'clip') {
      if (getLengthAddress(section)) {
        if (section === 'myaddress') {
          if (infoEnvelopeClipToAddress) {
            dispatch(infoButtons({ envelopeClipToAddress: false }))
            if (toAddressFieldsetRef.current && toAddressLegendRef.current) {
              toAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
              toAddressFieldsetRef.current.style.borderColor =
                'rgb(211, 211 , 211)'
            }
          }
          if (infoEnvelopeClipMyAddress) {
            dispatch(infoButtons({ envelopeClipMyAddress: false }))
            if (myAddressFieldsetRef.current && myAddressLegendRef.current) {
              myAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
              myAddressFieldsetRef.current.style.borderColor =
                'rgb(211, 211 , 211)'
            }
          } else {
            dispatch(infoButtons({ envelopeClipMyAddress: true }))
            if (myAddressFieldsetRef.current && myAddressLegendRef.current) {
              myAddressLegendRef.current.style.color = '#007aac'
              myAddressFieldsetRef.current.style.borderColor = '#007aac'
            }
          }
        }
        if (section === 'toaddress') {
          if (infoEnvelopeClipMyAddress) {
            dispatch(infoButtons({ envelopeClipMyAddress: false }))
            if (myAddressFieldsetRef.current && myAddressLegendRef.current) {
              myAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
              myAddressFieldsetRef.current.style.borderColor =
                'rgb(211, 211 , 211)'
            }
          }
          if (infoEnvelopeClipToAddress) {
            dispatch(infoButtons({ envelopeClipToAddress: false }))
            if (toAddressFieldsetRef.current && toAddressLegendRef.current) {
              toAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
              toAddressFieldsetRef.current.style.borderColor =
                'rgb(211, 211 , 211)'
            }
          } else {
            dispatch(infoButtons({ envelopeClipToAddress: true }))
            if (toAddressFieldsetRef.current && toAddressLegendRef.current) {
              toAddressLegendRef.current.style.color = '#007aac'
              toAddressFieldsetRef.current.style.borderColor = '#007aac'
            }
          }
        }
      }
    }

    const changeParityInputsAddress = (section) => {
      const getSection = (section) => {
        switch (section) {
          case 'myaddress':
            return [memoryMyAddress, myAddress]
          case 'toaddress':
            return [memoryToAddress, toAddress]
          default:
            break
        }
      }

      getSection(section)[0].forEach((el) => {
        const arrInputs = []
        for (const key in el.address) {
          if (el.address[key] === getSection[1][key]) {
            arrInputs.push(true)
          } else {
            arrInputs.push(false)
          }
        }
        const parityAddress = arrInputs.every((value) => value === true)
        if (parityAddress) {
          return true
        }
      })
      return false
    }

    if (parentBtn.dataset.tooltip === 'save' && section === 'myaddress') {
      if (resultMyAddress) {
        const parity = changeParityInputsAddress('myaddress')
        console.log('parity myaddress', parity)
        handleSave(section)
      }
      if (parentBtn.style.color === 'rgb(71, 71, 71)') {
        parentBtn.style.color = 'rgb(163, 163, 163)'
        parentBtn.style.cursor = 'default'
      }
    }
    if (parentBtn.dataset.tooltip === 'save' && section === 'toaddress') {
      if (resultToAddress) {
        const parity = changeParityInputsAddress('toaddress')
        console.log('parity toaddress', parity)
        handleSave(section)
      }
      if (parentBtn.style.color === 'rgb(71, 71, 71)') {
        parentBtn.style.color = 'rgb(163, 163, 163)'
        parentBtn.style.cursor = 'default'
      }
    }
    if (parentBtn.dataset.tooltip === 'delete' && section === 'myaddress') {
      clearAddress('myAddress')
    }
    if (parentBtn.dataset.tooltip === 'delete' && section === 'toaddress') {
      clearAddress('toAddress')
    }
    getAddress()
  }

  const btnRefs = useRef({})

  const handleRef = (name) => (element) => {
    btnRefs.current[name] = element
  }

  const listBtns = ['save', 'clip', 'delete']

  const searchParentBtnNav = (el) => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement)
    }
    return null
  }

  const handleMouseEnterBtn = (evt, btn) => {
    const parentBtnNav = searchParentBtnNav(evt.target)
    const section = parentBtnNav.dataset.section
    const hover = () => {
      parentBtnNav.style.color = 'rgb(71, 71, 71)'
      parentBtnNav.style.cursor = 'pointer'
    }
    if (section === 'myaddress' && btn === 'save') {
      if (resultMyAddress) {
        hover()
      }
    }
    if (section === 'toaddress' && btn === 'save') {
      if (resultToAddress) {
        hover()
      }
    }
    if (btn === 'clip') {
      switch (section) {
        case 'myaddress':
          if (memoryMyAddress) {
            hover()
          }
          break
        case 'toaddress':
          if (memoryToAddress) {
            hover()
          }
          break

        default:
          break
      }
      hover()
    }
    if (btn === 'delete') {
      hover()
    }
  }

  const handleMouseLeaveBtn = (evt) => {
    const parentBtnNav = searchParentBtnNav(evt.target)
    parentBtnNav.style.color = 'rgb(163, 163, 163)'
    parentBtnNav.style.cursor = 'default'
  }

  return (
    <form className={`envelope-form form-${listLabelsAddress.name}`}>
      {/* <div className="envelope-history"></div> */}
      <div
        className={`toolbar-envelope-container envelope-container-${listLabelsAddress.name}`}
      >
        {listBtns.map((btn, i) => {
          return (
            <button
              key={i}
              data-tooltip={btn}
              data-section={listLabelsAddress.name}
              ref={handleRef(btn)}
              className={`toolbar-btn toolbar-btn-envelope btn-envelope-${btn}`}
              onClick={(evt) => handleClickBtn(evt, listLabelsAddress.name)}
              onMouseEnter={(evt) => handleMouseEnterBtn(evt, btn)}
              onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btn)}
            >
              {addIconToolbarEnvelope(btn)}
            </button>
          )
        })}
      </div>
      <fieldset
        className="envelope-fieldset"
        ref={getAddressFieldsetRef(listLabelsAddress.name)}
      >
        <legend
          className="envelope-legend"
          ref={getAddressLegendRef(listLabelsAddress.name)}
        >
          {listLabelsAddress.name === 'myaddress' ? 'My address' : 'To address'}
        </legend>{' '}
        {listLabelsAddress.list.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              key={`${nameFirst}-${i}`}
              name={nameFirst}
              field={listLabelsAddress.name}
              values={values}
              handleValue={handleValue}
              handleMovingBetweenInputs={handleMovingBetweenInputs}
              setRef={setRef}
            />
          ) : (
            <div
              className="input-two-elements"
              key={`${listLabelsAddress.name}-${i}`}
            >
              {nameFirst.map((nameSecond, j) => (
                <Label
                  key={`${nameSecond}-${i}-${j}`}
                  name={nameSecond}
                  field={listLabelsAddress.name}
                  values={values}
                  handleValue={handleValue}
                  handleMovingBetweenInputs={handleMovingBetweenInputs}
                  setRef={setRef}
                />
              ))}
            </div>
          )
        })}
      </fieldset>
    </form>
  )
}

export default FormAddress

import { useEffect, useRef, useState } from 'react'
import Label from '../Label/Label'
import { useSelector } from 'react-redux'
import './FormAddress.scss'
import { addIconToolbarEnvelope } from '../../../../../utils/envelope/addIconToolbarEnvelope'
import {
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
  toAddressLegendRef,
  myAddressLegendRef,
  toAddressFieldsetRef,
  myAddressFieldsetRef,
  handleClickBtn,
}) => {
  const myAddress = useSelector((state) => state.cardEdit.envelope.myaddress)
  const toAddress = useSelector((state) => state.cardEdit.envelope.toaddress)
  const infoEnvelopeClipMyAddress = useSelector(
    (state) => state.infoButtons.envelopeClipMyAddress
  )
  const infoEnvelopeClipToAddress = useSelector(
    (state) => state.infoButtons.envelopeClipToAddress
  )
  const resultMyAddress = !Object.values(myAddress).some(
    (value) => value === ''
  )
  const resultToAddress = !Object.values(toAddress).some(
    (value) => value === ''
  )
  const [memoryMyAddress, setMemoryMyAddress] = useState(null)
  const [memoryToAddress, setMemoryToAddress] = useState(null)

  const btnRefs = useRef({})

  const handleRef = (name) => (element) => {
    btnRefs.current[name] = element
  }

  // dbPromise.then((db) => {
  //   const observeChanges = (storeName) => {
  //     const transaction = db.transaction(storeName, 'readwrite')
  //     const objectStore = transaction.objectStore(storeName)

  //     const onChange = (event) => {
  //       objectStore.count().then((count) => {
  //         console.log(`Number of entries in ${storeName}:`, count)
  //       })
  //     }

  //     transaction.oncomplete = onChange
  //     transaction.onabort = onChange
  //     transaction.onerror = onChange
  //   }

  //   observeChanges('myAddress')
  //   observeChanges('toAddress')
  // })

  const getAddress = async (section) => {
    switch (section) {
      case 'myaddress':
        const myAddress = await getAllMyAddress('myAddress')
        myAddress.length === 0
          ? setMemoryMyAddress(false)
          : setMemoryMyAddress(true)
        break
      case 'toaddress':
        const toAddress = await getAllToAddress('toAddress')
        toAddress.length === 0
          ? setMemoryToAddress(false)
          : setMemoryToAddress(true)
        setMemoryToAddress(toAddress)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (infoEnvelopeClipMyAddress) {
      getAddress('myaddress')
    }
    if (infoEnvelopeClipToAddress) {
      getAddress('toaddress')
    }
  }, [infoEnvelopeClipMyAddress, infoEnvelopeClipToAddress])

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
          // console.log('memoryMyAddress', memoryMyAddress)
          if (memoryMyAddress) {
            console.log('hover')
            hover()
          }
          break
        case 'toaddress':
          // console.log('memoryToAddress', memoryToAddress)
          if (memoryToAddress) {
            hover()
          }
          break

        default:
          break
      }
      // hover()
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

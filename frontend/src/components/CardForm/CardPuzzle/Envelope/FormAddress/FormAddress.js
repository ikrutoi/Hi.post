import { useRef, useState } from 'react'
import Label from '../Label/Label'
import { useSelector } from 'react-redux'
import './FormAddress.scss'
import { addIconToolbarEnvelope } from '../../../../../utils/envelope/addIconToolbarEnvelope'

const FormAddress = ({
  values,
  listLabelsAddress,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  myAddressRefs,
  toAddressRefs,
  lengthAddress,
  handleClickBtn,
  setIconRef,
  iconsMyAddress,
  iconsToAddress,
}) => {
  const myAddress = useSelector((state) => state.cardEdit.envelope.myaddress)
  const toAddress = useSelector((state) => state.cardEdit.envelope.toaddress)

  const resultMyAddress = !Object.values(myAddress).some(
    (value) => value === ''
  )
  const resultToAddress = !Object.values(toAddress).some(
    (value) => value === ''
  )
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

  const getAddressLegendRef = (section) => {
    switch (section) {
      case 'myaddress':
        return myAddressRefs[1]
      case 'toaddress':
        return toAddressRefs[1]
      default:
        return null
    }
  }

  const getAddressFieldsetRef = (section) => {
    switch (section) {
      case 'myaddress':
        return myAddressRefs[0]
      case 'toaddress':
        return toAddressRefs[0]
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
      parentBtnNav.style.color = 'rgb(0, 122, 172)'
      // parentBtnNav.style.color = 'rgb(71, 71, 71)'
      parentBtnNav.style.cursor = 'pointer'
    }
    if (section === 'myaddress' && btn === 'save' && iconsMyAddress[0]) {
      // if (resultMyAddress) {
      console.log('hover')
      hover()
      // }
    }
    if (section === 'toaddress' && btn === 'save') {
      if (resultToAddress) {
        hover()
      }
    }
    if (btn === 'clip') {
      switch (section) {
        case 'myaddress':
          if (lengthAddress[0] > 0) {
            hover()
          }
          break
        case 'toaddress':
          if (lengthAddress[1] > 0) {
            hover()
          }
          break

        default:
          break
      }
    }
    if (btn === 'delete') {
      switch (listLabelsAddress.name) {
        case 'myaddress':
          if (lengthAddress[0] > 0) {
            hover()
          }
          break
        case 'toaddress':
          if (lengthAddress[1] > 0) {
            hover()
          }
          break

        default:
          break
      }
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
              {addIconToolbarEnvelope(listLabelsAddress.name, btn, setIconRef)}
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
              setInputRef={setInputRef}
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
                  setInputRef={setInputRef}
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

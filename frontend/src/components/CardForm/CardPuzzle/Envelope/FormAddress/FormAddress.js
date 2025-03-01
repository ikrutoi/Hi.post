import { useRef, useState } from 'react'
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
  // const [lengthMyAddress, setLengthMyAddress] = useState(null)
  // const [lengthToAddress, setLengthToAddress] = useState(null)
  const dispatch = useDispatch()

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

  const handleClickBtn = async (evt, section) => {
    evt.preventDefault()

    const parentBtn = searchParentBtnNav(evt.target, section)
    if (parentBtn.dataset.tooltip === 'clip') {
      if (getLengthAddress(section)) {
        if (section === 'myaddress') {
          if (infoEnvelopeClipToAddress) {
            dispatch(infoButtons({ envelopeClipToAddress: false }))
          }
          if (infoEnvelopeClipMyAddress) {
            dispatch(infoButtons({ envelopeClipMyAddress: false }))
          } else {
            dispatch(infoButtons({ envelopeClipMyAddress: true }))
          }
        }
        if (section === 'toaddress') {
          if (infoEnvelopeClipMyAddress) {
            dispatch(infoButtons({ envelopeClipMyAddress: false }))
          }
          if (infoEnvelopeClipToAddress) {
            dispatch(infoButtons({ envelopeClipToAddress: false }))
          } else {
            dispatch(infoButtons({ envelopeClipToAddress: true }))
          }
        }
      }
    }
    if (parentBtn.dataset.tooltip === 'save' && section === 'myaddress') {
      if (resultMyAddress) {
        handleSave(section)
      }
    }
    if (parentBtn.dataset.tooltip === 'save' && section === 'toaddress') {
      if (resultToAddress) {
        handleSave(section)
      }
    }
  }
  const btnRefs = useRef({})

  const handleRef = (name) => (element) => {
    btnRefs.current[name] = element
  }

  const listBtns = ['save', 'clip']

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
    if (btn === 'clip' && getLengthAddress(section)) {
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
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">
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

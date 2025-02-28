import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Label from '../Label/Label'
import './FormAddress.scss'
import { addIconToolbarEnvelope } from '../../../../../utils/envelope/addIconToolbarEnvelope'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'
// import {
//   addMyAddress,
//   getMyAddress,
//   deleteMyAddress,
//   addToAddress,
//   getToAddress,
//   deleteToAddress,
// } from '../../../../../utils/cardFormNav/indexDB/indexDb'

const FormAddress = ({
  values,
  listLabelsAddress,
  handleValue,
  handleMovingBetweenInputs,
  setRef,
  handleSave,
}) => {
  const infoEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  const dispatch = useDispatch()

  const handleClickBtn = (evt, section) => {
    evt.preventDefault()
    const parentBtn = searchParentBtnNav(evt.target)
    if (parentBtn.dataset.tooltip === 'clip') {
      if (infoEnvelopeClip) {
        dispatch(infoButtons({ envelopeClip: false }))
      } else {
        dispatch(infoButtons({ envelopeClip: true }))
      }
    }
    if (parentBtn.dataset.tooltip === 'save') {
      handleSave(section)
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

  const handleMouseEnterBtn = (evt) => {
    const parentBtnNav = searchParentBtnNav(evt.target)
    parentBtnNav.style.color = 'rgb(71, 71, 71)'
    parentBtnNav.style.cursor = 'pointer'
  }

  const handleMouseLeaveBtn = (evt) => {
    const parentBtnNav = searchParentBtnNav(evt.target)
    parentBtnNav.style.color = 'rgb(163, 163, 163)'
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
              ref={handleRef(btn)}
              className={`toolbar-btn toolbar-btn-envelope btn-envelope-${btn}`}
              onClick={(evt) => handleClickBtn(evt, listLabelsAddress.name)}
              onMouseEnter={(evt) => handleMouseEnterBtn(evt)}
              onMouseLeave={(evt) => handleMouseLeaveBtn(evt)}
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

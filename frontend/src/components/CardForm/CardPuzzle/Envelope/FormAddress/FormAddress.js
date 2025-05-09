import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Label from '../Label/Label'
import './FormAddress.scss'
import { addIconToolbar } from '../../../../../data/toolbar/addIconToolbar'
import listBtnsEnvelope from '../../../../../data/toolbar/listBtnsEnvelope.json'
import {
  getAllRecordsAddresses,
  getCountRecordsAddresses,
} from '../../../../../utils/cardFormNav/indexDB/indexDb'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'

const FormAddress = ({
  values,
  listLabelsAddress,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  setBtnIconRef,
  setAddressFormRef,
  handleClickBtn,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const [countAddress, setCountAddress] = useState({
    myaddress: null,
    toaddress: null,
  })
  const infoEnvelopeSaveSecond = useSelector(
    (state) => state.infoButtons.envelopeSaveSecond
  )
  const infoEnvelopeRemove = useSelector(
    (state) => state.infoButtons.envelopeRemoveAddress
  )

  const dispatch = useDispatch()

  const updateCounts = async (section) => {
    const countAddress = await getCountRecordsAddresses(section)
    setCountAddress((state) => ({
      ...state,
      [section]: countAddress,
    }))
  }

  useEffect(() => {
    updateCounts(listLabelsAddress.name)
  }, [])

  useEffect(() => {
    if (infoEnvelopeSaveSecond) {
      updateCounts(infoEnvelopeSaveSecond)
      dispatch(infoButtons({ envelopeSaveSecond: false }))
    }
  }, [infoEnvelopeSaveSecond, dispatch])

  useEffect(() => {
    if (infoEnvelopeRemove) {
      updateCounts(infoEnvelopeRemove)
      dispatch(infoButtons({ envelopeRemoveAddress: false }))
    }
  }, [infoEnvelopeRemove, dispatch])

  return (
    <form className={`envelope-form form-${listLabelsAddress.name}`}>
      <div
        className={`toolbar-container toolbar-envelope-container envelope-container-${listLabelsAddress.name}`}
      >
        {listBtnsEnvelope.map((btn, i) => {
          return (
            <button
              key={`${i}-${btn}`}
              data-tooltip={btn}
              data-section={listLabelsAddress.name}
              ref={setBtnIconRef(`${listLabelsAddress.name}-${btn}`)}
              className={`toolbar-btn toolbar-btn-envelope btn-envelope-${btn}`}
              onClick={(evt) => handleClickBtn(evt, listLabelsAddress.name)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {addIconToolbar(btn)}
              {btn === 'clip' && countAddress[listLabelsAddress.name] ? (
                <span
                  className={`counter-container envelope-counter-container ${btn}-counter-container`}
                >
                  <span className={`status-counter ${btn}-counter`}>
                    {countAddress[listLabelsAddress.name]}
                  </span>
                </span>
              ) : (
                <></>
              )}
            </button>
          )
        })}
      </div>
      <fieldset
        className="envelope-fieldset"
        ref={setAddressFormRef(`${listLabelsAddress.name}-fieldset`)}
      >
        <legend
          className="envelope-legend"
          ref={setAddressFormRef(`${listLabelsAddress.name}-legend`)}
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

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Label from '../Label/Label'
import './FormAddress.scss'
import listBtnsEnvelope from '../../../../../data/toolbar/listBtnsEnvelope.json'
import { addIconToolbar } from '../../../../../data/toolbar/getIconElement'
import { getCountRecordsAddresses } from '../../../../../utils/cardFormNav/indexDB/indexDb'
import { updateButtonsState } from '../../../../../store/slices/infoButtonsSlice'
import { FormAddressProps } from '../../../../../types/FormAddress'
import { RootState } from '../../../../../store'

const FormAddress: React.FC<FormAddressProps> = ({
  values,
  listLabelsAddress,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  setBtnIconRef,
  setAddressFieldsetRef,
  setAddressLegendRef,
  handleClickBtn,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const [countAddress, setCountAddress] = useState<
    Record<'myaddress' | 'toaddress', number | null>
  >({
    myaddress: null,
    toaddress: null,
  })

  const infoEnvelopeSaveSecond = useSelector(
    (state: RootState) => state.infoButtons.envelopeSaveSecond
  )
  const infoEnvelopeRemove = useSelector(
    (state: RootState) => state.infoButtons.envelopeRemoveAddress
  )

  const dispatch = useDispatch()

  const updateCounts = async (section: 'myaddress' | 'toaddress') => {
    const count = await getCountRecordsAddresses(section)
    setCountAddress((prev) => ({ ...prev, [section]: count }))
  }

  useEffect(() => {
    updateCounts(listLabelsAddress.name)
  }, [])

  useEffect(() => {
    if (infoEnvelopeSaveSecond) {
      updateCounts(listLabelsAddress.name)
      dispatch(updateButtonsState({ envelopeSaveSecond: false }))
    }
  }, [infoEnvelopeSaveSecond, dispatch])

  useEffect(() => {
    if (infoEnvelopeRemove) {
      updateCounts(listLabelsAddress.name)
      dispatch(updateButtonsState({ envelopeRemoveAddress: false }))
    }
  }, [infoEnvelopeRemove, dispatch])

  return (
    <form className={`envelope-form form-${listLabelsAddress.name}`}>
      <div
        className={`toolbar-container toolbar-envelope-container envelope-container-${listLabelsAddress.name}`}
      >
        {listBtnsEnvelope.map((btn: string, i: number) => (
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
            {btn === 'clip' &&
              countAddress[listLabelsAddress.name] !== null && (
                <span
                  className={`counter-container envelope-counter-container ${btn}-counter-container`}
                >
                  <span className={`status-counter ${btn}-counter`}>
                    {countAddress[listLabelsAddress.name]}
                  </span>
                </span>
              )}
          </button>
        ))}
      </div>
      <fieldset
        className="envelope-fieldset"
        ref={setAddressFieldsetRef(`${listLabelsAddress.name}-fieldset`)}
      >
        <legend
          className="envelope-legend"
          ref={setAddressLegendRef(`${listLabelsAddress.name}-legend`)}
        >
          {listLabelsAddress.name === 'myaddress' ? 'My address' : 'To address'}
        </legend>
        {listLabelsAddress.list.map((nameFirst, i) =>
          typeof nameFirst === 'string' ? (
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
        )}
      </fieldset>
    </form>
  )
}

export default FormAddress

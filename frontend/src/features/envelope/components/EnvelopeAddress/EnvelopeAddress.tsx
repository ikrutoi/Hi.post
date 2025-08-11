import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@features/envelope/components/Label/Label'
import './EnvelopeAddress.css'
import { en } from '@locales/en/common'
import { getIconElement } from '@entities/icons'
import {
  assetRecipientAddressAdapter,
  assetSenderAddressAdapter,
} from '@db/adapters'
import { updateButtonsState } from '@store/slices/infoButtonsSlice'
import type { RootState } from '@app/store/store'
import { getAddressLabelLayout } from '@i18n/index'
import { EnvelopeAddressProps } from '@features/envelope/types'

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  values,
  role,
  lang,
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
  const listBtnsEnvelope = ['save', 'delete', 'clip'] as const
  const labelLayout = getAddressLabelLayout(role, lang)

  type EnvelopeBtn = (typeof listBtnsEnvelope)[number]

  const [countAddress, setCountAddress] = useState<
    Record<'sender' | 'recipient', number | null>
  >({
    sender: null,
    recipient: null,
  })

  const infoEnvelopeSaveSecond = useSelector(
    (state: RootState) => state.infoButtons.envelopeSaveSecond
  )
  const infoEnvelopeRemove = useSelector(
    (state: RootState) => state.infoButtons.envelopeRemoveAddress
  )

  const dispatch = useDispatch()

  const updateCounts = async (section: 'sender' | 'recipient') => {
    let count: number
    if (section === 'sender') {
      count = await assetSenderAddressAdapter.count()
    }
    if (section === 'recipient') {
      count = await assetRecipientAddressAdapter.count()
    }
    setCountAddress((prev) => ({ ...prev, [section]: count }))
  }

  useEffect(() => {
    updateCounts(role)
  }, [])

  useEffect(() => {
    if (infoEnvelopeSaveSecond) {
      updateCounts(role)
      dispatch(updateButtonsState({ envelopeSaveSecond: false }))
    }
  }, [infoEnvelopeSaveSecond, dispatch])

  useEffect(() => {
    if (infoEnvelopeRemove) {
      updateCounts(role)
      dispatch(updateButtonsState({ envelopeRemoveAddress: false }))
    }
  }, [infoEnvelopeRemove, dispatch])

  return (
    <form className={`envelope-form form-${role}`}>
      <div
        className={`toolbar-container toolbar-envelope-container envelope-container-${role}`}
      >
        {listBtnsEnvelope.map((btn: EnvelopeBtn, i) => (
          <button
            key={`${i}-${btn}`}
            data-tooltip={btn}
            data-section={role}
            ref={setBtnIconRef(`${role}-${btn}`)}
            className={`toolbar-btn toolbar-btn-envelope btn-envelope-${btn}`}
            onClick={(evt) => handleClickBtn(evt, role)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {getIconElement(btn)}
            {btn === 'clip' && countAddress[role] !== null && (
              <span
                className={`counter-container envelope-counter-container ${btn}-counter-container`}
              >
                <span className={`status-counter ${btn}-counter`}>
                  {countAddress[role]}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      <fieldset
        className="envelope-fieldset"
        ref={setAddressFieldsetRef(`${role}-fieldset`)}
      >
        <legend
          className="envelope-legend"
          ref={setAddressLegendRef(`${role}-legend`)}
        >
          {role === 'sender' ? 'Sender address' : 'Recipient address'}
        </legend>

        {labelLayout.map((labelItem, i) =>
          Array.isArray(labelItem) ? (
            <div className="input-two-elements" key={`${role}-group-${i}`}>
              {labelItem.map((subLabel, j) => (
                <Label
                  key={`${subLabel.field}-${i}-${j}`}
                  role={role}
                  label={subLabel.label}
                  field={subLabel.field}
                  values={values}
                  handleValue={handleValue}
                  handleMovingBetweenInputs={handleMovingBetweenInputs}
                  setInputRef={setInputRef}
                />
              ))}
            </div>
          ) : (
            <Label
              key={`${labelItem.field}-${i}`}
              role={role}
              label={labelItem.label}
              field={labelItem.field}
              values={values}
              handleValue={handleValue}
              handleMovingBetweenInputs={handleMovingBetweenInputs}
              setInputRef={setInputRef}
            />
          )
        )}
      </fieldset>
    </form>
  )
}

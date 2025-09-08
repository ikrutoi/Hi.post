import React from 'react'

import './EnvelopeAddress.scss'

import { Label } from './Label/Label'

import { getIconElement } from '@entities/icons'
import { getAddressLabelLayout } from '@i18n/index'
import { useAddressCount } from '@envelope/addressForm/application'
import type { EnvelopeAddressProps } from './EnvelopeAddress.types'

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
  const labelLayout = getAddressLabelLayout(role, lang)
  const count = useAddressCount(role)

  const buttons = ['save', 'delete', 'clip'] as const

  return (
    <form className={`address-form address-form--${role}`}>
      <div className={`address-form__toolbar address-form__toolbar--${role}`}>
        {buttons.map((btn) => (
          <button
            key={btn}
            data-tooltip={btn}
            data-section={role}
            ref={setBtnIconRef(`${role}-${btn}`)}
            className={`address-form__btn address-form__btn--${btn}`}
            onClick={(evt) => handleClickBtn(evt, role)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {getIconElement(btn)}
            {btn === 'clip' && count !== null && (
              <span className="address-form__counter">
                <span className="address-form__counter-value">{count}</span>
              </span>
            )}
          </button>
        ))}
      </div>

      <fieldset
        className="address-form__fieldset"
        ref={setAddressFieldsetRef(`${role}-fieldset`)}
      >
        <legend
          className="address-form__legend"
          ref={setAddressLegendRef(`${role}-legend`)}
        >
          {role === 'sender' ? 'Sender address' : 'Recipient address'}
        </legend>

        {labelLayout.map((labelItem, i) =>
          Array.isArray(labelItem) ? (
            <div className="address-form__group" key={`${role}-group-${i}`}>
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

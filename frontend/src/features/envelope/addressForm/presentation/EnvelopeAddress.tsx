import React from 'react'
import './EnvelopeAddress.scss'
import { Label } from './Label/Label'
import { LabelGroup } from './LabelGroup/LabelGroup'
import { getIconElement } from '@entities/icons'
import { useEnvelopeAddress } from '../application/hooks'
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
  const { labelLayout, count, buttons } = useEnvelopeAddress(role, lang)

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

        {labelLayout.map((item, i) =>
          Array.isArray(item) ? (
            <LabelGroup
              group={item}
              role={role}
              values={values}
              handleValue={handleValue}
              handleMovingBetweenInputs={handleMovingBetweenInputs}
              setInputRef={setInputRef}
              groupIndex={i}
            />
          ) : (
            <Label
              key={`${item.field}-${i}`}
              role={role}
              label={item.label}
              field={item.field}
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

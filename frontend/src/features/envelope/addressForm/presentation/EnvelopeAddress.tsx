import React from 'react'
import clsx from 'clsx'
import { Label } from './Label/Label'
import { LabelGroup } from './LabelGroup/LabelGroup'
import { getToolbarIcon } from '@shared/utils/icons'
import { useEnvelopeAddress } from '../application/hooks'
import type { EnvelopeAddressProps } from '../domain/types'
import styles from './EnvelopeAddress.module.scss'

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  value,
  role,
  lang,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  setBtnIconRef,
  setAddressFieldsetRef,
  setAddressLegendRef,
  handleAddressAction,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const { labelLayout, count, buttons } = useEnvelopeAddress(role, lang)

  return (
    <form className={clsx(styles.addressForm, styles[`addressForm--${role}`])}>
      <div
        className={clsx(
          styles.addressForm__toolbar,
          styles[`addressForm__toolbar--${role}`]
        )}
      >
        {buttons.map((btn) => (
          <button
            key={btn}
            data-tooltip={btn}
            data-section={role}
            ref={setBtnIconRef(`${role}-${btn}`)}
            className={clsx(
              styles.addressForm__btn,
              styles[`addressForm__btn--${btn}`]
            )}
            onClick={() => handleAddressAction(btn, role)}
            onMouseEnter={() => handleMouseEnter(`${role}-${btn}`)}
            onMouseLeave={() => handleMouseLeave(null)}
          >
            {getToolbarIcon(btn)}
            {btn === 'savedTemplates' && count !== null && (
              <span className={styles.addressForm__counter}>
                <span className={styles.addressForm__counterValue}>
                  {count}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      <fieldset
        className={styles.addressForm__fieldset}
        ref={setAddressFieldsetRef(`${role}-fieldset`)}
      >
        <legend
          className={styles.addressForm__legend}
          ref={setAddressLegendRef(`${role}-legend`)}
        >
          {role === 'sender' ? 'Sender address' : 'Recipient address'}
        </legend>

        {labelLayout.map((item, i) =>
          Array.isArray(item) ? (
            <LabelGroup
              key={`group-${i}`}
              group={item}
              role={role}
              valueRole={value[role]}
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
              valueRole={value[role][item.field]}
              index={i}
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

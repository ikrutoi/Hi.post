import Label from '../Label/Label'
import './FormAddress.scss'
import { addIconToolbar } from '../../../../../data/toolbar/addIconToolbar'
import listBtnsEnvelope from '../../../../../data/toolbar/listBtnsEnvelope.json'

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

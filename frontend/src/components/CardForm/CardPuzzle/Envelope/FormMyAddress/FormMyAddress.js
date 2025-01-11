import listLabels from '../../../../../data/envelope/list-labels-my-address.json'
import Label from '../Label/Label'
import './FormMyAddress.scss'

const FormMyAddress = ({
  values,
  handleValues,
  handleMovingBetweenInputs,
  setRef,
}) => {
  return (
    <form className="envelope-form form-my-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">My address</legend>
        {listLabels.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              key={`${nameFirst}-${i}`}
              name={nameFirst}
              field="myaddress"
              values={values}
              handleValues={handleValues}
              handleMovingBetweenInputs={handleMovingBetweenInputs}
              setRef={setRef}
            />
          ) : (
            <div className="input-two-elements">
              {nameFirst.map((nameSecond, i) => (
                <Label
                  key={`${nameSecond}-${i}`}
                  name={nameSecond}
                  field="myaddress"
                  values={values}
                  handleValues={handleValues}
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

export default FormMyAddress

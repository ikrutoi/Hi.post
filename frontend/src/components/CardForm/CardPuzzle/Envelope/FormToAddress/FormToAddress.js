import labelsList from '../../../../../data/envelope/list-labels-to-address.json'
import Label from '../Label/Label'
import './FormToAddress.scss'

const FormToAddress = ({ valueToAddress, handleValueToAddress }) => {
  return (
    <form className="envelope-form form-to-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">To address</legend>
        {labelsList.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              name={nameFirst}
              valueToAddress={valueToAddress}
              handleValueToAddress={handleValueToAddress}
              key={`${nameFirst}-${i}`}
            />
          ) : (
            <div className="input-two-elements">
              {nameFirst.map((nameSecond, i) => (
                <Label
                  name={nameSecond}
                  valueToAddress={valueToAddress}
                  handleValueToAddress={handleValueToAddress}
                  key={`${nameSecond}-${i}`}
                />
              ))}
            </div>
          )
        })}
      </fieldset>
    </form>
  )
}

export default FormToAddress

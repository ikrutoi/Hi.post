import listLabels from '../../../../../data/envelope/list-labels-my-address.json'
import Label from '../Label/Label'
import './FormMyAddress.scss'

const FormMyAddress = ({ valueMyAddress, handleValueMyAddress }) => {
  return (
    <form className="envelope-form form-my-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">My address</legend>
        {listLabels.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              name={nameFirst}
              valueMyAddress={valueMyAddress}
              handleValueMyAddress={handleValueMyAddress}
              key={`${nameFirst}-${i}`}
            />
          ) : (
            <div className="input-two-elements">
              {nameFirst.map((nameSecond, i) => (
                <Label
                  name={nameSecond}
                  valueMyAddress={valueMyAddress}
                  handleValueMyAddress={handleValueMyAddress}
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

export default FormMyAddress
